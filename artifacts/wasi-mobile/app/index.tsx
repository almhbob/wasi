import { Redirect } from "expo-router";
import { useApp } from "@/context/AppContext";
import { View, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/colors";

export default function IndexRedirect() {
  const { firebaseUser, user, isLoading, isAuthReady } = useApp();

  if (!isAuthReady || isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0D2830" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!firebaseUser || !user) {
    return <Redirect href="/auth-clean" />;
  }

  return <Redirect href="/(tabs)" />;
}
