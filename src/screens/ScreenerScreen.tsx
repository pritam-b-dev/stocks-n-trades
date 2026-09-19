import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { theme } from "../theme/theme";

export default function ScreenerScreen() {
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedSignal, setSelectedSignal] = useState<string>("All");

  const sectors = ["All", "Technology", "Healthcare", "Financials", "Energy"];
  const types = ["All", "Purchase", "Sale"];
  const signals = ["All", "High", "Medium", "Low"];

  const handleReset = () => {
    setSelectedSector("All");
    setSelectedType("All");
    setSelectedSignal("All");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Insider Screener</Text>
        <Text style={styles.subtitle}>Filter Form 4 filings by criteria</Text>

        {/* SECTOR FILTER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sector</Text>
          <View style={styles.chipRow}>
            {sectors.map((sec) => (
              <TouchableOpacity
                key={sec}
                style={[
                  styles.chip,
                  selectedSector === sec && styles.chipActive,
                ]}
                onPress={() => setSelectedSector(sec)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by sector: ${sec}`}
                accessibilityState={{ selected: selectedSector === sec }}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedSector === sec && styles.chipTextActive,
                  ]}
                >
                  {sec}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TRANSACTION TYPE FILTER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Type</Text>
          <View style={styles.chipRow}>
            {types.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, selectedType === t && styles.chipActive]}
                onPress={() => setSelectedType(t)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by transaction type: ${t}`}
                accessibilityState={{ selected: selectedType === t }}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedType === t && styles.chipTextActive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SIGNAL STRENGTH FILTER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signal Strength</Text>
          <View style={styles.chipRow}>
            {signals.map((sig) => (
              <TouchableOpacity
                key={sig}
                style={[
                  styles.chip,
                  selectedSignal === sig && styles.chipActive,
                ]}
                onPress={() => setSelectedSignal(sig)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by signal strength: ${sig}`}
                accessibilityState={{ selected: selectedSignal === sig }}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedSignal === sig && styles.chipTextActive,
                  ]}
                >
                  {sig}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* RESET BUTTON */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleReset}
          accessibilityRole="button"
          accessibilityLabel="Reset all filters"
        >
          <Text style={styles.resetBtnText}>Reset All Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.lg,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  chipText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  resetBtn: {
    marginTop: theme.spacing.lg,
    backgroundColor: "#F3F4F6",
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  resetBtnText: {
    color: theme.colors.textPrimary,
    fontWeight: "600",
    fontSize: theme.typography.sm,
  },
});
