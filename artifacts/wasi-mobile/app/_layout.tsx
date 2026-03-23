import {
  NotoSansArabic_400Regular,
  NotoSansArabic_500Medium,
  NotoSansArabic_600SemiBold,
  NotoSansArabic_700Bold,
  NotoSansArabic_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/noto-sans-arabic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { I18nManager } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";
import { isRTL } from "@/lib/i18n";

// Apply layout direction based on device locale
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    NotoSansArabic_400Regular,
    NotoSansArabic_500Medium,
    NotoSansArabic_600SemiBold,
    NotoSansArabic_700Bold,
    NotoSansArabic_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AppProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index"        options={{ headerShown: false, animation: "none" }} />
                  <Stack.Screen name="onboarding"   options={{ headerShown: false, animation: "fade" }} />
                  <Stack.Screen name="(tabs)"       options={{ headerShown: false }} />
                  <Stack.Screen name="will/[id]"    options={{ presentation: "modal", headerShown: false }} />
                  <Stack.Screen name="add-will"     options={{ presentation: "modal", headerShown: false }} />
                  <Stack.Screen name="add-guardian" options={{ presentation: "modal", headerShown: false }} />
                  <Stack.Screen name="add-debt"     options={{ presentation: "modal", headerShown: false }} />
                  <Stack.Screen name="add-asset"    options={{ presentation: "modal", headerShown: false }} />
                  <Stack.Screen name="settings"     options={{ presentation: "modal", headerShown: false }} />
                </Stack>
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
