import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { mockTrades } from "../data/mockTrades";
import { theme } from "../theme/theme";
import { InsiderTrade } from "../types/InsiderTrade";
import { TradeCard } from "../components/TradeCard";
import { FilterChip } from "../components/FilterChip";

type Props = NativeStackScreenProps<RootStackParamList, "Screener">;

// Exact required option sets
const TRANSACTION_TYPES = ["All", "Purchases", "Sales"] as const;
const INSIDER_ROLES = ["All roles", "CEO", "CFO", "Director"] as const;
const VALUE_THRESHOLDS = ["Any", "$100K+", "$500K+", "$1M+"] as const;

type TransactionTypeOption = (typeof TRANSACTION_TYPES)[number];
type InsiderRoleOption = (typeof INSIDER_ROLES)[number];
type ValueThresholdOption = (typeof VALUE_THRESHOLDS)[number];

export default function ScreenerScreen({ navigation }: Props) {
  // State for search text and filter selections
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] =
    useState<TransactionTypeOption>("All");
  const [selectedRole, setSelectedRole] =
    useState<InsiderRoleOption>("All roles");
  const [selectedValue, setSelectedValue] =
    useState<ValueThresholdOption>("Any");

  // Combined AND filtering logic
  const filteredTrades = useMemo(() => {
    return mockTrades.filter((trade: InsiderTrade) => {
      // 1. Search Query Filter (Ticker OR Company Name)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTicker = trade.ticker.toLowerCase().includes(query);
        const matchesCompany = trade.companyName.toLowerCase().includes(query);
        if (!matchesTicker && !matchesCompany) return false;
      }

      // 2. Transaction Type Filter
      if (
        selectedType === "Purchases" &&
        trade.transactionType !== "Purchase"
      ) {
        return false;
      }
      if (selectedType === "Sales" && trade.transactionType !== "Sale") {
        return false;
      }

      // 3. Insider Role Filter
      if (selectedRole !== "All roles") {
        if (
          !trade.insiderRole.toLowerCase().includes(selectedRole.toLowerCase())
        ) {
          return false;
        }
      }

      // 4. Value Threshold Filter
      if (selectedValue === "$100K+" && trade.totalValue < 100000) {
        return false;
      }
      if (selectedValue === "$500K+" && trade.totalValue < 500000) {
        return false;
      }
      if (selectedValue === "$1M+" && trade.totalValue < 1000000) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedType, selectedRole, selectedValue]);

  // Handler to clear all filters back to default state
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedRole("All roles");
    setSelectedValue("Any");
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    selectedType !== "All" ||
    selectedRole !== "All roles" ||
    selectedValue !== "Any";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* SCREEN TITLE */}
        <Text style={styles.title}>Trade Screener</Text>
        <Text style={styles.subtitle}>
          Filter and search SEC Form 4 insider activity
        </Text>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ticker or company name..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearSearchButton}
            >
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FILTER GROUP 1: TRANSACTION TYPE */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Transaction Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TRANSACTION_TYPES.map((type) => (
              <FilterChip
                key={type}
                label={type}
                selected={selectedType === type}
                onPress={() => setSelectedType(type)}
              />
            ))}
          </ScrollView>
        </View>

        {/* FILTER GROUP 2: INSIDER ROLE */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Insider Role</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {INSIDER_ROLES.map((role) => (
              <FilterChip
                key={role}
                label={role}
                selected={selectedRole === role}
                onPress={() => setSelectedRole(role)}
              />
            ))}
          </ScrollView>
        </View>

        {/* FILTER GROUP 3: VALUE THRESHOLD */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Minimum Value</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {VALUE_THRESHOLDS.map((val) => (
              <FilterChip
                key={val}
                label={val}
                selected={selectedValue === val}
                onPress={() => setSelectedValue(val)}
              />
            ))}
          </ScrollView>
        </View>

        {/* RESULTS HEADER & CLEAR ACTION */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            Showing{" "}
            <Text style={styles.countBold}>{filteredTrades.length}</Text>{" "}
            {filteredTrades.length === 1 ? "trade" : "trades"}
          </Text>
          {isFiltered && (
            <TouchableOpacity onPress={handleClearFilters}>
              <Text style={styles.resetText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* TRADE LIST OR EMPTY STATE */}
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade: InsiderTrade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              variant="row"
              onPress={() =>
                navigation.navigate("TradeDetails", { tradeId: trade.id })
              }
            />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>🔎</Text>
            <Text style={styles.emptyStateTitle}>No Matching Trades</Text>
            <Text style={styles.emptyStateSubtext}>
              No insider trades match your current search and filter
              combination.
            </Text>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearFiltersButtonText}>
                Reset All Filters
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  title: {
    fontSize: theme.typography.xl,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: theme.typography.md,
    color: theme.colors.textPrimary,
  },
  clearSearchButton: {
    padding: theme.spacing.xs,
  },
  clearSearchText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: theme.spacing.xs,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  resultsCount: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
  },
  countBold: {
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  resetText: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.accent,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl * 1.5,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  emptyStateIcon: {
    fontSize: 36,
    marginBottom: theme.spacing.sm,
  },
  emptyStateTitle: {
    fontSize: theme.typography.lg,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  clearFiltersButton: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 4,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: theme.typography.sm,
  },
});
