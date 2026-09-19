import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { InsiderTrade } from "../types/InsiderTrade";
import { theme } from "../theme/theme";
import { SignalBadge } from "./SignalBadge";

interface TradeCardProps {
  trade: InsiderTrade;
  onPress: () => void;
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

export function TradeCard({ trade, onPress }: TradeCardProps) {
  const isPurchase = trade.transactionType.toLowerCase() === "purchase";
  const arrowIcon = isPurchase ? "↑" : "↓";
  const formattedDate = new Date(trade.filedAt).toLocaleString();

  const accessibilityLabel = `Trade card for ${trade.ticker}, ${trade.companyName}. ${trade.transactionType} of ${trade.shares.toLocaleString()} shares worth ${formatCurrency(trade.totalValue)} by ${trade.insiderName}, ${trade.insiderRole}. Filed at ${formattedDate}. Signal strength: ${trade.signalStrength}.`;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.cardHeader}>
        <View style={styles.tickerGroup}>
          <Text style={styles.ticker}>{trade.ticker}</Text>
          <Text style={styles.companyName} numberOfLines={1}>
            {trade.companyName}
          </Text>
        </View>
        <SignalBadge strength={trade.signalStrength} />
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailCol}>
          <Text style={styles.label}>Insider</Text>
          <Text style={styles.valueBold} numberOfLines={1}>
            {trade.insiderName}
          </Text>
          <Text style={styles.subValue}>{trade.insiderRole}</Text>
        </View>

        <View style={styles.detailColRight}>
          <Text style={styles.label}>Transaction</Text>
          <View style={styles.typeRow}>
            <Text
              style={[
                styles.arrowText,
                isPurchase
                  ? { color: theme.colors.purchase }
                  : { color: theme.colors.sale },
              ]}
            >
              {arrowIcon}
            </Text>
            <Text
              style={[
                styles.valueBold,
                isPurchase
                  ? { color: theme.colors.purchase }
                  : { color: theme.colors.sale },
              ]}
            >
              {trade.transactionType} ({trade.transactionCode})
            </Text>
          </View>
          <Text style={styles.subValue}>
            {formatCurrency(trade.totalValue)}
          </Text>
          <Text style={styles.filingTimeText}>{formattedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 44,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  tickerGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  ticker: {
    fontSize: theme.typography.md,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  companyName: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: theme.spacing.sm,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailCol: {
    flex: 1,
  },
  detailColRight: {
    alignItems: "flex-end",
  },
  label: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
  valueBold: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  subValue: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  arrowText: {
    fontSize: 14,
    fontWeight: "800",
  },
  filingTimeText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
