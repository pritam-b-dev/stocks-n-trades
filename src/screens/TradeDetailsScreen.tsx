import React from "react";
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
import { SignalBadge } from "../components/SignalBadge";

type Props = NativeStackScreenProps<RootStackParamList, "TradeDetails">;

const formatCurrency = (val: number): string => {
  return `$${val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatLargeCurrency = (val: number): string => {
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
    year: "numeric",
  });
};

const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TradeDetailsScreen({ route, navigation }: Props) {
  const { tradeId } = route.params;

  const trade = mockTrades.find((t) => t.id === tradeId);

  if (!trade) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Trade details not found.</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back to previous screen"
        >
          <Text style={styles.backBtnText}>‹ Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const priceHistory: number[] = trade.priceHistory7d || [];
  const minPrice = priceHistory.length ? Math.min(...priceHistory) : 0;
  const maxPrice = priceHistory.length ? Math.max(...priceHistory) : 1;
  const priceRange = maxPrice - minPrice || 1;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* BACK NAVIGATION & DEMO BADGE */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back to trade list"
          >
            <Text style={styles.backButtonText}>‹ Back</Text>
          </TouchableOpacity>
          <View
            style={styles.demoBadge}
            accessibilityRole="text"
            accessibilityLabel="Demo Data indicator"
          >
            <Text style={styles.demoBadgeText}>Demo Data</Text>
          </View>
        </View>

        {/* COMPANY NAME, TICKER & SECTOR */}
        <View style={styles.headerSection}>
          <View style={styles.tickerRow}>
            <Text style={styles.ticker}>{trade.ticker}</Text>
            <View style={styles.sectorBadge}>
              <Text style={styles.sectorText}>{trade.sector}</Text>
            </View>
          </View>
          <Text style={styles.companyName}>{trade.companyName}</Text>
        </View>

        {/* SIGNAL CARD & STRENGTH */}
        <View style={styles.signalCard}>
          <View style={styles.signalHeaderRow}>
            <Text style={styles.signalTitle}>Signal Assessment</Text>
            <SignalBadge strength={trade.signalStrength} />
          </View>
          <Text style={styles.signalDescription}>
            {trade.signalStrength === "High" &&
              "High Confidence Signal: Direct open-market trade by C-suite executive with significant transaction volume."}
            {trade.signalStrength === "Medium" &&
              "Moderate Confidence Signal: Standard corporate insider transaction with medium market value impact."}
            {trade.signalStrength === "Low" &&
              "Low Confidence Signal: Routine execution or lower transaction size relative to market cap."}
          </Text>
        </View>

        {/* TRANSACTION DETAILS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction Breakdown</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Insider Name</Text>
            <Text style={styles.detailValueBold}>{trade.insiderName}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Insider Role</Text>
            <Text style={styles.detailValue}>{trade.insiderRole}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Type</Text>
            <Text
              style={[
                styles.detailValueBold,
                trade.transactionType === "Purchase"
                  ? { color: theme.colors.purchase }
                  : { color: theme.colors.sale },
              ]}
            >
              {trade.transactionType}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SEC Code</Text>
            <Text style={styles.detailValueCode}>
              {trade.transactionCode} (
              {trade.transactionCode === "P"
                ? "Open Market Buy"
                : trade.transactionCode === "S"
                  ? "Open Market Sell"
                  : "Other"}
              )
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Shares</Text>
            <Text style={styles.detailValue}>
              {trade.shares.toLocaleString()}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price Per Share</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(trade.pricePerShare)}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Value</Text>
            <Text style={styles.detailValueHighlight}>
              {formatLargeCurrency(trade.totalValue)}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(trade.transactionDate)}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SEC Filing Date/Time</Text>
            <Text style={styles.detailValue}>
              {formatDateTime(trade.filedAt)}
            </Text>
          </View>
        </View>

        {/* 7-DAY CUSTOM PRICE VISUALIZATION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>7-Day Price Context</Text>
          <Text style={styles.cardSubtitle}>
            Stock price history leading up to filing
          </Text>

          <View style={styles.chartContainer}>
            {priceHistory.map((price: number, index: number) => {
              const heightPercent =
                15 + Math.round(((price - minPrice) / priceRange) * 75);

              const dayLabel =
                index === priceHistory.length - 1
                  ? "D-0"
                  : `D-${priceHistory.length - 1 - index}`;

              return (
                <View key={index} style={styles.chartBarCol}>
                  <Text style={styles.chartPriceText}>${price.toFixed(0)}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor:
                            trade.transactionType === "Purchase"
                              ? theme.colors.purchase
                              : theme.colors.sale,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartDayText}>{dayLabel}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* EDUCATIONAL METRICS EXPLANATION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            💡 Educational Guide: Understanding SEC Form 4
          </Text>
          <Text style={styles.eduText}>
            <Text style={styles.eduBold}>SEC Form 4:</Text> Must be filed with
            the SEC within two business days whenever corporate officers,
            directors, or major shareholders buy or sell company stock.
          </Text>
          <Text style={styles.eduText}>
            <Text style={styles.eduBold}>Code P (Purchase):</Text> Represents
            direct open-market purchases using personal capital. Historically
            carries stronger bullish signal strength than routine automated
            sales.
          </Text>
          <Text style={styles.eduText}>
            <Text style={styles.eduBold}>Code S (Sale):</Text> Open-market stock
            sale. May indicate profit-taking, tax obligations, or portfolio
            diversification.
          </Text>
        </View>

        {/* REQUIRED DISCLAIMER TEXT */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            Disclaimer: This application uses simulated data for educational and
            demonstration purposes only. Content does not constitute financial,
            investment, legal, or trading advice, nor official SEC Form 4
            filings.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  topNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    flexWrap: "wrap",
  },
  backButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
    paddingVertical: 4,
    paddingRight: theme.spacing.md,
  },
  backButtonText: {
    fontSize: theme.typography.md,
    fontWeight: "600",
    color: theme.colors.accent,
  },
  demoBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  demoBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B45309",
  },
  headerSection: {
    marginBottom: theme.spacing.md,
  },
  tickerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 2,
  },
  ticker: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.sm,
  },
  sectorBadge: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sectorText: {
    fontSize: 11,
    color: "#3730A3",
    fontWeight: "600",
  },
  companyName: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
  },
  signalCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: theme.spacing.md,
  },
  signalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  signalTitle: {
    fontSize: theme.typography.md,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  signalDescription: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.md,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    flexWrap: "wrap",
  },
  detailLabel: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    fontSize: theme.typography.sm,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  detailValueBold: {
    fontSize: theme.typography.sm,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  detailValueCode: {
    fontSize: theme.typography.sm,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  detailValueHighlight: {
    fontSize: theme.typography.md,
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    paddingTop: theme.spacing.sm,
  },
  chartBarCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  chartPriceText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 4,
  },
  chartDayText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  eduText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  eduBold: {
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  disclaimerBox: {
    backgroundColor: "#F9FAFB",
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    textAlign: "center",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  notFoundText: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  backBtn: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 6,
    minHeight: 44,
    justifyContent: "center",
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
