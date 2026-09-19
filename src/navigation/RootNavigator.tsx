import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TradeDetailsScreen from "../screens/TradeDetailsScreen";
import MarketPulseScreen from "../screens/MarketPulseScreen";
import ScreenerScreen from "../screens/ScreenerScreen";

export type RootStackParamList = {
  MarketPulse: undefined;
  Screener: undefined;
  TradeDetails: { tradeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MarketPulse"
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTitleStyle: { fontWeight: "600" },
        headerTintColor: "#111827",
      }}
    >
      <Stack.Screen
        name="MarketPulse"
        component={MarketPulseScreen}
        options={{ title: "Market Pulse" }}
      />
      <Stack.Screen
        name="Screener"
        component={ScreenerScreen}
        options={{ title: "Trade Screener" }}
      />
      <Stack.Screen
        name="TradeDetails"
        component={TradeDetailsScreen}
        options={{ title: "Trade Details" }}
      />
    </Stack.Navigator>
  );
}
