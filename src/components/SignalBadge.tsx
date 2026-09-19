import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SignalStrength } from "../types/InsiderTrade";

interface SignalBadgeProps {
  strength: SignalStrength;
}

export const SignalBadge: React.FC<SignalBadgeProps> = ({ strength }) => {
  const getBadgeStyle = () => {
    switch (strength) {
      case "High":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "Medium":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "Low":
        return { bg: "#F3F4F6", text: "#4B5563" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const style = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>
        {strength.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: "800",
  },
});
