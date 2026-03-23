import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SHADOWS } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { Guardian } from "@/lib/storage";
import { fsGuardians } from "@/lib/firestoreDB";
import { auth } from "@/lib/firebase";
import { t, isRTL } from "@/lib/i18n";

const TA  = isRTL ? "right" : "left";
const ROW = isRTL ? "row-reverse" : "row";
const AVATAR_COLORS = [Colors.primary, "#2E9E6B", Colors.accent, "#7B5CB8", "#D64545"];

export default function GuardiansScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { guardians, refreshGuardians } = useApp();
  const topInset = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 34 : insets.bottom;

  const handleDelete = async (id: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await fsGuardians.delete(uid, id);
    await refreshGuardians();
  };

  const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  const renderItem = ({ item }: { item: Guardian }) => (
    <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.md]}>
      <LinearGradient colors={[avatarColor(item.name), avatarColor(item.name) + "CC"]} style={s.avatar}>
        <Text style={s.avatarTxt}>{item.name.charAt(0)}</Text>
      </LinearGradient>
      <View style={[s.cardBody, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
        <View style={[s.cardTop, { flexDirection: ROW, justifyContent: isRTL ? "flex-end" : "flex-start" }]}>
          <Text style={[s.name, { color: theme.text }]}>{item.name}</Text>
          <View style={[s.relTag, { backgroundColor: theme.surfaceSecondary }]}>
            <Text style={[s.relTxt, { color: theme.textSecondary }]}>{item.relationship}</Text>
          </View>
        </View>
        <View style={[s.contactRow, { flexDirection: ROW }]}>
          <Feather name="mail" size={13} color={theme.textMuted} />
          <Text style={[s.contactTxt, { color: theme.textSecondary }]}>{item.email}</Text>
        </View>
        {item.phone ? (
          <View style={[s.contactRow, { flexDirection: ROW }]}>
            <Feather name="phone" size={13} color={theme.textMuted} />
            <Text style={[s.contactTxt, { color: theme.textSecondary }]}>{item.phone}</Text>
          </View>
        ) : null}
      </View>
      <Pressable onPress={() => handleDelete(item.id)} style={s.delBtn}>
        <Feather name="trash-2" size={16} color={theme.danger} />
      </Pressable>
    </View>
  );

  return (
    <View style={[s.root, { backgroundColor: isDark ? "#080F12" : "#F0F4F5" }]}>
      <LinearGradient colors={["#1B6B48","#2E9E6B"]} style={[s.header, { paddingTop: topInset + 12 }]}>
        <Pressable onPress={() => router.push("/add-guardian")} style={s.addBtn}>
          <Feather name="user-plus" size={20} color="#fff" />
        </Pressable>
        <View>
          <Text style={[s.headerSub,   { textAlign: TA }]}>{t.guardians.subtitle}</Text>
          <Text style={[s.headerTitle, { textAlign: TA }]}>{t.guardians.title}</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={guardians}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={[s.list, { paddingBottom: 110 + bottomInset }, guardians.length === 0 && s.emptyFill]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={[s.emptyIcon, { backgroundColor: "#2E9E6B18" }]}>
              <Feather name="users" size={40} color="#2E9E6B" />
            </View>
            <Text style={[s.emptyTitle, { color: theme.text }]}>{t.guardians.emptyTitle}</Text>
            <Text style={[s.emptyBody,  { color: theme.textSecondary, textAlign:"center" }]}>{t.guardians.emptyBody}</Text>
            <Pressable onPress={() => router.push("/add-guardian")} style={s.emptyBtn}>
              <LinearGradient colors={["#2E9E6B","#1B6B48"]} style={s.emptyBtnGrad}>
                <Text style={s.emptyBtnTxt}>{t.guardians.emptyBtn}</Text>
                <Feather name="user-plus" size={16} color="#fff" />
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
  list:        { padding:16, gap:12 },
  emptyFill:   { flex:1 },
  card:        { borderRadius:RADIUS.xl, padding:14, borderWidth:0.5, flexDirection:"row", alignItems:"center", gap:14 },
  avatar:      { width:52, height:52, borderRadius:RADIUS.full, alignItems:"center", justifyContent:"center", flexShrink:0 },
  avatarTxt:   { color:"#fff", fontSize:22, fontFamily:FONTS.bold },
  cardBody:    { flex:1, gap:5 },
  cardTop:     { alignItems:"center", gap:8, flexWrap:"wrap" },
  name:        { fontSize:17, fontFamily:FONTS.bold },
  relTag:      { borderRadius:RADIUS.full, paddingHorizontal:10, paddingVertical:3 },
  relTxt:      { fontSize:12, fontFamily:FONTS.medium },
  contactRow:  { alignItems:"center", gap:6 },
  contactTxt:  { fontSize:13, fontFamily:FONTS.regular },
  delBtn:      { padding:10 },
  empty:       { flex:1, alignItems:"center", justifyContent:"center", padding:32, gap:14 },
  emptyIcon:   { width:88, height:88, borderRadius:RADIUS.full, alignItems:"center", justifyContent:"center" },
  emptyTitle:  { fontSize:22, fontFamily:FONTS.bold },
  emptyBody:   { fontSize:15, fontFamily:FONTS.regular, lineHeight:24 },
  emptyBtn:    { borderRadius:RADIUS.lg, overflow:"hidden", marginTop:8 },
  emptyBtnGrad:{ flexDirection:"row-reverse", alignItems:"center", gap:8, paddingVertical:14, paddingHorizontal:28 },
  emptyBtnTxt: { color:"#fff", fontSize:16, fontFamily:FONTS.semiBold },
});
