import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { mockTrades } from "../data/mockTrades";
import { InsiderTrade } from "../types/InsiderTrade";
import { theme } from "../theme/theme";
import { SignalBadge } from "../components/SignalBadge";

type MarketPulseNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "MarketPulse"
>;

interface Props {
  navigation: MarketPulseNavProp;
}

export default function MarketPulseScreen({ navigation }: Props) {
  const [filterType, setFilterType] = useState<"All" | "Purchase" | "Sale">(
    "All",
  );

  const filteredTrades = mockTrades.filter((t) => {
    if (filterType === "All") return true;
    return t.transactionType === filterType;
  });

  const renderTradeCard = ({ item }: { item: InsiderTrade }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("TradeDetails", { tradeId: item.id })
        }
        accessibilityRole="button"
        accessibilityLabel={`View trade details for ${item.ticker}, ${item.insiderName}, ${item.transactionType} of ${item.shares.toLocaleString()} shares`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.tickerGroup}>
            <Text style={styles.ticker}>{item.ticker}</Text>
            <Text style={styles.companyName} numberOfLines={1}>
              {item.companyName}
            </Text>
          </View>
          <SignalBadge strength={item.signalStrength} />
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Insider</Text>
            <Text style={styles.valueBold} numberOfLines={1}>
              {item.insiderName}
            </Text>
            <Text style={styles.subValue}>{item.insiderRole}</Text>
          </View>

          <View style={styles.detailColRight}>
            <Text style={styles.label}>Transaction</Text>
            <Text
              style={[
                styles.valueBold,
                item.transactionType === "Purchase"
                  ? { color: theme.colors.purchase }
                  : { color: theme.colors.sale },
              ]}
            >
              {item.transactionType} ({item.transactionCode})
            </Text>
            <Text style={styles.subValue}>
              {item.shares.toLocaleString()} @ ${item.pricePerShare.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* IN-SCREEN HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Market Pulse</Text>
        <Text style={styles.subtitle}>
          Real-time SEC Form 4 insider transaction feed
        </Text>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterRow}>
        {(["All", "Purchase", "Sale"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterTab,
              filterType === type && styles.filterTabActive,
            ]}
            onPress={() => setFilterType(type)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${type} trades`}
            accessibilityState={{ selected: filterType === type }}
          >
            <Text
              style={[
                styles.filterTabText,
                filterType === type && styles.filterTabTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TRADE LIST */}
      <FlatList
        data={filteredTrades}
        keyExtractor={(item) => item.id}
        renderItem={renderTradeCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: theme.typography.lg,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    gap: 4,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: theme.colors.accent,
  },
  filterTabText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  filterTabTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
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
  },
  tickerGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
});
