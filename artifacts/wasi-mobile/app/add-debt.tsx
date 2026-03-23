import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SPACING } from "@/constants/theme";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/context/AppContext";
import { fsDebts } from "@/lib/firestoreDB";
import { auth } from "@/lib/firebase";

export default function AddDebtScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { refreshDebts } = useApp();
  const [type, setType] = useState<"debt" | "obligation">("debt");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("SAR");
  const [creditorName, setCreditorName] = useState("");
  const [saving, setSaving] = useState(false);
  const topInset = isWeb ? 67 : insets.top;

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!description.trim() || !creditorName.trim() || !uid) return;
    setSaving(true);
    await fsDebts.save(uid, { type, description: description.trim(), amount: parseFloat(amount) || 0, currency, creditorName: creditorName.trim() });
    await refreshDebts();
    setSaving(false);
    router.back();
  };

  const isValid = description.trim() && creditorName.trim();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Pressable onPress={handleSave} disabled={saving || !isValid} style={[styles.saveBtn, { backgroundColor: Colors.accent, opacity: !isValid || saving ? 0.5 : 1 }]}>
            <Text style={[styles.saveBtnText, { fontFamily: FONTS.semiBold }]}>{saving ? "حفظ..." : "إضافة"}</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text, fontFamily: FONTS.bold }]}>دين / التزام جديد</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="x" size={22} color={theme.text} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View>
            <Text style={[styles.typeLabel, { color: theme.textSecondary, fontFamily: FONTS.medium }]}>النوع</Text>
            <View style={[styles.typeToggle, { backgroundColor: theme.surfaceSecondary }]}>
              {(["debt", "obligation"] as const).map(t => (
                <Pressable key={t} onPress={() => setType(t)} style={[
                  styles.typeOption,
                  type === t && { backgroundColor: Colors.accent },
                ]}>
                  <Text style={[styles.typeOptionText, { color: type === t ? "#fff" : theme.textSecondary, fontFamily: FONTS.medium }]}>
                    {t === "debt" ? "دين مالي" : "التزام شرعي"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Input label="البيان / الوصف *" value={description} onChangeText={setDescription} placeholder="دين لصديق، زكاة مال..." autoFocus />
          <View style={styles.amountRow}>
            <Input label="العملة" value={currency} onChangeText={setCurrency} containerStyle={styles.currencyInput} placeholder="SAR" />
            <Input label="المبلغ" value={amount} onChangeText={setAmount} containerStyle={styles.amountInput} placeholder="0.00" keyboardType="decimal-pad" />
          </View>
          <Input label="اسم الدائن / الجهة *" value={creditorName} onChangeText={setCreditorName} placeholder="محمد أحمد / زكاة الفطر..." />
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
  typeLabel: { fontSize: 13, marginBottom: 6 },
  typeToggle: { flexDirection: "row", borderRadius: RADIUS.md, padding: 4, gap: 4 },
  typeOption: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.sm, alignItems: "center" },
  typeOptionText: { fontSize: 14 },
  amountRow: { flexDirection: "row-reverse", gap: 12 },
  amountInput: { flex: 2 },
  currencyInput: { flex: 1 },
});
