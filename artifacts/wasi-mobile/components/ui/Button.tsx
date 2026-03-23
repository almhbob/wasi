import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS } from "@/constants/theme";
import * as Haptics from "expo-haptics";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({ label, onPress, variant = "primary", size = "md", loading, disabled, style, icon }: ButtonProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const bgColors: Record<string, string> = {
    primary: Colors.primary,
    secondary: theme.surfaceSecondary,
    outline: "transparent",
    danger: theme.danger,
    ghost: "transparent",
  };

  const textColors: Record<string, string> = {
    primary: "#FFFFFF",
    secondary: theme.text,
    outline: Colors.primary,
    danger: "#FFFFFF",
    ghost: Colors.primary,
  };

  const sizes: Record<string, { height: number; fontSize: number; paddingHorizontal: number }> = {
    sm: { height: 36, fontSize: 13, paddingHorizontal: 12 },
    md: { height: 48, fontSize: 15, paddingHorizontal: 20 },
    lg: { height: 56, fontSize: 17, paddingHorizontal: 24 },
  };

  const sizeStyle = sizes[size];

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bgColors[variant],
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          borderColor: variant === "outline" ? Colors.primary : "transparent",
          borderWidth: variant === "outline" ? 1.5 : 0,
          opacity: pressed || disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, { color: textColors[variant], fontSize: sizeStyle.fontSize, fontFamily: FONTS.semiBold, marginRight: icon ? 6 : 0 }]} >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    textAlign: "center",
  },
});
