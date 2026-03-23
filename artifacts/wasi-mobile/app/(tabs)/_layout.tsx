import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";
import { t } from "@/lib/i18n";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>{t.tabs.home}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="wills">
        <Icon sf={{ default: "doc.text", selected: "doc.text.fill" }} />
        <Label>{t.tabs.wills}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="guardians">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>{t.tabs.guardians}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ai-advisor">
        <Icon sf={{ default: "sparkles", selected: "sparkles" }} />
        <Label>{t.tabs.aiAdvisor}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="more">
        <Icon sf={{ default: "ellipsis", selected: "ellipsis" }} />
        <Label>{t.tabs.more}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const tint = isDark ? Colors.dark.tint : Colors.light.tint;
  const inactive = isDark ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: inactive,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : isDark ? "#0D2830" : "#fff",
          borderTopWidth: isWeb ? 1 : 0.5,
          borderTopColor: isDark ? "#234050" : "#D4DDE1",
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? "#0D2830" : "#fff" }]} />
          ) : null,
        tabBarLabelStyle: { fontSize: 10, fontFamily: "NotoSansArabic_500Medium" },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: t.tabs.home,
        tabBarIcon: ({ color }) => isIOS
          ? <SymbolView name="house" tintColor={color} size={22} />
          : <Feather name="home" size={22} color={color} />,
      }} />
      <Tabs.Screen name="wills" options={{
        title: t.tabs.wills,
        tabBarIcon: ({ color }) => isIOS
          ? <SymbolView name="doc.text" tintColor={color} size={22} />
          : <Feather name="file-text" size={22} color={color} />,
      }} />
      <Tabs.Screen name="guardians" options={{
        title: t.tabs.guardians,
        tabBarIcon: ({ color }) => isIOS
          ? <SymbolView name="person.2" tintColor={color} size={22} />
          : <Feather name="users" size={22} color={color} />,
      }} />
      <Tabs.Screen name="ai-advisor" options={{
        title: t.tabs.aiAdvisor,
        tabBarIcon: ({ color }) => isIOS
          ? <SymbolView name="sparkles" tintColor={color} size={22} />
          : <MaterialCommunityIcons name="robot-outline" size={22} color={color} />,
      }} />
      <Tabs.Screen name="more" options={{
        title: t.tabs.more,
        tabBarIcon: ({ color }) => isIOS
          ? <SymbolView name="ellipsis" tintColor={color} size={22} />
          : <Feather name="more-horizontal" size={22} color={color} />,
      }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
