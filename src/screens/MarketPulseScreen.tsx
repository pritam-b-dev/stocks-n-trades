import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { mockTrades } from "../data/mockTrades";
import { theme } from "../theme/theme";

import { TradeCard } from "../components/TradeCard";
import { SummaryCard } from "../components/SummaryCard";

type MarketPulseNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "MarketPulse"
>;

interface Props {
  navigation: MarketPulseNavProp;
}

const formatLargeCurrency = (val: number): string => {
  if (val >= 1_000_000) {
    return `$${(val / 1_000_000).toFixed(2)}M`;
  }
  if (val >= 1_000) {
    return `$${(val / 1_000).toFixed(0)}K`;
  }
  return `$${val.toLocaleString()}`;
};

export default function MarketPulseScreen({ navigation }: Props) {
  // 1. Calculate Summary Metrics from mockTrades
  const totalTransactions = mockTrades.length;

  const totalPurchaseValue = mockTrades
    .filter((t) => t.transactionType.toLowerCase() === "purchase")
    .reduce((sum, t) => sum + t.totalValue, 0);

  const totalSaleValue = mockTrades
    .filter((t) => t.transactionType.toLowerCase() === "sale")
    .reduce((sum, t) => sum + t.totalValue, 0);

  // 2. Compute Top Signals (High strength trades sorted by highest totalValue)
  const topSignals = [...mockTrades]
    .filter((t) => t.signalStrength === "High")
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 3);

  // 3. Compute Latest Trades (Sorted by filedAt descending)
  const latestTrades = [...mockTrades]
    .sort(
      (a, b) => new Date(b.filedAt).getTime() - new Date(a.filedAt).getTime(),
    )
    .slice(0, 6);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* SINGLE CUSTOM HEADER WITH DEMO BADGE */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.appName}>Stocks-N-Trades</Text>
            <Text style={styles.screenTitle}>Market Pulse</Text>
          </View>
          <View
            style={styles.demoBadge}
            accessibilityRole="text"
            accessibilityLabel="Fictional Demo Data indicator"
          >
            <Text style={styles.demoBadgeText}>FICTIONAL DEMO DATA</Text>
          </View>
        </View>

        {/* SEARCH ENTRY (NAVIGATES TO SCREENER) */}
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Screener")}
          accessibilityRole="search"
          accessibilityLabel="Search ticker or company. Navigates to Screener."
        >
          <Text style={styles.searchBarPlaceholder}>
            🔍 Search ticker or company...
          </Text>
        </TouchableOpacity>

        {/* EXACTLY 3 SUMMARY CARDS */}
        <View style={styles.summaryGrid}>
          <SummaryCard
            label="Transactions"
            value={totalTransactions.toString()}
            subtext="Total records"
          />
          <SummaryCard
            label="Purchase value"
            value={formatLargeCurrency(totalPurchaseValue)}
            subtext="Total buys"
          />
          <SummaryCard
            label="Sale value"
            value={formatLargeCurrency(totalSaleValue)}
            subtext="Total sells"
          />
        </View>

        {/* TOP SIGNALS SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Top Signals</Text>
        </View>
        <View style={styles.topSignalsList}>
          {topSignals.map((trade) => (
            <TouchableOpacity
              key={`top-${trade.id}`}
              style={styles.topSignalCard}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("TradeDetails", { tradeId: trade.id })
              }
              accessibilityRole="button"
              accessibilityLabel={`Top Signal: ${trade.ticker}, ${trade.signal}, Value: ${formatLargeCurrency(trade.totalValue)}`}
            >
              <View style={styles.topSignalMain}>
                <Text style={styles.topSignalTicker}>{trade.ticker}</Text>
                <Text style={styles.topSignalText}>{trade.signal}</Text>
              </View>
              <Text style={styles.topSignalValue}>
                {formatLargeCurrency(trade.totalValue)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LATEST TRADES SECTION WITH "VIEW ALL" CTA */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Latest Trades</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Screener")}
            accessibilityRole="button"
            accessibilityLabel="View all trades in Screener"
          >
            <Text style={styles.viewAllText}>View all ›</Text>
          </TouchableOpacity>
        </View>

        {/* LATEST TRADES FEED USING TradeCard */}
        <View style={styles.tradesFeed}>
          {latestTrades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onPress={() =>
                navigation.navigate("TradeDetails", { tradeId: trade.id })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    flexWrap: "wrap",
    gap: 8,
  },
  appName: {
    fontSize: theme.typography.xs,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  screenTitle: {
    fontSize: theme.typography.lg,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  demoBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#B45309",
  },
  searchBar: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    marginBottom: theme.spacing.md,
    minHeight: 44,
    justifyContent: "center",
  },
  searchBarPlaceholder: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.md,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  viewAllText: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.accent,
  },
  topSignalsList: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  topSignalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm + 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 44,
  },
  topSignalMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  topSignalTicker: {
    fontSize: theme.typography.sm,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  topSignalText: {
    fontSize: theme.typography.xs,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  topSignalValue: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  tradesFeed: {
    gap: theme.spacing.sm,
  },
});
