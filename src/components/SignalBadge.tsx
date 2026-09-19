import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SignalStrength } from "../types/InsiderTrade";
import { theme } from "../theme/theme";

interface SignalBadgeProps {
  strength: SignalStrength;
}

export const SignalBadge: React.FC<SignalBadgeProps> = ({ strength }) => {
  const getBadgeStyle = () => {
    switch (strength) {
      case "High":
        return { bg: "#DEF7EC", text: "#03543F" };
      case "Medium":
        return { bg: "#FEF08A", text: "#713F12" };
      case "Low":
        return { bg: "#F3F4F6", text: "#374151" };
      default:
        return { bg: "#F3F4F6", text: "#374151" };
    }
  };

  const style = getBadgeStyle();

  return (
    <View
      style={[styles.badge, { backgroundColor: style.bg }]}
      accessibilityRole="text"
      accessibilityLabel={`Signal strength: ${strength}`}
    >
      <Text style={[styles.badgeText, { color: style.text }]}>
        {strength} Signal
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: theme.typography.xs,
    fontWeight: "700",
  },
});
