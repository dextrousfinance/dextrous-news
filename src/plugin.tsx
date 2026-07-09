import React from "react";
import { createInterceptor } from "@orderly.network/plugin-core";
import type { OrderlySDK } from "@orderly.network/plugin-core";
import { LocaleProvider } from "./i18n";
import { NewsPanel } from "./components/newsPanel";
import type { OrderlyPluginOptions } from "./types/plugin";

/**
 * Register the DextrousNews plugin.
 * Appends a live Gloria market-news panel below the desktop trading layout.
 */
export function registerOrderlyPlugin(options: OrderlyPluginOptions) {
  return (SDK: OrderlySDK) => {
    SDK.registerPlugin({
      id: "dextrous-news",
      name: "DextrousNews",
      version: "0.0.1",
      orderlyVersion: ">=3.0.0-beta.1",

      interceptors: [
        createInterceptor(
          "Trading.Layout.Desktop",
          (Original, props, _api) => (
            <>
              <Original {...props} />
              <LocaleProvider>
                <NewsPanel
                  gloriaToken={options.gloriaToken}
                  categories={options.categories}
                  className={options.className}
                  title={options.title}
                />
              </LocaleProvider>
            </>
          ),
        ),
      ],

      setup: (_api) => {
        // Non-UI logic: event subscriptions, logging, etc.
      },
    });
  };
}
