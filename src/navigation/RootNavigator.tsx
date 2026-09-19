import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MarketPulseScreen from "../screens/MarketPulseScreen";
import ScreenerScreen from "../screens/ScreenerScreen";
import TradeDetailsScreen from "../screens/TradeDetailsScreen";

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
        headerTintColor: "#1A1D1F",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="MarketPulse"
        component={MarketPulseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Screener"
        component={ScreenerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TradeDetails"
        component={TradeDetailsScreen}
        options={{ title: "Trade Details", headerShown: false }}
      />
    </Stack.Navigator>
  );
}
