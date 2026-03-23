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
import { Debt, DigitalAsset } from "@/lib/storage";
import { fsDebts, fsAssets } from "@/lib/firestoreDB";
import { auth } from "@/lib/firebase";
import { t, isRTL } from "@/lib/i18n";

const TA  = isRTL ? "right" : "left";
const ROW = isRTL ? "row-reverse" : "row";

export default function MoreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { debts, digitalAssets, refreshDebts, refreshAssets } = useApp();
  const [tab, setTab] = useState<"debts"|"assets">("debts");
  const topInset    = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 34 : insets.bottom;

  const handleToggle = async (id: string, current: boolean) => {
    const uid = auth.currentUser?.uid; if (!uid) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fsDebts.toggle(uid, id, current); await refreshDebts();
  };
  const handleDelDebt = async (id: string) => {
    const uid = auth.currentUser?.uid; if (!uid) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await fsDebts.delete(uid, id); await refreshDebts();
  };
  const handleDelAsset = async (id: string) => {
    const uid = auth.currentUser?.uid; if (!uid) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await fsAssets.delete(uid, id); await refreshAssets();
  };

  const ACTION_CFG = {
    close:    { label: t.more.close,    color:"#D64545" },
    transfer: { label: t.more.transfer, color: Colors.primary },
    inherit:  { label: t.more.inherit,  color:"#2E9E6B" },
  } as const;

  const renderDebt = ({ item }: { item: Debt }) => (
    <View style={[s.card, { backgroundColor: theme.card, borderColor: item.isPaid ? "#2E9E6B40" : theme.border }, SHADOWS.md]}>
      <View style={[s.cardAccent, { backgroundColor: item.isPaid ? "#2E9E6B" : Colors.accent }]} />
      <View style={[s.debtBody, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
        <View style={[s.debtTop, { flexDirection: ROW }]}>
          <Text style={[s.debtAmt, { color: Colors.accent }]}>{item.amount > 0 ? `${item.amount} ${item.currency}` : ""}</Text>
          <View style={[s.debtTopRight, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
            <View style={[s.typePill, { backgroundColor: item.type === "debt" ? Colors.accent + "18" : Colors.primary + "18" }]}>
              <Text style={[s.typePillTxt, { color: item.type === "debt" ? Colors.accent : Colors.primary }]}>
                {item.type === "debt" ? t.more.typeDebt : t.more.typeObligation}
              </Text>
            </View>
            <Text style={[s.debtDesc, { color: theme.text, textDecorationLine: item.isPaid ? "line-through" : "none", opacity: item.isPaid ? 0.55 : 1, textAlign: TA }]}>
              {item.description}
            </Text>
          </View>
        </View>
        <Text style={[s.creditor, { color: theme.textSecondary, textAlign: TA }]}>{item.creditorName}</Text>
      </View>
      <View style={s.debtActions}>
        <Pressable onPress={() => handleDelDebt(item.id)} style={s.iconBtn}>
          <Feather name="trash-2" size={15} color={theme.danger} />
        </Pressable>
        <Pressable onPress={() => handleToggle(item.id, item.isPaid)} style={[
          s.checkbox, { borderColor: item.isPaid ? "#2E9E6B" : theme.border, backgroundColor: item.isPaid ? "#2E9E6B" : "transparent" },
        ]}>
          {item.isPaid && <Feather name="check" size={13} color="#fff" />}
        </Pressable>
      </View>
    </View>
  );

  const renderAsset = ({ item }: { item: DigitalAsset }) => {
    const cfg = ACTION_CFG[item.action];
    return (
      <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.md]}>
        <View style={[s.cardAccent, { backgroundColor: cfg.color }]} />
        <View style={[s.assetBody, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
          <View style={[s.assetTop, { flexDirection: ROW }]}>
            <View style={[s.actionPill, { backgroundColor: cfg.color + "20" }]}>
              <Text style={[s.actionPillTxt, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
            <Text style={[s.assetPlatform, { color: theme.text }]}>{item.platform}</Text>
          </View>
          <Text style={[s.assetAcc,  { color: theme.textSecondary, textAlign: TA }]}>{item.accountIdentifier}</Text>
          {item.instructions ? <Text style={[s.assetInst, { color: theme.textMuted, textAlign: TA }]} numberOfLines={1}>{item.instructions}</Text> : null}
        </View>
        <Pressable onPress={() => handleDelAsset(item.id)} style={s.iconBtn}>
          <Feather name="trash-2" size={15} color={theme.danger} />
        </Pressable>
      </View>
    );
  };

  const isDebts = tab === "debts";
  const data    = isDebts ? debts : digitalAssets;
  const addRoute    = isDebts ? "/add-debt" : "/add-asset";
  const emptyIcon   = isDebts ? "credit-card" : "smartphone";
  const emptyTxt    = isDebts ? t.more.emptyDebts : t.more.emptyAssets;
  const emptyBtn    = isDebts ? t.more.addDebt    : t.more.addAsset;
  const emptyColor  = isDebts ? Colors.accent     : "#7B5CB8";

  return (
    <View style={[s.root, { backgroundColor: isDark ? "#080F12" : "#F0F4F5" }]}>
      <LinearGradient colors={isDark ? ["#1A1A2E","#2D1B4E"] : ["#5A3D90","#7B5CB8"]}
        style={[s.header, { paddingTop: topInset + 12 }]}>
        <Pressable onPress={() => router.push(addRoute as never)} style={s.addBtn}>
          <Feather name="plus" size={20} color="#fff" />
        </Pressable>
        <View>
          <Text style={[s.headerSub,   { textAlign: TA }]}>{t.more.subtitle}</Text>
          <Text style={[s.headerTitle, { textAlign: TA }]}>{t.more.title}</Text>
        </View>
      </LinearGradient>

      <View style={[s.tabs, { backgroundColor: theme.surfaceSecondary }]}>
        {(["debts","assets"] as const).map(tp => (
          <Pressable key={tp} onPress={() => setTab(tp)}
            style={[s.tabItem, tp === tab && { backgroundColor: theme.card, ...SHADOWS.sm }]}>
            <Feather name={tp === "debts" ? "credit-card" : "smartphone"} size={15}
              color={tp === tab ? Colors.primary : theme.textMuted} />
            <Text style={[s.tabTxt, { color: tp === tab ? Colors.primary : theme.textMuted, fontFamily: tp === tab ? FONTS.semiBold : FONTS.regular }]}>
              {tp === "debts" ? `${t.more.debtsTab} (${debts.length})` : `${t.more.assetsTab} (${digitalAssets.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={i => i.id}
        renderItem={isDebts ? renderDebt as any : renderAsset as any}
        contentContainerStyle={[s.list, { paddingBottom: 110 + bottomInset }, data.length === 0 && s.emptyFill]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={[s.emptyIcon, { backgroundColor: emptyColor + "18" }]}>
              <Feather name={emptyIcon} size={40} color={emptyColor} />
            </View>
            <Text style={[s.emptyTitle, { color: theme.text }]}>{emptyTxt}</Text>
            <Pressable onPress={() => router.push(addRoute as never)} style={s.emptyBtn}>
              <LinearGradient colors={[emptyColor, emptyColor + "CC"]} style={s.emptyBtnGrad}>
                <Text style={s.emptyBtnTxt}>{emptyBtn}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex:1 },
  header:       { paddingHorizontal:16, paddingBottom:22, flexDirection:"row", justifyContent:"space-between", alignItems:"flex-end" },
  headerSub:    { color:"rgba(255,255,255,0.65)", fontSize:13, fontFamily:FONTS.regular },
  headerTitle:  { color:"#fff", fontSize:32, fontFamily:FONTS.extraBold },
  addBtn:       { width:44, height:44, borderRadius:RADIUS.full, backgroundColor:"rgba(255,255,255,0.2)", alignItems:"center", justifyContent:"center" },
  tabs:         { flexDirection:"row", margin:16, marginBottom:4, borderRadius:RADIUS.lg, padding:4, gap:4 },
  tabItem:      { flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center", gap:6, paddingVertical:10, borderRadius:RADIUS.md },
  tabTxt:       { fontSize:13 },
  list:         { paddingHorizontal:16, paddingTop:12, gap:12 },
  emptyFill:    { flex:1 },
  card:         { borderRadius:RADIUS.xl, overflow:"hidden", borderWidth:0.5, flexDirection:"row", alignItems:"center" },
  cardAccent:   { width:4, alignSelf:"stretch" },
  debtBody:     { flex:1, padding:14, gap:6 },
  debtTop:      { alignItems:"flex-start", justifyContent:"space-between", width:"100%", gap:8 },
  debtTopRight: { gap:4, flex:1 },
  debtDesc:     { fontSize:16, fontFamily:FONTS.semiBold },
  debtAmt:      { fontSize:17, fontFamily:FONTS.bold, flexShrink:0 },
  creditor:     { fontSize:13, fontFamily:FONTS.regular },
  typePill:     { borderRadius:RADIUS.full, paddingHorizontal:8, paddingVertical:3 },
  typePillTxt:  { fontSize:11, fontFamily:FONTS.medium },
  debtActions:  { paddingHorizontal:12, gap:10, alignItems:"center" },
  iconBtn:      { padding:8 },
  checkbox:     { width:26, height:26, borderRadius:RADIUS.sm, borderWidth:1.5, alignItems:"center", justifyContent:"center" },
  assetBody:    { flex:1, padding:14, gap:6 },
  assetTop:     { alignItems:"center", justifyContent:"space-between", width:"100%", gap:8 },
  assetPlatform:{ fontSize:17, fontFamily:FONTS.bold },
  actionPill:   { borderRadius:RADIUS.full, paddingHorizontal:10, paddingVertical:4 },
  actionPillTxt:{ fontSize:12, fontFamily:FONTS.semiBold },
  assetAcc:     { fontSize:13, fontFamily:FONTS.regular },
  assetInst:    { fontSize:12, fontFamily:FONTS.regular },
  empty:        { flex:1, alignItems:"center", justifyContent:"center", padding:32, gap:14 },
  emptyIcon:    { width:88, height:88, borderRadius:RADIUS.full, alignItems:"center", justifyContent:"center" },
  emptyTitle:   { fontSize:22, fontFamily:FONTS.bold },
  emptyBtn:     { borderRadius:RADIUS.lg, overflow:"hidden", marginTop:8 },
  emptyBtnGrad: { flexDirection:"row-reverse", alignItems:"center", gap:8, paddingVertical:14, paddingHorizontal:28 },
  emptyBtnTxt:  { color:"#fff", fontSize:16, fontFamily:FONTS.semiBold },
});
