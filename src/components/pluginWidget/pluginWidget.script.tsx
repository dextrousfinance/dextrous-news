import { useState, useCallback } from "react";
import type { FC } from "react";
import type { PluginWidgetUiProps } from "./pluginWidget.ui";

export interface PluginWidgetState {
  // Add your state here, e.g. isOpen, isLoading, data, etc.
  isLoading: boolean;
}

export interface PluginWidgetScriptOptions {
  className?: string;
  title?: string;
}

export interface PluginWidgetScriptResult extends PluginWidgetState {
  // Add methods here
  setLoading: (loading: boolean) => void;
}

/**
 * Layer 2: Business logic hook
 * Manages widget state and returns state + actions consumed by the UI layer.
 */
export const usePluginWidgetScript = (
  options: PluginWidgetScriptOptions = {}
): PluginWidgetScriptResult => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    isLoading,
    setLoading,
  };
};