import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { mockTrades } from "../data/mockTrades";
import { theme } from "../theme/theme";
import { SignalBadge } from "../components/SignalBadge";

type TradeDetailsRouteProp = RouteProp<RootStackParamList, "TradeDetails">;
type TradeDetailsNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "TradeDetails"
>;

interface Props {
  route: TradeDetailsRouteProp;
  navigation: TradeDetailsNavProp;
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

export default function TradeDetailsScreen({ route, navigation }: Props) {
  const { tradeId } = route.params;
  const trade = mockTrades.find((t) => t.id === tradeId) || mockTrades[0];

  const typeLower = trade.transactionType.toLowerCase();
  const neutralAmountText = `${formatCurrency(trade.totalValue)} fictional demo insider ${typeLower}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back to previous screen"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View
          style={styles.demoBadge}
          accessibilityRole="text"
          accessibilityLabel="Fictional Demo Data indicator"
        >
          <Text style={styles.demoBadgeText}>FICTIONAL DEMO DATA</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* COMPANY & TICKER INFO */}
        <View style={styles.companyHeaderCard}>
          <View style={styles.tickerRow}>
            <Text style={styles.ticker}>{trade.ticker}</Text>
            <View style={styles.sectorBadge}>
              <Text style={styles.sectorText}>{trade.sector}</Text>
            </View>
          </View>
          <Text style={styles.companyName} numberOfLines={2}>
            {trade.companyName}
          </Text>
        </View>

        {/* NEUTRAL SIGNAL CARD */}
        <View style={styles.signalCard}>
          <View style={styles.signalCardHeader}>
            <Text style={styles.signalCardTitle}>Insider Signal Record</Text>
            <SignalBadge strength={trade.signalStrength} />
          </View>
          <Text style={styles.signalNameText}>{trade.signal}</Text>
          <Text style={styles.neutralAmountText}>{neutralAmountText}</Text>
          <Text style={styles.signalSubText}>
            Signal Strength: {trade.signalStrength} (Fictional categorization)
          </Text>
        </View>

        {/* TRANSACTION DETAILS SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Transaction Breakdown</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Insider Name</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {trade.insiderName}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Insider Role</Text>
              <Text style={styles.detailValue}>{trade.insiderRole}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction Type</Text>
              <Text
                style={[
                  styles.detailValue,
                  trade.transactionType === "Purchase"
                    ? { color: theme.colors.purchase }
                    : { color: theme.colors.sale },
                ]}
              >
                {trade.transactionType} (Code {trade.transactionCode})
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shares Traded</Text>
              <Text style={styles.detailValue}>
                {trade.shares.toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price Per Share</Text>
              <Text style={styles.detailValue}>
                ${trade.pricePerShare.toFixed(2)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Value</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(trade.totalValue)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction Date</Text>
              <Text style={styles.detailValue}>{trade.transactionDate}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Filing Date/Time</Text>
              <Text style={styles.detailValue}>
                {new Date(trade.filedAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* 7-DAY MOCK CHART SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Mock 7-day activity</Text>
          <View style={styles.chartCard}>
            <View style={styles.barChartRow}>
              {trade.priceHistory7d.map((price, idx) => {
                const minPrice = Math.min(...trade.priceHistory7d);
                const maxPrice = Math.max(...trade.priceHistory7d);
                const range = maxPrice - minPrice || 1;
                const heightPercent = Math.max(
                  20,
                  Math.min(100, ((price - minPrice) / range) * 80 + 20),
                );

                return (
                  <View key={idx} style={styles.barCol}>
                    <Text style={styles.barPriceText}>${price.toFixed(1)}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { height: `${heightPercent}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.barDayText}>Day {idx + 1}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* FACTUAL EDUCATIONAL TEXT */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Educational Guide</Text>
          <View style={styles.eduCard}>
            <Text style={styles.eduText}>
              SEC Form 4 filings record open-market transactions by corporate
              insiders. Code P indicates a purchase transaction, while Code S
              indicates a sale transaction. These disclosures document public
              ownership changes and do not imply market direction or future
              performance.
            </Text>
          </View>
        </View>

        {/* EXACT REQUIRED DISCLAIMER */}
        <View
          style={styles.disclaimerContainer}
          accessibilityRole="text"
          accessibilityLabel="This prototype uses mock data for demonstration only. Insider-trading filings are public disclosures and do not constitute investment advice. Past activity does not guarantee future stock performance."
        >
          <Text style={styles.disclaimerText}>
            This prototype uses mock data for demonstration only.
            Insider-trading filings are public disclosures and do not constitute
            investment advice. Past activity does not guarantee future stock
            performance.
          </Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 8,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
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
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  companyHeaderCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticker: {
    fontSize: theme.typography.lg,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  sectorBadge: {
    backgroundColor: "#EEF2F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sectorText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  companyName: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  signalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  signalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  signalCardTitle: {
    fontSize: theme.typography.xs,
    textTransform: "uppercase",
    color: theme.colors.textSecondary,
    fontWeight: "700",
  },
  signalNameText: {
    fontSize: theme.typography.md,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  neutralAmountText: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.accent,
    marginBottom: 4,
  },
  signalSubText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  sectionContainer: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.md,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  detailsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 8,
  },
  detailLabel: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    flexShrink: 0,
  },
  detailValue: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    flex: 1,
    textAlign: "right",
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  barChartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingTop: 10,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barPriceText: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  barTrack: {
    width: 16,
    height: 80,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    backgroundColor: theme.colors.accent,
    borderRadius: 4,
  },
  barDayText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  eduCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  eduText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  disclaimerContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: theme.spacing.sm,
  },
  disclaimerText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    textAlign: "center",
  },
});
