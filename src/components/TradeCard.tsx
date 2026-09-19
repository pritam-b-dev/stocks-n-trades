import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { InsiderTrade } from "../types/InsiderTrade";
import { theme } from "../theme/theme";
import { SignalBadge } from "./SignalBadge";

interface TradeCardProps {
  trade: InsiderTrade;
  onPress: () => void;
  variant?: "row" | "card";
}

const formatCurrency = (val: number): string => {
  if (val >= 1_000_000) {
    return `$${(val / 1_000_000).toFixed(2)}M`;
  }
  if (val >= 1_000) {
    return `$${(val / 1_000).toFixed(0)}K`;
  }
  return `$${val.toLocaleString()}`;
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const TradeCard: React.FC<TradeCardProps> = ({
  trade,
  onPress,
  variant = "row",
}) => {
  if (variant === "card") {
    return (
      <TouchableOpacity
        style={styles.signalCard}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.tickerText}>{trade.ticker}</Text>
          <SignalBadge strength={trade.signalStrength} />
        </View>

        <Text style={styles.companyText} numberOfLines={1}>
          {trade.companyName}
        </Text>

        <View style={styles.cardBody}>
          <Text style={styles.insiderText}>
            {trade.insiderName} ({trade.insiderRole})
          </Text>
          <Text
            style={[
              styles.tradeType,
              trade.transactionType === "Purchase"
                ? { color: theme.colors.purchase }
                : { color: theme.colors.sale },
            ]}
          >
            {trade.transactionType} • {formatCurrency(trade.totalValue)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.tradeRow}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.tradeRowLeft}>
        <View
          style={[
            styles.typeIndicator,
            trade.transactionType === "Purchase"
              ? { backgroundColor: theme.colors.purchase }
              : { backgroundColor: theme.colors.sale },
          ]}
        >
          <Text style={styles.typeIndicatorText}>
            {trade.transactionType === "Purchase" ? "BUY" : "SELL"}
          </Text>
        </View>
        <View style={styles.tradeInfo}>
          <Text style={styles.rowTicker}>
            {trade.ticker}{" "}
            <Text style={styles.rowCompany}>• {trade.companyName}</Text>
          </Text>
          <Text style={styles.rowInsider}>
            {trade.insiderName} ({trade.insiderRole})
          </Text>
        </View>
      </View>

      <View style={styles.tradeRowRight}>
        <Text style={styles.rowValue}>{formatCurrency(trade.totalValue)}</Text>
        <Text style={styles.rowDate}>{formatDate(trade.filedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  signalCard: {
    width: 210,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  tickerText: {
    fontSize: theme.typography.md,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  companyText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: theme.spacing.xs,
  },
  insiderText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  tradeType: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  tradeRow: {
    backgroundColor: theme.colors.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: theme.spacing.sm,
  },
  tradeRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  typeIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  typeIndicatorText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  tradeInfo: {
    flex: 1,
  },
  rowTicker: {
    fontSize: theme.typography.md,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  rowCompany: {
    fontSize: theme.typography.sm,
    fontWeight: "normal",
    color: theme.colors.textSecondary,
  },
  rowInsider: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  tradeRowRight: {
    alignItems: "flex-end",
  },
  rowValue: {
    fontSize: theme.typography.md,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  rowDate: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
