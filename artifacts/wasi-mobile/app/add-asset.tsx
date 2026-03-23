import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SPACING } from "@/constants/theme";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/context/AppContext";
import { fsAssets } from "@/lib/firestoreDB";
import { auth } from "@/lib/firebase";

export default function AddAssetScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { refreshAssets } = useApp();
  const [platform, setPlatform] = useState("");
  const [accountIdentifier, setAccountIdentifier] = useState("");
  const [instructions, setInstructions] = useState("");
  const [action, setAction] = useState<"close" | "transfer" | "inherit">("close");
  const [saving, setSaving] = useState(false);
  const topInset = isWeb ? 67 : insets.top;

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!platform.trim() || !accountIdentifier.trim() || !uid) return;
    setSaving(true);
    await fsAssets.save(uid, { platform: platform.trim(), accountIdentifier: accountIdentifier.trim(), instructions: instructions.trim(), action });
    await refreshAssets();
    setSaving(false);
    router.back();
  };

  const isValid = platform.trim() && accountIdentifier.trim();

  const actionColors: Record<string, string> = { close: theme.danger, transfer: Colors.primary, inherit: "#2E9E6B" };
  const actionLabels = [
    { key: "close", label: "إغلاق الحساب" },
    { key: "transfer", label: "نقل الملكية" },
    { key: "inherit", label: "توريث البيانات" },
  ] as const;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Pressable onPress={handleSave} disabled={saving || !isValid} style={[styles.saveBtn, { backgroundColor: "#9B59B6", opacity: !isValid || saving ? 0.5 : 1 }]}>
            <Text style={[styles.saveBtnText, { fontFamily: FONTS.semiBold }]}>{saving ? "حفظ..." : "إضافة"}</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text, fontFamily: FONTS.bold }]}>أصل رقمي جديد</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="x" size={22} color={theme.text} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Input label="المنصة *" value={platform} onChangeText={setPlatform} placeholder="Twitter، Gmail، iCloud، Bank..." autoFocus />
          <Input label="معرّف الحساب *" value={accountIdentifier} onChangeText={setAccountIdentifier} placeholder="البريد أو اسم المستخدم" keyboardType="email-address" autoCapitalize="none" />
          <View>
            <Text style={[styles.actionLabel, { color: theme.textSecondary, fontFamily: FONTS.medium }]}>الإجراء المطلوب</Text>
            <View style={styles.actionRow}>
              {actionLabels.map(({ key, label }) => (
                <Pressable key={key} onPress={() => setAction(key)} style={[
                  styles.actionOption,
                  { borderColor: action === key ? actionColors[key] : theme.border, backgroundColor: action === key ? actionColors[key] + "15" : theme.surfaceSecondary },
                ]}>
                  <Text style={[styles.actionOptionText, { color: action === key ? actionColors[key] : theme.textSecondary, fontFamily: FONTS.medium }]}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Input label="تعليمات إضافية" value={instructions} onChangeText={setInstructions} placeholder="تعليمات لأوصيائك حول هذا الحساب..." multiline />
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
  saveBtn: { borderRadius: RADIUS.md, paddingVertical: 8, paddingHorizontal: 16 },
  saveBtnText: { fontSize: 15, color: "#fff" },
  content: { padding: SPACING.md, gap: 16 },
  actionLabel: { fontSize: 13, marginBottom: 8 },
  actionRow: { gap: 8 },
  actionOption: { padding: 12, borderRadius: RADIUS.md, borderWidth: 1.5, alignItems: "flex-end" },
  actionOptionText: { fontSize: 14 },
});
