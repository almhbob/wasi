import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useMemo } from "react";
import {
  Animated, Platform, Pressable, ScrollView, StyleSheet,
  Text, View, useColorScheme, Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SHADOWS } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { t, isRTL } from "@/lib/i18n";

const { width: SCREEN_W } = Dimensions.get("window");
const TA = isRTL ? "right" : "left";
const ROW_REV = isRTL ? "row-reverse" : "row";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { user, wills, guardians, debts, digitalAssets, lastCheckin, recordCheckin } = useApp();
  const topInset = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 34 : insets.bottom;

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: false }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: false }),
    ]).start();
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1600, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1600, useNativeDriver: false }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const daysRemaining = useMemo(() => {
    if (!lastCheckin) return null;
    const last = new Date(lastCheckin);
    const interval = user?.checkinIntervalDays ?? 30;
    const next = new Date(last.getTime() + interval * 24 * 60 * 60 * 1000);
    return Math.ceil((next.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  }, [lastCheckin, user]);

  const checkinStatus = !lastCheckin ? "critical" : (daysRemaining ?? 0) <= 5 ? "warning" : "safe";

  const statusConfig = {
    safe: {
      gradient: ["#1E7E8C", "#155F6B"] as const,
      label: `${daysRemaining} ${t.switch.daysLeft}`,
      sub: t.switch.daysLeftSafe,
    },
    warning: {
      gradient: ["#C07850", "#A06040"] as const,
      label: `${daysRemaining} ${t.switch.daysWarning}`,
      sub: t.switch.daysWarningSub,
    },
    critical: {
      gradient: ["#D64545", "#A83030"] as const,
      label: t.switch.notRegistered,
      sub: t.switch.notRegisteredSub,
    },
  }[checkinStatus];

  const handleCheckin = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await recordCheckin();
  };

  const stats = [
    { label: t.home.willsCount,     count: wills.length,        icon: "file-text",   grad: ["#1E7E8C","#0D5560"] as const, route: "/(tabs)/wills" },
    { label: t.home.guardiansCount, count: guardians.length,     icon: "users",       grad: ["#2E9E6B","#1B6B48"] as const, route: "/(tabs)/guardians" },
    { label: t.home.debtsCount,     count: debts.length,         icon: "credit-card", grad: ["#C07850","#8A5030"] as const, route: "/(tabs)/more" },
    { label: t.home.assetsCount,    count: digitalAssets.length, icon: "smartphone",  grad: ["#7B5CB8","#5A3D90"] as const, route: "/(tabs)/more" },
  ];

  const userName = user?.name?.split(" ")[0] ?? "";
  const greeting = user ? `${t.home.greeting} ${userName}` : t.home.greetingDefault;

  return (
    <View style={[s.root, { backgroundColor: isDark ? "#080F12" : "#F0F4F5" }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 + bottomInset }}>

        {/* HERO */}
        <LinearGradient
          colors={isDark ? ["#0D2830","#112D38","#1A3D4D"] : ["#1A5F6E","#1E7E8C","#2498A8"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[s.hero, { paddingTop: topInset + 16 }]}
        >
          <View style={s.deco1} /><View style={s.deco2} />
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={s.heroTop}>
              <Pressable onPress={() => router.push("/settings")} style={s.settingsBtn}>
                <Feather name="settings" size={20} color="rgba(255,255,255,0.8)" />
              </Pressable>
              <View>
                <Text style={[s.greeting, { textAlign: TA }]}>{greeting}</Text>
                <Text style={[s.appNameHero, { textAlign: TA }]}>{t.common.appName}</Text>
              </View>
            </View>
            <View style={s.verseBadge}>
              <Text style={s.verseText}>{t.home.verse}</Text>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* DEAD MAN SWITCH */}
        <Animated.View style={[s.switchWrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient colors={statusConfig.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.switchCard}>
            <View style={s.switchDeco} />
            <View style={[s.switchLeft, { flexDirection: ROW_REV }]}>
              <View style={s.switchIconWrap}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <MaterialCommunityIcons name="heart-pulse" size={28} color="#fff" />
                </Animated.View>
              </View>
              <View>
                <Text style={[s.switchTitle, { textAlign: TA }]}>{t.switch.title}</Text>
                <Text style={[s.switchLabel, { textAlign: TA }]}>{statusConfig.label}</Text>
                <Text style={[s.switchSub,   { textAlign: TA }]}>{statusConfig.sub}</Text>
              </View>
            </View>
            <Pressable onPress={handleCheckin} style={({ pressed }) => [s.checkinBtn, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
              <Text style={s.checkinBtnText}>{t.switch.checkinBtn}</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* STATS */}
        <View style={s.statsSection}>
          <Text style={[s.sectionHeader, { color: theme.text, textAlign: TA }]}>{t.home.sectionSummary}</Text>
          <View style={s.statsGrid}>
            {stats.map((st, i) => (
              <Pressable key={i} onPress={() => router.push(st.route as never)}
                style={({ pressed }) => [s.statCard, { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
                <LinearGradient colors={st.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.statGrad}>
                  <Feather name={st.icon as never} size={22} color="rgba(255,255,255,0.9)" />
                  <Text style={s.statCount}>{st.count}</Text>
                  <Text style={s.statLabel}>{st.label}</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={s.actionsSection}>
          <Text style={[s.sectionHeader, { color: theme.text, textAlign: TA }]}>{t.home.sectionActions}</Text>
          <View style={[s.actionsCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.md]}>
            {[
              { icon: "edit-3",     label: t.home.addWill,     route: "/add-will",     color: Colors.primary },
              { icon: "user-plus",  label: t.home.addGuardian, route: "/add-guardian", color: "#2E9E6B" },
              { icon: "credit-card",label: t.home.addDebt,     route: "/add-debt",     color: Colors.accent },
              { icon: "smartphone", label: t.home.addAsset,    route: "/add-asset",    color: "#7B5CB8" },
            ].map((a, i, arr) => (
              <Pressable key={i} onPress={() => router.push(a.route as never)}
                style={({ pressed }) => [
                  s.actionRow,
                  { flexDirection: ROW_REV },
                  i < arr.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: theme.border },
                  { opacity: pressed ? 0.7 : 1 },
                ]}>
                <Feather name="chevron-left" size={16} color={theme.textMuted} style={{ transform: [{ scaleX: isRTL ? 1 : -1 }] }} />
                <Text style={[s.actionLabel, { color: theme.text, textAlign: TA }]}>{a.label}</Text>
                <View style={[s.actionIconWrap, { backgroundColor: a.color + "1A" }]}>
                  <Feather name={a.icon as never} size={18} color={a.color} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* AI CTA */}
        <Pressable onPress={() => router.push("/(tabs)/ai-advisor")} style={({ pressed }) => [s.aiCta, { opacity: pressed ? 0.88 : 1 }]}>
          <LinearGradient colors={["#0D2830","#1A3D4D"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.8 }} style={s.aiCtaGrad}>
            <View style={s.aiCtaDeco} />
            <View>
              <Text style={[s.aiCtaTitle, { textAlign: TA }]}>{t.home.aiCta}</Text>
              <Text style={[s.aiCtaSub,   { textAlign: TA }]}>{t.home.aiCtaSub}</Text>
            </View>
            <View style={s.aiIconWrap}>
              <MaterialCommunityIcons name="robot-outline" size={30} color="rgba(255,255,255,0.9)" />
            </View>
          </LinearGradient>
        </Pressable>

      </ScrollView>
    </View>
  );
}

const PAD = 16;
const s = StyleSheet.create({
  root:        { flex: 1 },
  hero:        { paddingHorizontal: PAD, paddingBottom: 28, position: "relative", overflow: "hidden" },
  deco1:       { position:"absolute", width:220, height:220, borderRadius:110, backgroundColor:"rgba(255,255,255,0.04)", top:-60, left:-60 },
  deco2:       { position:"absolute", width:160, height:160, borderRadius:80,  backgroundColor:"rgba(255,255,255,0.04)", bottom:-40, right:-30 },
  heroTop:     { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 },
  settingsBtn: { padding:8, backgroundColor:"rgba(255,255,255,0.12)", borderRadius:RADIUS.md },
  greeting:    { color:"rgba(255,255,255,0.7)", fontSize:14, fontFamily:FONTS.regular },
  appNameHero: { color:"#fff", fontSize:34, fontFamily:FONTS.extraBold },
  verseBadge:  { backgroundColor:"rgba(255,255,255,0.12)", borderRadius:RADIUS.md, paddingHorizontal:14, paddingVertical:10, borderWidth:1, borderColor:"rgba(255,255,255,0.15)" },
  verseText:   { color:"rgba(255,255,255,0.9)", fontSize:13, fontFamily:FONTS.regular, textAlign:"center", lineHeight:22 },

  switchWrap:  { paddingHorizontal:PAD, marginTop:-16, marginBottom:20 },
  switchCard:  { borderRadius:RADIUS.xl, padding:18, alignItems:"center", justifyContent:"space-between", overflow:"hidden", ...SHADOWS.lg, flexDirection:"row" },
  switchDeco:  { position:"absolute", width:140, height:140, borderRadius:70, backgroundColor:"rgba(255,255,255,0.08)", right:-30, top:-40 },
  switchLeft:  { alignItems:"center", gap:14, flex:1 },
  switchIconWrap:{ width:52, height:52, borderRadius:RADIUS.full, backgroundColor:"rgba(255,255,255,0.18)", alignItems:"center", justifyContent:"center" },
  switchTitle: { color:"rgba(255,255,255,0.75)", fontSize:12, fontFamily:FONTS.medium, marginBottom:2 },
  switchLabel: { color:"#fff", fontSize:20, fontFamily:FONTS.extraBold },
  switchSub:   { color:"rgba(255,255,255,0.75)", fontSize:12, fontFamily:FONTS.regular, marginTop:2 },
  checkinBtn:  { backgroundColor:"rgba(255,255,255,0.22)", borderRadius:RADIUS.lg, paddingVertical:14, paddingHorizontal:14, borderWidth:1, borderColor:"rgba(255,255,255,0.35)", alignItems:"center", minWidth:80 },
  checkinBtnText:{ color:"#fff", fontSize:13, fontFamily:FONTS.bold, textAlign:"center", lineHeight:20 },

  statsSection:{ paddingHorizontal:PAD, marginBottom:20 },
  sectionHeader:{ fontSize:18, fontFamily:FONTS.bold, marginBottom:12 },
  statsGrid:   { flexDirection:"row", flexWrap:"wrap", gap:10 },
  statCard:    { width: (SCREEN_W - PAD*2 - 10) / 2 },
  statGrad:    { borderRadius:RADIUS.xl, padding:18, gap:6, ...SHADOWS.md },
  statCount:   { color:"#fff", fontSize:36, fontFamily:FONTS.extraBold, lineHeight:42 },
  statLabel:   { color:"rgba(255,255,255,0.8)", fontSize:13, fontFamily:FONTS.medium },

  actionsSection:{ paddingHorizontal:PAD, marginBottom:20 },
  actionsCard: { borderRadius:RADIUS.xl, overflow:"hidden", borderWidth:0.5 },
  actionRow:   { alignItems:"center", paddingVertical:15, paddingHorizontal:16, gap:12 },
  actionIconWrap:{ width:40, height:40, borderRadius:RADIUS.md, alignItems:"center", justifyContent:"center" },
  actionLabel: { flex:1, fontSize:15, fontFamily:FONTS.medium },

  aiCta:       { marginHorizontal:PAD, borderRadius:RADIUS.xl, overflow:"hidden" },
  aiCtaGrad:   { padding:20, flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderRadius:RADIUS.xl, overflow:"hidden" },
  aiCtaDeco:   { position:"absolute", width:160, height:160, borderRadius:80, backgroundColor:"rgba(255,255,255,0.04)", left:-40, top:-60 },
  aiCtaTitle:  { color:"#fff", fontSize:17, fontFamily:FONTS.bold, marginBottom:5 },
  aiCtaSub:    { color:"rgba(255,255,255,0.7)", fontSize:13, fontFamily:FONTS.regular, maxWidth:220 },
  aiIconWrap:  { width:56, height:56, borderRadius:RADIUS.full, backgroundColor:"rgba(255,255,255,0.12)", alignItems:"center", justifyContent:"center" },
});
