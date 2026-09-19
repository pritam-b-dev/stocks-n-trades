import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected ? styles.selectedChip : styles.unselectedChip,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          selected ? styles.selectedLabel : styles.unselectedLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: theme.spacing.xs,
  },
  selectedChip: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  unselectedChip: {
    backgroundColor: theme.colors.surface,
    borderColor: "#E5E7EB",
  },
  label: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
  },
  selectedLabel: {
    color: "#FFFFFF",
  },
  unselectedLabel: {
    color: theme.colors.textSecondary,
  },
});
