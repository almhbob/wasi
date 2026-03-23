import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export function Card({ children, style, elevated = true }: CardProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={[
      styles.card,
      { backgroundColor: theme.card, borderColor: theme.border },
      elevated && SHADOWS.sm,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 0.5,
  },
});
