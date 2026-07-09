import React from "react";
import { createRoot } from "react-dom/client";
import { NewsPanel } from "../src/components/newsPanel";
// Generated locally for the demo only — gitignored, never committed
import { GLORIA_TOKEN } from "./token";

const root = createRoot(document.getElementById("root")!);
root.render(
  <NewsPanel
    gloriaToken={GLORIA_TOKEN}
    title="Market News"
  />,
);
