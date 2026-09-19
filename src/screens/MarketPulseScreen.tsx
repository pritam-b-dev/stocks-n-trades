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
import { SummaryCard } from "../components/SummaryCard";
import { TradeCard } from "../components/TradeCard";

type Props = NativeStackScreenProps<RootStackParamList, "MarketPulse">;

const formatCurrency = (val: number): string => {
  if (val >= 1_000_000) {
    return `$${(val / 1_000_000).toFixed(2)}M`;
  }
  if (val >= 1_000) {
    return `$${(val / 1_000).toFixed(0)}K`;
  }
  return `$${val.toLocaleString()}`;
};

export default function MarketPulseScreen({ navigation }: Props) {
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

    return { count, purchaseSum, saleSum };
  }, []);

  const topSignals = useMemo(() => {
    return mockTrades
      .filter((trade) => trade.signalStrength === "High")
      .sort((a, b) => b.totalValue - a.totalValue);
  }, []);

  const latestTrades = useMemo(() => {
    return [...mockTrades].sort(
      (a, b) => new Date(b.filedAt).getTime() - new Date(a.filedAt).getTime(),
    );
  }, []);

  const handleTradePress = (tradeId: string) => {
    navigation.navigate("TradeDetails", { tradeId });
  };

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
        <SummaryCard
          label="Transactions"
          value={summaryMetrics.count}
          subtext="Total Trades Recorded"
        />
        <SummaryCard
          label="Purchase Value"
          value={formatCurrency(summaryMetrics.purchaseSum)}
          subtext="Buy Orders Total"
          valueColor={theme.colors.purchase}
          borderColor={theme.colors.purchase}
        />
        <SummaryCard
          label="Sale Value"
          value={formatCurrency(summaryMetrics.saleSum)}
          subtext="Sell Orders Total"
          valueColor={theme.colors.sale}
          borderColor={theme.colors.sale}
        />
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
          <TradeCard
            key={trade.id}
            trade={trade}
            variant="card"
            onPress={() => handleTradePress(trade.id)}
          />
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
        <TradeCard
          key={trade.id}
          trade={trade}
          variant="row"
          onPress={() => handleTradePress(trade.id)}
        />
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
});
