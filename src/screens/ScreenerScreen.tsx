import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Screener">;

export default function ScreenerScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trade Screener Screen</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="View Trade Details (ID: trade-003)"
          onPress={() =>
            navigation.navigate("TradeDetails", { tradeId: "trade-003" })
          }
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
    marginBottom: 24,
    color: "#111827",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
});
