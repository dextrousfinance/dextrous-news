import React, { useEffect, useRef, useState } from "react";

export interface NewsItem {
  id: string;
  timestamp: number;
  signal: string;
  short_context: string;
  sentiment: string;
  tokens: string[];
  author: string;
}

export interface NewsPanelProps {
  /** Gloria API token (JWT) — required for the feed */
  gloriaToken: string;
  /** Comma-separated Gloria feed categories */
  categories?: string;
  /** Gloria WebSocket feed URL */
  wsUrl?: string;
  /** Max items kept in the panel */
  maxItems?: number;
  /** Optional CSS class for the wrapper */
  className?: string;
  /** Panel title */
  title?: string;
}

const SENTIMENT_COLOR: Record<string, string> = {
  bullish: "#22c55e",
  positive: "#22c55e",
  bearish: "#ef4444",
  negative: "#ef4444",
  neutral: "#9ca3af",
};

const CACHE_KEY = "dextrous-news-cache-v1";
const RECONNECT_DELAY_MS = 5_000;

function cleanToken(t: string): string {
  return String(t).replace(/^\$/, "").toUpperCase();
}

function perpPath(token: string): string {
  return `/perp/PERP_${cleanToken(token)}_USDC`;
}

function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor(Date.now() / 1000 - ts));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function loadCache(): NewsItem[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCache(items: NewsItem[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(items.slice(0, 50)));
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}

type ConnState = "connecting" | "live" | "reconnecting";

export function NewsPanel({
  gloriaToken,
  categories = "perps,defi,hyperliquid,token_listings,RWA",
  wsUrl = "wss://ai-hub.cryptobriefing.com/ws/feed",
  maxItems = 30,
  className,
  title = "Market News",
}: NewsPanelProps) {
  const [items, setItems] = useState<NewsItem[]>(loadCache);
  const [conn, setConn] = useState<ConnState>("connecting");
  const seenIds = useRef<Set<string>>(new Set(loadCache().map((i) => String(i.id))));
  const wsRef = useRef<WebSocket | null>(null);
  const stopped = useRef(false);

  useEffect(() => {
    stopped.current = false;
    const cats = categories
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    function connect() {
      if (stopped.current) return;
      setConn((prev) => (prev === "live" ? "reconnecting" : prev));
      const ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(gloriaToken)}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setConn("live");
        // Protocol per Gloria feed: one subscribe message per category
        for (const cat of cats) {
          ws.send(JSON.stringify({ type: "subscribe", feed_category: cat }));
        }
      };

      ws.onmessage = (ev) => {
        let msg: any;
        try {
          msg = JSON.parse(ev.data);
        } catch {
          return;
        }
        if (msg.type === "ping") {
          // Server-level keepalive: reply with pong carrying the same timestamp
          try {
            ws.send(JSON.stringify({ type: "pong", timestamp: msg.timestamp }));
          } catch {
            /* socket already closing */
          }
          return;
        }
        if (msg.type !== "data" || msg.action === "subscribed") return;
        const item: NewsItem | undefined = msg.content;
        if (!item) return;
        // WS items may lack a numeric timestamp — stamp arrival time so "time ago" renders
        if (!Number.isFinite(Number(item.timestamp))) {
          item.timestamp = Date.now() / 1000;
        }
        const iid = String(item.id || "");
        // Same item arrives once per subscribed category — dedup by id
        if (iid && seenIds.current.has(iid)) return;
        if (iid) seenIds.current.add(iid);
        setItems((prev) => {
          const next = [item, ...prev].slice(0, Math.max(maxItems, 50));
          saveCache(next);
          return next;
        });
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (!stopped.current) {
          setConn("reconnecting");
          setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };

      ws.onerror = () => {
        try {
          ws.close();
        } catch {
          /* already closed */
        }
      };
    }

    connect();
    return () => {
      stopped.current = true;
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {
          /* already closed */
        }
      }
    };
  }, [gloriaToken, categories, wsUrl, maxItems]);

  const connLabel: Record<ConnState, { text: string; color: string }> = {
    connecting: { text: "connecting", color: "#eab308" },
    live: { text: "live", color: "#22c55e" },
    reconnecting: { text: "reconnecting", color: "#eab308" },
  };

  return (
    <div
      className={className}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 16px",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            opacity: 0.7,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "1px 8px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            color: connLabel[conn].color,
          }}
        >
          ● {connLabel[conn].text}
        </span>
      </div>

      {items.length === 0 && (
        <div style={{ fontSize: 13, opacity: 0.5 }}>
          Waiting for market news…
        </div>
      )}

      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {items.map((item) => {
          const sentiment = (item.sentiment || "").toLowerCase();
          const dot = SENTIMENT_COLOR[sentiment] || SENTIMENT_COLOR.neutral;
          const tokens = (item.tokens || []).map(cleanToken).slice(0, 4);
          return (
            <div
              key={String(item.id)}
              style={{
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: dot,
                    flexShrink: 0,
                    display: "inline-block",
                    position: "relative",
                    top: -1,
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>
                  {item.signal}
                </span>
              </div>
              {item.short_context && (
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.65,
                    marginTop: 4,
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.short_context}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 6,
                  flexWrap: "wrap",
                }}
              >
                {tokens.map((t) => (
                  <a
                    key={t}
                    href={perpPath(t)}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.08)",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    ${t}
                  </a>
                ))}
                <span style={{ fontSize: 11, opacity: 0.4, marginLeft: "auto" }}>
                  {timeAgo(Number(item.timestamp))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
