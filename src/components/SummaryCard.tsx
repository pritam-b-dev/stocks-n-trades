import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface SummaryCardProps {
  label: string;
  value: string | number;
  subtext: string;
  valueColor?: string;
  borderColor?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  subtext,
  valueColor = theme.colors.textPrimary,
  borderColor,
}) => {
  return (
    <View
      style={[
        styles.card,
        borderColor
          ? { borderLeftWidth: 3, borderLeftColor: borderColor }
          : null,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm + 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
  value: {
    fontSize: theme.typography.lg,
    fontWeight: "bold",
    marginVertical: 4,
  },
  subtext: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
});
