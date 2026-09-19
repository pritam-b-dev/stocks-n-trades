import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { mockTrades } from "../data/mockTrades";
import { theme } from "../theme/theme";
import { InsiderTrade } from "../types/InsiderTrade";

type Props = NativeStackScreenProps<RootStackParamList, "MarketPulse">;

// Currency & Number Formatter Helpers
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

export default function MarketPulseScreen({ navigation }: Props) {
  // 1. Calculate Summary Cards Data
  const summaryMetrics = useMemo(() => {
    const count = mockTrades.length;
    let purchaseSum = 0;
    let saleSum = 0;

    mockTrades.forEach((trade) => {
      if (trade.transactionType === "Purchase") {
        purchaseSum += trade.totalValue;
      } else if (trade.transactionType === "Sale") {
        saleSum += trade.totalValue;
      }
    });

    return {
      count,
      purchaseSum,
      saleSum,
    };
  }, []);

  // 2. Filter Top Signals (High signal strength, sorted by highest value)
  const topSignals = useMemo(() => {
    return mockTrades
      .filter((trade) => trade.signalStrength === "High")
      .sort((a, b) => b.totalValue - a.totalValue);
  }, []);

  // 3. Sort Latest Trades by filedAt timestamp descending
  const latestTrades = useMemo(() => {
    return [...mockTrades].sort(
      (a, b) => new Date(b.filedAt).getTime() - new Date(a.filedAt).getTime(),
    );
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* HEADER & DEMO BADGE */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.screenTitle}>Market Pulse</Text>
          <Text style={styles.subtitle}>SEC Form 4 Insider Tracking</Text>
        </View>
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>Demo Data</Text>
        </View>
      </View>

      {/* SEARCH ENTRY POINT / SCREENER TRIGGER */}
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Screener")}
      >
        <Text style={styles.searchPlaceholder}>
          🔍 Search ticker, company, or filter trades...
        </Text>
      </TouchableOpacity>

      {/* EXACTLY 3 SUMMARY CARDS */}
      <View style={styles.summaryContainer}>
        {/* Card 1: Transactions Count */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Transactions</Text>

          <Text style={styles.summaryValue}>{summaryMetrics.count}</Text>
          <Text style={styles.summarySubtext}>Total Trades Recorded</Text>
        </View>

        {/* Card 2: Purchase Value */}
        <View style={[styles.summaryCard, styles.purchaseBorder]}>
          <Text style={styles.summaryLabel}>Purchase Value</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.purchase }]}>
            {formatCurrency(summaryMetrics.purchaseSum)}
          </Text>
          <Text style={styles.summarySubtext}>Buy Orders Total</Text>
        </View>

        {/* Card 3: Sale Value */}
        <View style={[styles.summaryCard, styles.saleBorder]}>
          <Text style={styles.summaryLabel}>Sale Value</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.sale }]}>
            {formatCurrency(summaryMetrics.saleSum)}
          </Text>
          <Text style={styles.summarySubtext}>Sell Orders Total</Text>
        </View>
      </View>

      {/* TOP SIGNALS SECTION */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 Top Signals</Text>
        <Text style={styles.sectionSubtitle}>High confidence transactions</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {topSignals.map((trade: InsiderTrade) => (
          <TouchableOpacity
            key={trade.id}
            style={styles.signalCard}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("TradeDetails", { tradeId: trade.id })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.tickerText}>{trade.ticker}</Text>
              <View style={styles.highSignalTag}>
                <Text style={styles.highSignalText}>HIGH</Text>
              </View>
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
        ))}
      </ScrollView>

      {/* LATEST TRADES SECTION */}
      <View style={styles.sectionHeader}>
        <View style={styles.rowSpaceBetween}>
          <Text style={styles.sectionTitle}>Latest Trades</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Screener")}>
            <Text style={styles.viewAllText}>Open Screener ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {latestTrades.map((trade: InsiderTrade) => (
        <TouchableOpacity
          key={trade.id}
          style={styles.tradeRow}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("TradeDetails", { tradeId: trade.id })
          }
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
            <Text style={styles.rowValue}>
              {formatCurrency(trade.totalValue)}
            </Text>
            <Text style={styles.rowDate}>{formatDate(trade.filedAt)}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  screenTitle: {
    fontSize: theme.typography.xl,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  demoBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  demoBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B45309",
  },
  searchBar: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: theme.spacing.lg,
  },
  searchPlaceholder: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.md,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm + 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  purchaseBorder: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.purchase,
  },
  saleBorder: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.sale,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: theme.typography.lg,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    marginVertical: 4,
  },
  summarySubtext: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  sectionHeader: {
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: theme.typography.lg,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  viewAllText: {
    color: theme.colors.accent,
    fontSize: theme.typography.sm,
    fontWeight: "600",
  },
  horizontalScroll: {
    paddingRight: theme.spacing.md,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
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
  highSignalTag: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  highSignalText: {
    color: "#065F46",
    fontSize: 10,
    fontWeight: "800",
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
