import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SPACING } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { fsWills } from "@/lib/firestoreDB";
import { auth } from "@/lib/firebase";

export default function AddWillScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { refreshWills } = useApp();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const [saving, setSaving] = useState(false);
  const topInset = isWeb ? 67 : insets.top;

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!title.trim() || !uid) return;
    setSaving(true);
    await fsWills.save(uid, { title: title.trim(), content: content.trim(), status });
    await refreshWills();
    setSaving(false);
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable onPress={handleSave} disabled={saving || !title.trim()} style={[styles.saveBtn, { backgroundColor: Colors.primary, opacity: !title.trim() || saving ? 0.5 : 1 }]}>
          <Text style={[styles.saveBtnText, { fontFamily: FONTS.semiBold }]}>{saving ? "حفظ..." : "إضافة"}</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text, fontFamily: FONTS.bold }]}>وصية جديدة</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={theme.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="عنوان الوصية"
          placeholderTextColor={theme.textMuted}
          style={[styles.titleInput, { color: theme.text, fontFamily: FONTS.bold, borderColor: theme.border }]}
          textAlign="right"
          autoFocus
        />
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="اكتب وصيتك هنا بكل تفاصيلها..."
          placeholderTextColor={theme.textMuted}
          style={[styles.contentInput, { color: theme.text, fontFamily: FONTS.regular, borderColor: theme.border, backgroundColor: theme.surface }]}
          multiline
          textAlignVertical="top"
          textAlign="right"
        />
        <View style={styles.statusRow}>
          <Text style={[styles.statusLabel, { color: theme.textSecondary, fontFamily: FONTS.medium }]}>الحالة:</Text>
          <View style={styles.statusToggle}>
            {(["draft", "active"] as const).map(s => (
              <Pressable key={s} onPress={() => setStatus(s)} style={[
                styles.statusOption,
                { backgroundColor: status === s ? Colors.primary : theme.surfaceSecondary, borderColor: theme.border },
              ]}>
                <Text style={[styles.statusOptionText, {
                  color: status === s ? "#fff" : theme.textSecondary, fontFamily: FONTS.medium,
                }]}>
                  {s === "draft" ? "مسودة" : "نشطة"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
  titleInput: { fontSize: 22, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1, borderRadius: RADIUS.md },
  contentInput: { fontSize: 16, lineHeight: 28, padding: 14, borderWidth: 1, borderRadius: RADIUS.md, minHeight: 300 },
  statusRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  statusLabel: { fontSize: 15 },
  statusToggle: { flexDirection: "row", gap: 8 },
  statusOption: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: RADIUS.md, borderWidth: 0.5 },
  statusOptionText: { fontSize: 14 },
});
