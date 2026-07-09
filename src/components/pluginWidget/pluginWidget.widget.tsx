import type { FC } from "react";
import { memo } from "react";
import { PluginWidgetUi } from "./pluginWidget.ui";
import { usePluginWidgetScript } from "./pluginWidget.script";

export interface PluginWidgetWidgetProps {
  className?: string;
  title?: string;
}

/**
 * Layer 1: Widget wrapper
 * Calls the business logic hook and passes state + props to the UI component.
 * This is the component that gets injected via the interceptor.
 */
export const PluginWidgetWidget: FC<PluginWidgetWidgetProps> = memo((props) => {
  const state = usePluginWidgetScript(props);

  return <PluginWidgetUi {...props} />;
});

PluginWidgetWidget.displayName = "PluginWidgetWidget";