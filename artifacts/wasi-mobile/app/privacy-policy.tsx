import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SPACING } from "@/constants/theme";

export default function PrivacyPolicyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topInset = isWeb ? 67 : insets.top;

  const sections = [
    {
      title: "مقدمة",
      body: "تطبيق وصي هو وقف لوجه الله لخدمة المسلمين في إدارة وصاياهم وتركاتهم الرقمية. نحن نأخذ خصوصية بياناتك على محمل الجد.",
    },
    {
      title: "البيانات التي نجمعها",
      body: "نجمع البيانات التالية لتقديم الخدمة:\n• الاسم والبريد الإلكتروني ورقم الهاتف (عند التسجيل)\n• الوصايا والمدفوعات والأصول الرقمية التي تُضيفها\n• معلومات الأوصياء الذين تُضيفهم\n• سجل المحادثة مع المستشار الذكي (يُخزَّن على جهازك فقط)",
    },
    {
      title: "كيف نستخدم بياناتك",
      body: "تُستخدم بياناتك حصراً لـ:\n• حفظ وصاياك وعرضها لك\n• تذكيرك بمواعيد التحقق الدوري\n• تمكينك من إدارة أصولك وديونك الرقمية\n\nلا نبيع بياناتك ولا نشاركها مع أطراف ثالثة لأغراض تجارية.",
    },
    {
      title: "أين تُخزَّن بياناتك",
      body: "تُخزَّن بياناتك بأمان على خوادم Google Firebase (Firestore) في مراكز بيانات معتمدة. سجل المحادثة مع الذكاء الاصطناعي يُخزَّن محلياً على جهازك فقط ولا يُرفع لأي خادم.",
    },
    {
      title: "الصلاحيات المطلوبة",
      body: "يطلب التطبيق الصلاحيات التالية فقط:\n• الكاميرا والصور: لتحديث صورة ملفك الشخصي (اختياري)\n• الإنترنت: لمزامنة بياناتك مع الخادم",
    },
    {
      title: "حقوقك",
      body: "يحق لك في أي وقت:\n• الاطلاع على بياناتك المحفوظة\n• تعديل أو حذف أي بيانات من داخل التطبيق\n• حذف حسابك كاملاً بالتواصل معنا",
    },
    {
      title: "أمان البيانات",
      body: "نطبّق قواعد أمان صارمة على قاعدة البيانات بحيث لا يمكن لأي مستخدم الوصول لبيانات مستخدم آخر. تُستخدم اتصالات مشفّرة (HTTPS/TLS) في جميع العمليات.",
    },
    {
      title: "التواصل معنا",
      body: "لأي استفسار أو طلب يتعلق ببياناتك، يمكنك التواصل عبر:\nالبريد الإلكتروني: privacy@wasi.app",
    },
    {
      title: "تاريخ آخر تحديث",
      body: "مارس 2026",
    },
  ];

  return (
    <View style={[s.root, { backgroundColor: theme.background }]}>
      <View style={[s.header, { paddingTop: topInset + 12, backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Feather name="x" size={22} color={theme.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: theme.text, fontFamily: FONTS.bold }]}>سياسة الخصوصية</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={[s.appName, { color: Colors.primary, fontFamily: FONTS.extraBold }]}>تطبيق وصي — Wasi</Text>
        {sections.map((sec, i) => (
          <View key={i} style={[s.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.secTitle, { color: theme.text, fontFamily: FONTS.bold }]}>{sec.title}</Text>
            <Text style={[s.secBody,  { color: theme.textSecondary, fontFamily: FONTS.regular }]}>{sec.body}</Text>
          </View>
        ))}
        <Text style={[s.waqf, { color: theme.textMuted, fontFamily: FONTS.medium }]}>
          وقف لوجه الله — عاصم عبدالرحمن محمد عمر
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1 },
  header:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18 },
  backBtn:     { padding: 8 },
  content:     { padding: SPACING.md, gap: 12, paddingBottom: 40 },
  appName:     { fontSize: 22, textAlign: "center", marginBottom: 4 },
  section:     { borderRadius: RADIUS.lg, padding: 16, borderWidth: 0.5, gap: 8 },
  secTitle:    { fontSize: 16 },
  secBody:     { fontSize: 14, lineHeight: 24, textAlign: "right" },
  waqf:        { fontSize: 13, textAlign: "center", marginTop: 8 },
});
