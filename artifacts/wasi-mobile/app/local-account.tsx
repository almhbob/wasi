import React, { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { storage } from "@/lib/storage";

const LOGO = require("../assets/images/icon.png");

export default function LocalAccountScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2) return Alert.alert("تنبيه", "أدخل الاسم الكامل.");
    if (!cleanEmail.includes("@")) return Alert.alert("تنبيه", "أدخل بريدًا إلكترونيًا صحيحًا.");
    const now = new Date().toISOString();
    await storage.saveUser({ id: `local-${Date.now()}`, name: cleanName, email: cleanEmail, lastCheckinAt: now, checkinIntervalDays: 30 });
    await storage.recordCheckin();
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <LinearGradient colors={["#061216", "#0D2830", "#123742"]} style={[styles.screen, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 18 }]}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Image source={LOGO} style={styles.logo} />
          <Text style={styles.title}>وصي</Text>
          <Text style={styles.subtitle}>إنشاء حساب محلي آمن بدون تداخل وبدون أخطاء تسجيل دخول</Text>
          <View style={styles.card}>
            <Text style={styles.heading}>البيانات الأساسية</Text>
            <Text style={styles.label}>الاسم الكامل</Text>
            <TextInput value={name} onChangeText={setName} placeholder="اكتب اسمك" placeholderTextColor="#7E969A" style={styles.input} textAlign="right" />
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="name@example.com" placeholderTextColor="#7E969A" style={[styles.input, styles.email]} keyboardType="email-address" autoCapitalize="none" />
            <Pressable onPress={submit} style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}>
              <Text style={styles.buttonText}>دخول إلى التطبيق</Text>
            </Pressable>
          </View>
          <Text style={styles.note}>سيتم تفعيل الربط السحابي لاحقًا بعد ضبط Firebase وسياسات المنصات.</Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 22, gap: 14 },
  logo: { width: 110, height: 110, borderRadius: 28, alignSelf: "center" },
  title: { color: "#fff", fontSize: 42, fontWeight: "900", textAlign: "center" },
  subtitle: { color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 24, textAlign: "center" },
  card: { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderRadius: 26, padding: 18, gap: 12 },
  heading: { color: "#fff", fontSize: 24, fontWeight: "900", textAlign: "right", marginBottom: 4 },
  label: { color: "#fff", fontSize: 14, fontWeight: "800", textAlign: "right" },
  input: { minHeight: 54, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.10)", color: "#fff", fontSize: 16, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  email: { textAlign: "left", writingDirection: "ltr" },
  button: { minHeight: 56, borderRadius: 18, backgroundColor: "#18A782", alignItems: "center", justifyContent: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "900" },
  note: { color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 20, textAlign: "center" },
});
