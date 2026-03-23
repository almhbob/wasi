import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, FlatList, KeyboardAvoidingView, Platform,
  Pressable, StyleSheet, Text, TextInput, View, useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS, SHADOWS } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { storage, ChatMessage } from "@/lib/storage";
import { t, isRTL } from "@/lib/i18n";

const TA  = isRTL ? "right" : "left";

const SYSTEM_PROMPT = `You are "Wasi AI" - an Islamic legal advisor specialized in wills, inheritance, zakat, and debts. Reply in the same language the user writes in. Always cite Quran and Sunnah. Remind users to consult a scholar for complex matters.`;

export default function AIAdvisorScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { geminiKey } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput]       = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const topInset    = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 34 : insets.bottom;

  useEffect(() => { storage.getChatHistory().then(setMessages); }, []);
  const scrollToEnd = useCallback(() => { flatListRef.current?.scrollToEnd({ animated: true }); }, []);

  const askGemini = async (userMsg: string) => {
    if (!geminiKey) return null;
    const history = [...messages, { role: "user", content: userMsg }];
    const geminiHistory = history.slice(-20).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: geminiHistory,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    } catch { return null; }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg = await storage.addChatMessage({ role: "user", content: input.trim() });
    setMessages(p => [...p, userMsg]);
    setInput("");
    setIsLoading(true);
    setTimeout(scrollToEnd, 100);
    let reply = !geminiKey
      ? t.ai.noKey
      : (await askGemini(input.trim())) ?? t.ai.connectionError;
    const assistantMsg = await storage.addChatMessage({ role: "assistant", content: reply });
    setMessages(p => [...p, assistantMsg]);
    setIsLoading(false);
    setTimeout(scrollToEnd, 100);
  };

  const renderMsg = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    return (
      <View style={[s.msgRow, isUser ? s.userRow : s.botRow]}>
        {!isUser && (
          <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={s.botAvatar}>
            <MaterialCommunityIcons name="robot-outline" size={16} color="#fff" />
          </LinearGradient>
        )}
        <View style={[s.bubble, isUser ? s.userBubble : [s.botBubble, { backgroundColor: theme.card, borderColor: theme.border }]]}>
          {isUser
            ? <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={s.userBubbleGrad}>
                <Text style={[s.userTxt, { textAlign: TA }]}>{item.content}</Text>
              </LinearGradient>
            : <Text style={[s.botTxt, { color: theme.text, textAlign: TA }]}>{item.content}</Text>
          }
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[s.root, { backgroundColor: isDark ? "#080F12" : "#F0F4F5" }]}>
        <LinearGradient
          colors={isDark ? ["#0D2830","#112D38"] : ["#1A5F6E","#1E7E8C"]}
          style={[s.header, { paddingTop: topInset + 12 }]}
        >
          <Pressable onPress={async () => { await storage.clearChatHistory(); setMessages([]); }} style={s.clearBtn}>
            <Feather name="trash-2" size={18} color="rgba(255,255,255,0.7)" />
          </Pressable>
          <View style={s.headerCenter}>
            <Text style={s.headerSub}>{t.ai.subtitle}</Text>
            <Text style={s.headerTitle}>{t.ai.title}</Text>
          </View>
          <View style={s.botBadge}>
            <MaterialCommunityIcons name="robot-outline" size={22} color="#fff" />
          </View>
        </LinearGradient>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={i => i.id}
          renderItem={renderMsg}
          contentContainerStyle={[s.msgList, messages.length === 0 && s.msgEmpty]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
          ListEmptyComponent={
            <View style={s.welcome}>
              <LinearGradient colors={[Colors.primary + "25", Colors.primary + "08"]} style={s.welcomeIcon}>
                <MaterialCommunityIcons name="robot-outline" size={44} color={Colors.primary} />
              </LinearGradient>
              <Text style={[s.welcomeTitle, { color: theme.text }]}>{t.ai.welcomeTitle}</Text>
              <Text style={[s.welcomeSub,   { color: theme.textSecondary }]}>{t.ai.welcomeSub}</Text>
              {!geminiKey && (
                <View style={[s.keyWarning, { backgroundColor: Colors.accent + "15", borderColor: Colors.accent + "40" }]}>
                  <Feather name="alert-circle" size={15} color={Colors.accent} />
                  <Text style={[s.keyWarnTxt, { color: Colors.accent, textAlign: TA }]}>{t.ai.keyWarning}</Text>
                </View>
              )}
              <View style={s.suggestions}>
                {(t.ai.suggestions as readonly string[]).map((sg, i) => (
                  <Pressable key={i} onPress={() => setInput(sg)} style={({ pressed }) => [
                    s.suggestion, { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
                  ]}>
                    <Text style={[s.suggTxt, { color: theme.text, textAlign: TA }]}>{sg}</Text>
                    <Feather name={isRTL ? "arrow-left" : "arrow-right"} size={14} color={Colors.primary} />
                  </Pressable>
                ))}
              </View>
            </View>
          }
          ListFooterComponent={isLoading ? (
            <View style={[s.msgRow, s.botRow]}>
              <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={s.botAvatar}>
                <MaterialCommunityIcons name="robot-outline" size={16} color="#fff" />
              </LinearGradient>
              <View style={[s.bubble, s.botBubble, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            </View>
          ) : null}
        />

        <View style={[s.inputBar, { backgroundColor: theme.surface, borderColor: theme.border, paddingBottom: bottomInset + 8 }]}>
          <Pressable onPress={handleSend} disabled={!input.trim() || isLoading}
            style={({ pressed }) => [s.sendBtn, { opacity: !input.trim() || isLoading || pressed ? 0.5 : 1 }]}>
            <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={s.sendBtnGrad}>
              <Feather name="send" size={18} color="#fff" />
            </LinearGradient>
          </Pressable>
          <TextInput
            value={input} onChangeText={setInput}
            placeholder={t.ai.placeholder}
            placeholderTextColor={theme.textMuted}
            style={[s.textInput, { color: theme.text, textAlign: TA }]}
            multiline maxLength={500}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:        { flex:1 },
  header:      { paddingHorizontal:16, paddingBottom:18, flexDirection:"row", alignItems:"flex-end", justifyContent:"space-between" },
  headerCenter:{ alignItems:"center", gap:2 },
  headerSub:   { color:"rgba(255,255,255,0.65)", fontSize:12, fontFamily:FONTS.regular },
  headerTitle: { color:"#fff", fontSize:20, fontFamily:FONTS.bold },
  clearBtn:    { padding:10, backgroundColor:"rgba(255,255,255,0.12)", borderRadius:RADIUS.md },
  botBadge:    { width:40, height:40, borderRadius:RADIUS.full, backgroundColor:"rgba(255,255,255,0.15)", alignItems:"center", justifyContent:"center" },
  msgList:     { padding:16, gap:16 },
  msgEmpty:    { flex:1 },
  welcome:     { flex:1, alignItems:"center", justifyContent:"center", padding:24, gap:14 },
  welcomeIcon: { width:90, height:90, borderRadius:RADIUS.full, alignItems:"center", justifyContent:"center" },
  welcomeTitle:{ fontSize:22, fontFamily:FONTS.bold, textAlign:"center" },
  welcomeSub:  { fontSize:15, fontFamily:FONTS.regular, textAlign:"center", lineHeight:24 },
  keyWarning:  { flexDirection:"row", alignItems:"center", gap:8, borderRadius:RADIUS.md, padding:12, borderWidth:1, width:"100%" },
  keyWarnTxt:  { fontSize:13, fontFamily:FONTS.medium, flex:1 },
  suggestions: { width:"100%", gap:8, marginTop:4 },
  suggestion:  { flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderRadius:RADIUS.lg, padding:14, borderWidth:0.5, ...SHADOWS.sm },
  suggTxt:     { fontSize:14, fontFamily:FONTS.regular, flex:1 },
  msgRow:      { flexDirection:"row", alignItems:"flex-end", gap:8 },
  userRow:     { justifyContent:"flex-start" },
  botRow:      { justifyContent:"flex-end" },
  botAvatar:   { width:32, height:32, borderRadius:RADIUS.full, alignItems:"center", justifyContent:"center", flexShrink:0 },
  bubble:      { maxWidth:"82%", borderRadius:RADIUS.xl, overflow:"hidden" },
  userBubble:  { borderBottomLeftRadius:6 },
  botBubble:   { borderBottomRightRadius:6, borderWidth:0.5, padding:14 },
  userBubbleGrad:{ padding:14 },
  userTxt:     { color:"#fff", fontSize:15, fontFamily:FONTS.regular, lineHeight:24 },
  botTxt:      { fontSize:15, fontFamily:FONTS.regular, lineHeight:24 },
  inputBar:    { flexDirection:"row", alignItems:"flex-end", gap:10, padding:12, borderTopWidth:0.5 },
  textInput:   { flex:1, fontSize:15, fontFamily:FONTS.regular, maxHeight:120, paddingVertical:8 },
  sendBtn:     { borderRadius:RADIUS.full, overflow:"hidden", marginBottom:2 },
  sendBtnGrad: { width:46, height:46, alignItems:"center", justifyContent:"center" },
});
