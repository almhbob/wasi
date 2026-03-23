import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SPACING } from "@/constants/theme";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/context/AppContext";
import { fsGuardians } from "@/lib/firestoreDB";
import { auth } from "@/lib/firebase";

export default function AddGuardianScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { refreshGuardians } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [saving, setSaving] = useState(false);
  const topInset = isWeb ? 67 : insets.top;

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!name.trim() || !email.trim() || !relationship.trim() || !uid) return;
    setSaving(true);
    await fsGuardians.save(uid, { name: name.trim(), email: email.trim(), phone: phone.trim(), relationship: relationship.trim() });
    await refreshGuardians();
    setSaving(false);
    router.back();
  };

  const isValid = name.trim() && email.trim() && relationship.trim();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Pressable onPress={handleSave} disabled={saving || !isValid} style={[styles.saveBtn, { backgroundColor: "#2E9E6B", opacity: !isValid || saving ? 0.5 : 1 }]}>
            <Text style={[styles.saveBtnText, { fontFamily: FONTS.semiBold }]}>{saving ? "حفظ..." : "إضافة"}</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text, fontFamily: FONTS.bold }]}>وصيّ جديد</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="x" size={22} color={theme.text} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Input label="الاسم الكامل *" value={name} onChangeText={setName} placeholder="محمد أحمد" autoFocus />
          <Input label="البريد الإلكتروني *" value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" autoCapitalize="none" />
          <Input label="رقم الهاتف" value={phone} onChangeText={setPhone} placeholder="+966 5XXXXXXXX" keyboardType="phone-pad" />
          <Input label="صلة القرابة *" value={relationship} onChangeText={setRelationship} placeholder="مثال: الأخ، الزوجة، الابن" />
          <View style={[styles.infoCard, { backgroundColor: Colors.primary + "10", borderColor: Colors.primary + "30" }]}>
            <Feather name="info" size={16} color={Colors.primary} />
            <Text style={[styles.infoText, { color: Colors.primary, fontFamily: FONTS.regular }]}>
              سيتلقى هذا الوصيّ إخطاراً ووصولاً لوصيتك عند تفعيل نظام الضامن.
            </Text>
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
  saveBtn: { borderRadius: RADIUS.md, paddingVertical: 8, paddingHorizontal: 16 },
  saveBtnText: { fontSize: 15, color: "#fff" },
  content: { padding: SPACING.md, gap: 16 },
  infoCard: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: RADIUS.md, borderWidth: 1 },
  infoText: { fontSize: 13, flex: 1, textAlign: "right", lineHeight: 20 },
});
