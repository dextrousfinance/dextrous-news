import { Box, Flex, Text, cn } from "@orderly.network/ui";
import { useTranslation } from "@orderly.network/i18n";
import type { FC } from "react";

export interface PluginWidgetUiProps {
  className?: string;
  /** Custom title displayed in the widget toolbar */
  title?: string;
}

export const PluginWidgetUi: FC<PluginWidgetUiProps> = ({
  className,
  title = "Plugin Widget",
}) => {
  const { t } = useTranslation();

  return (
    <Box
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900/70 p-4 md:p-5",
        className
      )}
    >
      <Flex align="center" justify="between" className="mb-4">
        <Text className="text-sm font-medium text-slate-50">{title}</Text>
      </Flex>
      <Text className="text-xs text-slate-400">
        {t("PluginWidget.description", "You can start building your plugin UI by editing this component.")}
      </Text>
    </Box>
  );
};