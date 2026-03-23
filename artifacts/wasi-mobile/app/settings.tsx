import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SHADOWS, SPACING } from "@/constants/theme";
import { Input } from "@/components/ui/Input";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useApp } from "@/context/AppContext";
import { User } from "@/lib/storage";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { user, setUser, geminiKey, saveGeminiKey } = useApp();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [interval, setInterval] = useState(String(user?.checkinIntervalDays ?? 30));
  const [apiKey, setApiKey] = useState(geminiKey ?? "");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);

  const topInset = isWeb ? 67 : insets.top;

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) return;
    setSaving(true);
    const updatedUser: User = {
      id: user?.id ?? Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      lastCheckinAt: user?.lastCheckinAt ?? new Date().toISOString(),
      checkinIntervalDays: parseInt(interval) || 30,
    };
    await setUser(updatedUser);
    setSaving(false);
  };

  const handleSaveKey = async () => {
    await saveGeminiKey(apiKey.trim());
    Alert.alert("تم الحفظ", "تم حفظ مفتاح Gemini API بنجاح");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="x" size={22} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text, fontFamily: FONTS.bold }]}>الإعدادات</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + (isWeb ? 34 : insets.bottom) }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Profile */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: FONTS.bold }]}>معلومات الملف الشخصي</Text>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
              <Input label="الاسم الكامل *" value={name} onChangeText={setName} placeholder="اسمك الكامل" />
              <Input label="البريد الإلكتروني *" value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" />
              <Input label="رقم الهاتف" value={phone} onChangeText={setPhone} placeholder="+966 5XXXXXXXX" keyboardType="phone-pad" />
              <View>
                <Text style={[styles.inputLabel, { color: theme.textSecondary, fontFamily: FONTS.medium }]}>
                  فترة التحقق (بالأيام)
                </Text>
                <View style={[styles.intervalRow, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
                  {[7, 14, 30, 60, 90].map(d => (
                    <Pressable key={d} onPress={() => setInterval(String(d))} style={[
                      styles.intervalOption,
                      { backgroundColor: interval === String(d) ? Colors.primary : "transparent" },
                    ]}>
                      <Text style={[styles.intervalText, { color: interval === String(d) ? "#fff" : theme.textSecondary, fontFamily: FONTS.medium }]}>{d}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <Pressable onPress={handleSaveProfile} disabled={saving || !name.trim() || !email.trim()} style={[
                styles.saveBtn,
                { backgroundColor: Colors.primary, opacity: !name.trim() || !email.trim() || saving ? 0.5 : 1 },
              ]}>
                <Text style={[styles.saveBtnText, { fontFamily: FONTS.semiBold }]}>{saving ? "جاري الحفظ..." : "حفظ الملف الشخصي"}</Text>
              </Pressable>
            </View>
          </View>

          {/* Gemini API Key */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: FONTS.bold }]}>مفتاح Gemini AI</Text>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
              <View style={[styles.apiKeyInfo, { backgroundColor: Colors.primary + "10", borderColor: Colors.primary + "30" }]}>
                <MaterialCommunityIcons name="robot-outline" size={18} color={Colors.primary} />
                <Text style={[styles.apiKeyInfoText, { color: Colors.primary, fontFamily: FONTS.regular }]}>
                  احصل على مفتاح مجاني من Google AI Studio لتفعيل المستشار الذكي
                </Text>
              </View>
              <View style={[styles.keyInputRow, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
                <Pressable onPress={() => setShowKey(!showKey)} style={styles.eyeBtn}>
                  <Feather name={showKey ? "eye-off" : "eye"} size={18} color={theme.textMuted} />
                </Pressable>
                <TextInput
                  value={apiKey}
                  onChangeText={setApiKey}
                  placeholder="AIzaSy..."
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showKey}
                  style={[styles.keyInput, { color: theme.text, fontFamily: FONTS.regular }]}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <Pressable onPress={handleSaveKey} disabled={!apiKey.trim()} style={[
                styles.saveBtn,
                { backgroundColor: Colors.primaryDark, opacity: !apiKey.trim() ? 0.5 : 1 },
              ]}>
                <Text style={[styles.saveBtnText, { fontFamily: FONTS.semiBold }]}>حفظ المفتاح</Text>
              </Pressable>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
              <View style={styles.aboutRow}>
                <Text style={[styles.aboutValue, { color: theme.textMuted, fontFamily: FONTS.regular }]}>1.0.0</Text>
                <Text style={[styles.aboutLabel, { color: theme.text, fontFamily: FONTS.medium }]}>الإصدار</Text>
              </View>
              <View style={[styles.aboutRow, { borderTopWidth: 0.5, borderTopColor: theme.border, paddingTop: 12 }]}>
                <Text style={[styles.aboutValue, { color: Colors.accent, fontFamily: FONTS.medium }]}>وقف لوجه الله</Text>
                <Text style={[styles.aboutLabel, { color: theme.text, fontFamily: FONTS.medium }]}>النوع</Text>
              </View>
              <View style={[styles.aboutRow, { borderTopWidth: 0.5, borderTopColor: theme.border, paddingTop: 12 }]}>
                <Text style={[styles.aboutValue, { color: theme.textMuted, fontFamily: FONTS.regular }]}>عاصم عبدالرحمن محمد عمر</Text>
                <Text style={[styles.aboutLabel, { color: theme.text, fontFamily: FONTS.medium }]}>المطوّر</Text>
              </View>
            </View>
          </View>

          {/* Sign Out */}
          <View style={styles.section}>
            <Pressable
              onPress={() => Alert.alert("تسجيل الخروج", "هل تريد تسجيل الخروج من حسابك؟", [
                { text: "إلغاء", style: "cancel" },
                { text: "خروج", style: "destructive", onPress: async () => { await signOut(auth); router.replace("/onboarding"); } },
              ])}
              style={[styles.saveBtn, { backgroundColor: "#C0392B" }]}
            >
              <Text style={[styles.saveBtnText, { fontFamily: FONTS.semiBold }]}>تسجيل الخروج</Text>
            </Pressable>
          </View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 18 },
  backBtn: { padding: 8 },
  content: { padding: SPACING.md, gap: 0 },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 18, marginBottom: 10 },
  card: { borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 0.5, gap: 14 },
  inputLabel: { fontSize: 13, marginBottom: 6 },
  intervalRow: { flexDirection: "row", borderRadius: RADIUS.md, padding: 4, gap: 4, borderWidth: 0.5 },
  intervalOption: { flex: 1, paddingVertical: 8, borderRadius: RADIUS.sm, alignItems: "center" },
  intervalText: { fontSize: 13 },
  saveBtn: { borderRadius: RADIUS.md, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { fontSize: 15, color: "#fff" },
  apiKeyInfo: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: RADIUS.md, borderWidth: 1 },
  apiKeyInfoText: { fontSize: 13, flex: 1, textAlign: "right", lineHeight: 20 },
  keyInputRow: { flexDirection: "row", alignItems: "center", borderRadius: RADIUS.md, borderWidth: 1, paddingHorizontal: 12, gap: 8 },
  eyeBtn: { padding: 8 },
  keyInput: { flex: 1, paddingVertical: 12, fontSize: 14 },
  aboutRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  aboutLabel: { fontSize: 15 },
  aboutValue: { fontSize: 14 },
});
