import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SHADOWS } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { Will } from "@/lib/storage";
import { fsWills } from "@/lib/firestoreDB";
import { auth } from "@/lib/firebase";
import { t, isRTL } from "@/lib/i18n";

const TA = isRTL ? "right" : "left";

export default function WillsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { wills, refreshWills } = useApp();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const topInset = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 34 : insets.bottom;

  const handleDelete = async (id: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDeletingId(id);
    await fsWills.delete(uid, id);
    await refreshWills();
    setDeletingId(null);
  };

  const handleToggle = async (w: Will) => {
    await storage.updateWill(w.id, { status: w.status === "active" ? "draft" : "active" });
    await refreshWills();
  };

  const renderItem = ({ item }: { item: Will }) => (
    <Pressable
      onPress={() => router.push({ pathname: "/will/[id]", params: { id: item.id } })}
      style={({ pressed }) => [
        s.card,
        { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed || deletingId === item.id ? 0.75 : 1 },
        SHADOWS.md,
      ]}
    >
      <View style={[s.cardBar, { backgroundColor: item.status === "active" ? Colors.primary : theme.border }]} />
      <View style={s.cardContent}>
        <View style={[s.cardTop, { flexDirection: isRTL ? "row" : "row-reverse" }]}>
          <View style={[s.cardActions, { flexDirection: isRTL ? "row" : "row-reverse" }]}>
            <Pressable onPress={() => handleDelete(item.id)} style={s.delBtn}>
              <Feather name="trash-2" size={15} color={theme.danger} />
            </Pressable>
            <Pressable onPress={() => handleToggle(item)} style={[
              s.statusPill,
              { backgroundColor: item.status === "active" ? Colors.primary : theme.surfaceSecondary },
            ]}>
              <Text style={[s.statusTxt, { color: item.status === "active" ? "#fff" : theme.textMuted }]}>
                {item.status === "active" ? t.wills.active : t.wills.draft}
              </Text>
            </Pressable>
          </View>
          <Text style={[s.willTitle, { color: theme.text, textAlign: TA }]} numberOfLines={1}>{item.title}</Text>
        </View>
        <Text style={[s.willBody, { color: theme.textSecondary, textAlign: TA }]} numberOfLines={2}>
          {item.content || t.wills.noContent}
        </Text>
        <Text style={[s.willDate, { color: theme.textMuted, textAlign: TA }]}>
          {new Date(item.updatedAt).toLocaleDateString(isRTL ? "ar-SA" : "en-US", { year:"numeric", month:"long", day:"numeric" })}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[s.root, { backgroundColor: isDark ? "#080F12" : "#F0F4F5" }]}>
      <LinearGradient colors={isDark ? ["#0D2830","#112D38"] : ["#1A5F6E","#1E7E8C"]}
        style={[s.header, { paddingTop: topInset + 12 }]}>
        <Pressable onPress={() => router.push("/add-will")} style={s.addBtn}>
          <Feather name="plus" size={20} color="#fff" />
        </Pressable>
        <View>
          <Text style={[s.headerSub,   { textAlign: TA }]}>{t.wills.subtitle}</Text>
          <Text style={[s.headerTitle, { textAlign: TA }]}>{t.wills.title}</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={wills}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={[s.list, { paddingBottom: 110 + bottomInset }, wills.length === 0 && s.emptyFill]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={[s.emptyIcon, { backgroundColor: Colors.primary + "18" }]}>
              <Feather name="file-text" size={40} color={Colors.primary} />
            </View>
            <Text style={[s.emptyTitle, { color: theme.text }]}>{t.wills.emptyTitle}</Text>
            <Text style={[s.emptyBody,  { color: theme.textSecondary, textAlign:"center" }]}>{t.wills.emptyBody}</Text>
            <Pressable onPress={() => router.push("/add-will")} style={s.emptyBtn}>
              <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={s.emptyBtnGrad}>
                <Text style={s.emptyBtnTxt}>{t.wills.emptyBtn}</Text>
                <Feather name="edit-3" size={16} color="#fff" />
              </LinearGradient>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1 },
  header:      { paddingHorizontal:16, paddingBottom:22, flexDirection:"row", justifyContent:"space-between", alignItems:"flex-end" },
  headerSub:   { color:"rgba(255,255,255,0.65)", fontSize:13, fontFamily:FONTS.regular },
  headerTitle: { color:"#fff", fontSize:32, fontFamily:FONTS.extraBold },
  addBtn:      { width:44, height:44, borderRadius:RADIUS.full, backgroundColor:"rgba(255,255,255,0.2)", alignItems:"center", justifyContent:"center" },
  list:        { padding:16, gap:14 },
  emptyFill:   { flex:1 },
  card:        { borderRadius:RADIUS.xl, overflow:"hidden", borderWidth:0.5, flexDirection:"row" },
  cardBar:     { width:4 },
  cardContent: { flex:1, padding:16, gap:8 },
  cardTop:     { alignItems:"center", justifyContent:"space-between" },
  cardActions: { alignItems:"center", gap:8 },
  delBtn:      { padding:6 },
  statusPill:  { borderRadius:RADIUS.full, paddingHorizontal:10, paddingVertical:4 },
  statusTxt:   { fontSize:12, fontFamily:FONTS.medium },
  willTitle:   { fontSize:17, fontFamily:FONTS.bold, flex:1 },
  willBody:    { fontSize:14, fontFamily:FONTS.regular, lineHeight:22 },
  willDate:    { fontSize:12, fontFamily:FONTS.regular },
  empty:       { flex:1, alignItems:"center", justifyContent:"center", padding:32, gap:14 },
  emptyIcon:   { width:88, height:88, borderRadius:RADIUS.full, alignItems:"center", justifyContent:"center" },
  emptyTitle:  { fontSize:22, fontFamily:FONTS.bold },
  emptyBody:   { fontSize:15, fontFamily:FONTS.regular, lineHeight:24 },
  emptyBtn:    { borderRadius:RADIUS.lg, overflow:"hidden", marginTop:8 },
  emptyBtnGrad:{ flexDirection:"row-reverse", alignItems:"center", gap:8, paddingVertical:14, paddingHorizontal:28 },
  emptyBtnTxt: { color:"#fff", fontSize:16, fontFamily:FONTS.semiBold },
});
