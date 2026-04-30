import { Redirect } from "expo-router";
import { useApp } from "@/context/AppContext";
import { View, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/colors";

export default function IndexRedirect() {
  const { user, isLoading, isAuthReady } = useApp();

  if (!isAuthReady || isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0D2830" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/local-account" />;
  }

  return <Redirect href="/(tabs)" />;
}
