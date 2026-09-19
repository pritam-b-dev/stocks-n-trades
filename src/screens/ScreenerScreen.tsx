import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { mockTrades } from "../data/mockTrades";
import { InsiderTrade } from "../types/InsiderTrade";
import { theme } from "../theme/theme";
import { FilterChip } from "../components/FilterChip";
import { TradeCard } from "../components/TradeCard";

type ScreenerNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Screener"
>;

interface Props {
  navigation: ScreenerNavProp;
}

type TypeFilter = "All" | "Purchases" | "Sales";
type RoleFilter = "All roles" | "CEO" | "CFO" | "Director";
type ThresholdFilter = "Any" | "$100K+" | "$500K+" | "$1M+";

export default function ScreenerScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<TypeFilter>("All");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("All roles");
  const [selectedThreshold, setSelectedThreshold] =
    useState<ThresholdFilter>("Any");

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedRole("All roles");
    setSelectedThreshold("Any");
  };

  const filteredTrades = mockTrades.filter((trade) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      trade.ticker.toLowerCase().includes(query) ||
      trade.companyName.toLowerCase().includes(query);

    const typeLower = trade.transactionType.toLowerCase();
    let matchesType = true;
    if (selectedType === "Purchases") {
      matchesType = typeLower === "purchase";
    } else if (selectedType === "Sales") {
      matchesType = typeLower === "sale";
    }

    let matchesRole = true;
    if (selectedRole !== "All roles") {
      matchesRole = trade.insiderRole === selectedRole;
    }

    let matchesThreshold = true;
    if (selectedThreshold === "$100K+") {
      matchesThreshold = trade.totalValue >= 100_000;
    } else if (selectedThreshold === "$500K+") {
      matchesThreshold = trade.totalValue >= 500_000;
    } else if (selectedThreshold === "$1M+") {
      matchesThreshold = trade.totalValue >= 1_000_000;
    }

    return matchesSearch && matchesType && matchesRole && matchesThreshold;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* CUSTOM HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.appName}>Stocks-N-Trades</Text>
          <Text style={styles.screenTitle} numberOfLines={1}>
            Trade Screener
          </Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back to previous screen"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH INPUT */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search ticker or company..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityRole="search"
            accessibilityLabel="Search ticker or company input field"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearSearchBtn}
              accessibilityRole="button"
              accessibilityLabel="Clear search input text"
            >
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FILTER GROUP 1: TRANSACTION TYPE */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Transaction Type</Text>
          <View style={styles.chipRow}>
            {(["All", "Purchases", "Sales"] as TypeFilter[]).map((type) => (
              <FilterChip
                key={type}
                label={type}
                selected={selectedType === type}
                onPress={() => setSelectedType(type)}
              />
            ))}
          </View>
        </View>

        {/* FILTER GROUP 2: INSIDER ROLE */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Insider Role</Text>
          <View style={styles.chipRow}>
            {(["All roles", "CEO", "CFO", "Director"] as RoleFilter[]).map(
              (role) => (
                <FilterChip
                  key={role}
                  label={role}
                  selected={selectedRole === role}
                  onPress={() => setSelectedRole(role)}
                />
              ),
            )}
          </View>
        </View>

        {/* FILTER GROUP 3: VALUE THRESHOLD */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Value Threshold</Text>
          <View style={styles.chipRow}>
            {(["Any", "$100K+", "$500K+", "$1M+"] as ThresholdFilter[]).map(
              (threshold) => (
                <FilterChip
                  key={threshold}
                  label={threshold}
                  selected={selectedThreshold === threshold}
                  onPress={() => setSelectedThreshold(threshold)}
                />
              ),
            )}
          </View>
        </View>

        {/* RESULTS HEADER & CLEAR FILTERS */}
        <View style={styles.resultsHeaderRow}>
          <Text style={styles.resultCountText}>
            {filteredTrades.length}{" "}
            {filteredTrades.length === 1 ? "result" : "results"}
          </Text>
          <TouchableOpacity
            onPress={handleClearFilters}
            accessibilityRole="button"
            accessibilityLabel="Clear all active filters and search query"
            style={styles.clearFiltersButton}
          >
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        </View>

        {/* RESULTS LIST OR EMPTY STATE */}
        {filteredTrades.length > 0 ? (
          <View style={styles.tradeListContainer}>
            {filteredTrades.map((trade) => (
              <TradeCard
                key={trade.id}
                trade={trade}
                onPress={() =>
                  navigation.navigate("TradeDetails", { tradeId: trade.id })
                }
              />
            ))}
          </View>
        ) : (
          <View
            style={styles.emptyStateContainer}
            accessibilityRole="text"
            accessibilityLabel="No fictional demo trades match those filters"
          >
            <Text style={styles.emptyStateText}>
              No fictional demo trades match those filters.
            </Text>
          </View>
        )}
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
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 8,
  },
  headerTextContainer: {
    flex: 1,
    minWidth: 0,
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
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  backButtonText: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.sm,
    color: theme.colors.textPrimary,
    paddingVertical: 8,
  },
  clearSearchBtn: {
    padding: 8,
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  clearSearchText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    fontWeight: "bold",
  },
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  resultsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  resultCountText: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  clearFiltersButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  clearFiltersText: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.accent,
  },
  tradeListContainer: {
    gap: theme.spacing.sm,
  },
  emptyStateContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: "600",
  },
});
