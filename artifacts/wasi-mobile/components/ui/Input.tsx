import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, containerStyle, leftIcon, style, ...props }: InputProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, { color: theme.textSecondary, fontFamily: FONTS.medium }]}>{label}</Text> : null}
      <View style={[
        styles.inputWrap,
        { backgroundColor: theme.surfaceSecondary, borderColor: isFocused ? Colors.primary : error ? theme.danger : theme.border },
      ]}>
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <TextInput
          {...props}
          style={[
            styles.input,
            { color: theme.text, fontFamily: FONTS.regular, textAlign: "right" },
            style,
          ]}
          placeholderTextColor={theme.textMuted}
          onFocus={e => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setIsFocused(false); props.onBlur?.(e); }}
        />
      </View>
      {error ? <Text style={[styles.error, { color: theme.danger, fontFamily: FONTS.regular }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 13 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  icon: { marginLeft: 8 },
  input: { flex: 1, fontSize: 15, paddingVertical: 12 },
  error: { fontSize: 12, marginTop: 2 },
});
