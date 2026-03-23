import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SPACING } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { Will } from "@/lib/storage";
import { fsWills } from "@/lib/firestoreDB";
import { auth } from "@/lib/firebase";

export default function WillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { refreshWills } = useApp();

  const [will, setWill] = useState<Will | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    fsWills.getAll(uid).then(wills => {
      const found = wills.find(w => w.id === id);
      if (found) { setWill(found); setTitle(found.title); setContent(found.content); }
    });
  }, [id]);

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!will || !title.trim() || !uid) return;
    setSaving(true);
    await fsWills.update(uid, will.id, { title: title.trim(), content: content.trim() });
    await refreshWills();
    setSaving(false);
    router.back();
  };

  const topInset = isWeb ? 67 : insets.top;

  if (!will) return null;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable onPress={handleSave} disabled={saving} style={[styles.saveBtn, { backgroundColor: Colors.primary, opacity: saving ? 0.7 : 1 }]}>
          <Text style={[styles.saveBtnText, { fontFamily: FONTS.semiBold }]}>{saving ? "جاري الحفظ..." : "حفظ"}</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text, fontFamily: FONTS.bold }]}>تعديل الوصية</Text>
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
        />
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="اكتب وصيتك هنا..."
          placeholderTextColor={theme.textMuted}
          style={[styles.contentInput, { color: theme.text, fontFamily: FONTS.regular, borderColor: theme.border, backgroundColor: theme.surface }]}
          multiline
          textAlignVertical="top"
          textAlign="right"
        />
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
  contentInput: { fontSize: 16, lineHeight: 28, padding: 14, borderWidth: 1, borderRadius: RADIUS.md, minHeight: 400 },
});
