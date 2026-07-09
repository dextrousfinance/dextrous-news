export interface OrderlyPluginOptions {
  /** Gloria API token (JWT) — required for the news feed */
  gloriaToken: string;
  /** Comma-separated Gloria feed categories (default: perps,defi,hyperliquid,token_listings,RWA) */
  categories?: string;
  /** Optional CSS class for the wrapper */
  className?: string;
  /** Optional panel title */
  title?: string;
}
