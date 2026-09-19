import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "TradeDetails">;

export default function TradeDetailsScreen({ route, navigation }: Props) {
  const { tradeId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trade Details Screen</Text>
      <Text style={styles.paramText}>Received Trade ID: {tradeId}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Back to Previous Screen"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
  },
  paramText: {
    fontSize: 16,
    color: "#2563EB",
    marginBottom: 24,
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
});
