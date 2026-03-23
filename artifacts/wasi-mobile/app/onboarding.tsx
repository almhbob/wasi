import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme,
} from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fsUser } from "@/lib/firestoreDB";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { FONTS, RADIUS } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { t, isRTL } from "@/lib/i18n";

const LOGO = require("../assets/images/icon.png");
const { width: W } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const TA    = isRTL ? "right" : "left";
const ROW   = isRTL ? "row-reverse" : "row";

const INTERVALS = [7, 14, 30, 60, 90] as const;
const STEPS = 4;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  useApp();

  const [step, setStep]            = useState(0);
  const [mode, setMode]            = useState<"signup" | "login">("signup");
  const [name, setName]            = useState("");
  const [email, setEmail]          = useState("");
  const [password, setPassword]    = useState("");
  const [showPass, setShowPass]    = useState(false);
  const [interval, setIntervalVal] = useState(30);
  const [isSaving, setIsSaving]    = useState(false);
  const [nameError, setNameError]  = useState("");
  const [emailError, setEmailError]= useState("");
  const [passError, setPassError]  = useState("");

  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: false }).start();
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, { toValue: 1.06, duration: 2000, useNativeDriver: false }),
        Animated.timing(logoPulse, { toValue: 1,    duration: 2000, useNativeDriver: false }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const transitionTo = (next: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 180, useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: isRTL ? 30 : -30, duration: 180, useNativeDriver: false }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(isRTL ? -30 : 30);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: false }),
        Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 12, useNativeDriver: false }),
      ]).start();
    });
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 1) {
      let valid = true;
      if (!name.trim())           { setNameError(t.onboarding.nameError);      valid = false; }
      else if (name.trim().length < 2) { setNameError(t.onboarding.nameErrorShort); valid = false; }
      else setNameError("");
      if (!email.trim() || !email.includes("@")) {
        setEmailError(isRTL ? "البريد الإلكتروني مطلوب" : "Valid email required");
        valid = false;
      } else setEmailError("");
      if (password.length < 6) {
        setPassError(isRTL ? "كلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters");
        valid = false;
      } else setPassError("");
      if (!valid) return;
    }
    if (step < STEPS - 1) { transitionTo(step + 1); return; }
    setIsSaving(true);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;
      const now = new Date().toISOString();
      await fsUser.save(uid, {
        name: name.trim(),
        email: email.trim(),
        checkinIntervalDays: interval,
        lastCheckinAt: now,
      });
      router.replace("/(tabs)");
    } catch (err: any) {
      setIsSaving(false);
      const code = err?.code ?? "";
      let msg = isRTL ? "حدث خطأ، حاول مرة أخرى" : "An error occurred, please try again";
      if (code === "auth/email-already-in-use") msg = isRTL ? "البريد مستخدم بالفعل" : "Email already in use";
      if (code === "auth/invalid-email")        msg = isRTL ? "بريد إلكتروني غير صحيح" : "Invalid email address";
      if (code === "auth/weak-password")        msg = isRTL ? "كلمة المرور ضعيفة جداً" : "Password is too weak";
      Alert.alert(isRTL ? "خطأ" : "Error", msg);
    }
  };

  const handleLogin = async () => {
    let valid = true;
    if (!email.trim() || !email.includes("@")) {
      setEmailError(isRTL ? "البريد الإلكتروني مطلوب" : "Valid email required"); valid = false;
    } else setEmailError("");
    if (password.length < 6) {
      setPassError(isRTL ? "كلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters"); valid = false;
    } else setPassError("");
    if (!valid) return;
    setIsSaving(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      setIsSaving(false);
      const code = err?.code ?? "";
      let msg = isRTL ? "حدث خطأ، حاول مرة أخرى" : "An error occurred";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") msg = isRTL ? "البريد أو كلمة المرور غير صحيحة" : "Invalid email or password";
      if (code === "auth/wrong-password") msg = isRTL ? "كلمة المرور غير صحيحة" : "Wrong password";
      if (code === "auth/too-many-requests") msg = isRTL ? "محاولات كثيرة، انتظر قليلاً" : "Too many attempts, please wait";
      Alert.alert(isRTL ? "خطأ" : "Error", msg);
    }
  };

  const handleBack = () => { if (step > 0) transitionTo(step - 1); };

  const topPad = isWeb ? 67 : insets.top;
  const botPad = isWeb ? 34 : insets.bottom;

  const intervalLabel = (days: number): string => (t.onboarding.intervals as any)[days]?.label ?? `${days}`;
  const intervalSub   = (days: number): string => (t.onboarding.intervals as any)[days]?.sub   ?? "";

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <LinearGradient colors={["#060E12", "#0D2830", "#112D38"]} style={[s.root, { paddingTop: topPad }]}>
        <View style={s.blob1} /><View style={s.blob2} /><View style={s.blob3} />

        {/* Step indicator */}
        {step > 0 && (
          <View style={[s.stepsRow, { flexDirection: ROW }]}>
            <Pressable onPress={handleBack} style={s.backBtn}>
              <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={22} color="rgba(255,255,255,0.6)" />
            </Pressable>
            <View style={s.dotsWrap}>
              {Array.from({ length: STEPS }).map((_, i) => (
                <View key={i} style={[
                  s.dot,
                  i < step  && { backgroundColor: Colors.primary, width: 8 },
                  i === step && { backgroundColor: "#fff", width: 24, borderRadius: RADIUS.full },
                  i > step  && { backgroundColor: "rgba(255,255,255,0.2)" },
                ]} />
              ))}
            </View>
            <Text style={s.stepLabel}>{step}/{STEPS - 1}</Text>
          </View>
        )}

        <Animated.View style={[s.content, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>

          {/* ── STEP 0: WELCOME ── */}
          {step === 0 && (
            <View style={s.stepWrap}>
              <View style={s.welcomeCenter}>
                <Animated.View style={[s.logoWrap, { transform: [{ scale: Animated.multiply(logoScale, logoPulse) }] }]}>
                  <Image source={LOGO} style={s.logoImg} resizeMode="cover" />
                  <View style={s.logoRing} />
                </Animated.View>

                <Text style={s.tagline}>{t.onboarding.tagline}</Text>

                <View style={s.verseBg}>
                  <Text style={s.verseLabel}>{t.onboarding.verseLabel}</Text>
                  <Text style={s.verseText}>{t.onboarding.verse}</Text>
                  <Text style={s.verseSrc}>{t.onboarding.verseSrc}</Text>
                </View>

                <View style={s.featureList}>
                  {[t.onboarding.feature1, t.onboarding.feature2, t.onboarding.feature3].map((f, i) => (
                    <View key={i} style={[s.featureItem, { flexDirection: ROW }]}>
                      <View style={s.featureIcon}>
                        <Feather name={["file-text","users","heart"][i] as never} size={16} color={Colors.primary} />
                      </View>
                      <Text style={[s.featureTxt, { textAlign: TA }]}>{f}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {mode === "login" ? (
                <View style={[s.loginBox]}>
                  <Text style={[s.stepTitle, { textAlign: "center", fontSize: 22, marginBottom: 4 }]}>
                    {isRTL ? "تسجيل الدخول" : "Sign In"}
                  </Text>
                  <View style={s.fieldGroup}>
                    <View style={[s.inputWrap, emailError ? s.inputError : null]}>
                      <TextInput value={email} onChangeText={tx => { setEmail(tx); setEmailError(""); }}
                        placeholder={t.onboarding.emailPlaceholder} placeholderTextColor="rgba(255,255,255,0.28)"
                        style={[s.input, { textAlign: "left" }]} keyboardType="email-address" autoCapitalize="none" />
                      <View style={s.inputIcon}><Feather name="mail" size={18} color={email ? Colors.primary : "rgba(255,255,255,0.3)"} /></View>
                    </View>
                    {emailError ? <Text style={[s.errorTxt, { textAlign: "center" }]}>{emailError}</Text> : null}
                  </View>
                  <View style={s.fieldGroup}>
                    <View style={[s.inputWrap, passError ? s.inputError : null]}>
                      <TextInput value={password} onChangeText={tx => { setPassword(tx); setPassError(""); }}
                        placeholder={isRTL ? "كلمة المرور" : "Password"} placeholderTextColor="rgba(255,255,255,0.28)"
                        style={[s.input, { textAlign: "left" }]} secureTextEntry={!showPass} autoCapitalize="none" />
                      <Pressable onPress={() => setShowPass(p => !p)} style={s.inputIcon}>
                        <Feather name={showPass ? "eye-off" : "eye"} size={18} color="rgba(255,255,255,0.4)" />
                      </Pressable>
                    </View>
                    {passError ? <Text style={[s.errorTxt, { textAlign: "center" }]}>{passError}</Text> : null}
                  </View>
                  <Pressable onPress={handleLogin} disabled={isSaving}
                    style={({ pressed }) => [s.primaryBtn, { marginHorizontal: 0, opacity: isSaving || pressed ? 0.85 : 1 }]}>
                    <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={s.primaryBtnGrad}>
                      <Text style={s.primaryBtnTxt}>{isSaving ? (isRTL ? "جاري الدخول..." : "Signing in...") : (isRTL ? "دخول" : "Sign In")}</Text>
                    </LinearGradient>
                  </Pressable>
                  <Pressable onPress={() => { setMode("signup"); setEmail(""); setPassword(""); setEmailError(""); setPassError(""); }} style={{ marginTop: 8 }}>
                    <Text style={[s.secureNote, { color: Colors.primaryLight }]}>{isRTL ? "← إنشاء حساب جديد" : "← Create a new account"}</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={handleNext} style={({ pressed }) => [s.primaryBtn, { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
                  <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={[s.primaryBtnGrad, { flexDirection: ROW }]}>
                    <Feather name={isRTL ? "arrow-left" : "arrow-right"} size={20} color="#fff" />
                    <Text style={s.primaryBtnTxt}>{t.onboarding.startBtn}</Text>
                  </LinearGradient>
                </Pressable>
              )}
              {mode === "signup" && (
                <Pressable onPress={() => { setMode("login"); setEmail(""); setPassword(""); }} style={{ marginTop: 4 }}>
                  <Text style={[s.secureNote, { color: Colors.primaryLight, marginBottom: 0 }]}>
                    {isRTL ? "لديّ حساب بالفعل — تسجيل الدخول" : "Already have an account? Sign In"}
                  </Text>
                </Pressable>
              )}
              <Text style={[s.secureNote, { marginBottom: botPad + 8 }]}>
                🔒 {t.onboarding.secureNote}
              </Text>
            </View>
          )}

          {/* ── STEP 1: NAME ── */}
          {step === 1 && (
            <ScrollView style={s.stepWrap} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={[s.stepHeader, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                <Text style={s.stepEmoji}>👤</Text>
                <Text style={[s.stepTitle, { textAlign: TA }]}>{t.onboarding.step1Title}</Text>
                <Text style={[s.stepDesc,  { textAlign: TA }]}>{t.onboarding.step1Desc}</Text>
              </View>
              <View style={s.fieldsWrap}>
                <View style={s.fieldGroup}>
                  <Text style={[s.fieldLabel, { textAlign: TA }]}>{t.onboarding.nameLabel} *</Text>
                  <View style={[s.inputWrap, nameError ? s.inputError : null]}>
                    <TextInput
                      value={name} onChangeText={tx => { setName(tx); setNameError(""); }}
                      placeholder={t.onboarding.namePlaceholder}
                      placeholderTextColor="rgba(255,255,255,0.28)"
                      style={[s.input, { textAlign: TA }]}
                      autoFocus returnKeyType="next"
                    />
                    <View style={s.inputIcon}>
                      <Feather name="user" size={18} color={name ? Colors.primary : "rgba(255,255,255,0.3)"} />
                    </View>
                  </View>
                  {nameError ? <Text style={[s.errorTxt, { textAlign: TA }]}>{nameError}</Text> : null}
                </View>

                <View style={s.fieldGroup}>
                  <Text style={[s.fieldLabel, { textAlign: TA }]}>{t.onboarding.emailLabel} *</Text>
                  <View style={[s.inputWrap, emailError ? s.inputError : null]}>
                    <TextInput
                      value={email} onChangeText={tx => { setEmail(tx); setEmailError(""); }}
                      placeholder={t.onboarding.emailPlaceholder}
                      placeholderTextColor="rgba(255,255,255,0.28)"
                      style={[s.input, { textAlign: "left" }]}
                      keyboardType="email-address" autoCapitalize="none" returnKeyType="next"
                    />
                    <View style={s.inputIcon}>
                      <Feather name="mail" size={18} color={email ? Colors.primary : "rgba(255,255,255,0.3)"} />
                    </View>
                  </View>
                  {emailError ? <Text style={[s.errorTxt, { textAlign: TA }]}>{emailError}</Text> : null}
                </View>

                <View style={s.fieldGroup}>
                  <Text style={[s.fieldLabel, { textAlign: TA }]}>{isRTL ? "كلمة المرور *" : "Password *"}</Text>
                  <View style={[s.inputWrap, passError ? s.inputError : null]}>
                    <TextInput
                      value={password} onChangeText={tx => { setPassword(tx); setPassError(""); }}
                      placeholder={isRTL ? "6 أحرف على الأقل" : "Min. 6 characters"}
                      placeholderTextColor="rgba(255,255,255,0.28)"
                      style={[s.input, { textAlign: "left" }]}
                      secureTextEntry={!showPass} autoCapitalize="none" returnKeyType="done"
                    />
                    <Pressable onPress={() => setShowPass(p => !p)} style={s.inputIcon}>
                      <Feather name={showPass ? "eye-off" : "eye"} size={18} color="rgba(255,255,255,0.4)" />
                    </Pressable>
                  </View>
                  {passError ? <Text style={[s.errorTxt, { textAlign: TA }]}>{passError}</Text> : null}
                </View>
              </View>
              <View style={[s.infoBox, { marginBottom: botPad + 80 }]}>
                <Feather name="info" size={14} color={Colors.primaryLight} />
                <Text style={[s.infoTxt, { textAlign: TA }]}>{t.onboarding.nameInfo}</Text>
              </View>
            </ScrollView>
          )}

          {/* ── STEP 2: INTERVAL ── */}
          {step === 2 && (
            <ScrollView style={s.stepWrap} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={[s.stepHeader, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                <Text style={s.stepEmoji}>🛡️</Text>
                <Text style={[s.stepTitle, { textAlign: TA }]}>{t.onboarding.step2Title}</Text>
                <Text style={[s.stepDesc,  { textAlign: TA }]}>{t.onboarding.step2Desc}</Text>
              </View>
              <View style={s.intervalList}>
                {INTERVALS.map(iv => {
                  const active = interval === iv;
                  return (
                    <Pressable key={iv} onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIntervalVal(iv); }}
                      style={({ pressed }) => [s.intervalCard, active && s.intervalCardActive, { opacity: pressed ? 0.85 : 1 }]}>
                      {active && <LinearGradient colors={[Colors.primary + "35", Colors.primary + "10"]} style={StyleSheet.absoluteFill} />}
                      <View style={[s.intervalCheck, active && s.intervalCheckActive]}>
                        {active && <Feather name="check" size={13} color="#fff" />}
                      </View>
                      <View style={[s.intervalBody, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                        <Text style={[s.intervalLabel, { color: active ? Colors.primaryLight : "#fff" }]}>{intervalLabel(iv)}</Text>
                        <Text style={s.intervalSub}>{intervalSub(iv)}</Text>
                      </View>
                      <View style={[s.intervalDaysTag, { backgroundColor: active ? Colors.primary + "30" : "rgba(255,255,255,0.06)" }]}>
                        <Text style={[s.intervalDaysTxt, { color: active ? Colors.primaryLight : "rgba(255,255,255,0.4)" }]}>{iv}d</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              <View style={[s.infoBox, { marginBottom: botPad + 80 }]}>
                <Feather name="shield" size={14} color={Colors.primaryLight} />
                <Text style={[s.infoTxt, { textAlign: TA }]}>{t.onboarding.intervalInfo}</Text>
              </View>
            </ScrollView>
          )}

          {/* ── STEP 3: DONE ── */}
          {step === 3 && (
            <View style={s.stepWrap}>
              <View style={s.readyCenter}>
                <View style={s.readyIconWrap}>
                  <LinearGradient colors={["#2E9E6B","#1B6B48"]} style={s.readyIcon}>
                    <Feather name="check" size={44} color="#fff" />
                  </LinearGradient>
                  <View style={[s.readyRing, { borderColor: "#2E9E6B40" }]} />
                </View>
                <Text style={s.readyTitle}>{t.onboarding.step3Title}</Text>
                <Text style={s.readyName}>{name.trim()}</Text>
                <Text style={[s.readyDesc, { textAlign:"center" }]}>
                  {t.onboarding.step3Desc.replace("{{interval}}", intervalLabel(interval))}
                </Text>

                <View style={s.readySummary}>
                  {[
                    { label: t.onboarding.summaryName,     val: name.trim() },
                    { label: t.onboarding.summaryInterval, val: intervalLabel(interval) },
                    ...(email.trim() ? [{ label: t.onboarding.summaryEmail, val: email.trim() }] : []),
                  ].map((row, i, arr) => (
                    <View key={i} style={[s.summaryRow, { flexDirection: ROW }, i < arr.length - 1 && s.summaryBorder]}>
                      <Text style={s.summaryVal}>{row.val}</Text>
                      <Text style={s.summaryLabel}>{row.label}</Text>
                    </View>
                  ))}
                </View>

                <View style={s.hadithBox}>
                  <Text style={[s.hadithTxt, { textAlign:"center" }]}>{t.onboarding.hadith}</Text>
                  <Text style={s.hadithSrc}>{t.onboarding.hadithSrc}</Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Bottom CTA for steps 1-3 */}
        {step > 0 && (
          <View style={[s.bottomBar, { paddingBottom: botPad + 12 }]}>
            <Pressable onPress={handleNext} disabled={isSaving}
              style={({ pressed }) => [s.primaryBtn, { flex:1, opacity: isSaving || pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
              <LinearGradient
                colors={step === STEPS - 1 ? ["#2E9E6B","#1B6B48"] : [Colors.primary, Colors.primaryDark]}
                style={[s.primaryBtnGrad, { flexDirection: ROW }]}
              >
                {isSaving ? (
                  <Text style={s.primaryBtnTxt}>{t.common.saving}</Text>
                ) : (
                  <>
                    <Feather name={step === STEPS - 1 ? "check-circle" : (isRTL ? "arrow-left" : "arrow-right")} size={20} color="#fff" />
                    <Text style={s.primaryBtnTxt}>{step === STEPS - 1 ? t.onboarding.enterBtn : t.common.next}</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:         { flex:1, position:"relative", overflow:"hidden" },
  blob1:        { position:"absolute", width:300, height:300, borderRadius:150, backgroundColor: Colors.primary+"18", top:-80, right:-80 },
  blob2:        { position:"absolute", width:200, height:200, borderRadius:100, backgroundColor:"#7B5CB818", bottom:100, left:-60 },
  blob3:        { position:"absolute", width:160, height:160, borderRadius:80, backgroundColor: Colors.accent+"10", bottom:300, right:-40 },
  stepsRow:     { alignItems:"center", justifyContent:"space-between", paddingHorizontal:20, paddingTop:12, paddingBottom:4 },
  backBtn:      { padding:8 },
  dotsWrap:     { flexDirection:"row", alignItems:"center", gap:6 },
  dot:          { width:8, height:8, borderRadius:RADIUS.full, backgroundColor:"rgba(255,255,255,0.2)" },
  stepLabel:    { color:"rgba(255,255,255,0.4)", fontSize:12, fontFamily:FONTS.medium, minWidth:30, textAlign:"right" },
  content:      { flex:1 },
  stepWrap:     { flex:1 },
  scrollContent:{ paddingHorizontal:24, paddingTop:8, paddingBottom:20 },
  welcomeCenter:{ flex:1, alignItems:"center", justifyContent:"center", paddingHorizontal:28, gap:20 },
  logoWrap:     { position:"relative", alignItems:"center", justifyContent:"center" },
  logoImg:      { width:140, height:140, borderRadius:RADIUS.xl },
  logoRing:     { position:"absolute", width:168, height:168, borderRadius:RADIUS.full, borderWidth:1.5, borderColor: Colors.primary+"40" },
  appName:      { color:"#fff", fontSize:48, fontFamily:FONTS.extraBold },
  tagline:      { color: Colors.primaryLight, fontSize:16, fontFamily:FONTS.medium, textAlign:"center" },
  verseBg:      { backgroundColor:"rgba(255,255,255,0.05)", borderRadius:RADIUS.xl, padding:18, borderWidth:1, borderColor:"rgba(255,255,255,0.08)", width:"100%", gap:6 },
  verseLabel:   { color:"rgba(255,255,255,0.45)", fontSize:11, fontFamily:FONTS.medium, textAlign:"center" },
  verseText:    { color:"rgba(255,255,255,0.88)", fontSize:14, fontFamily:FONTS.semiBold, textAlign:"center", lineHeight:26 },
  verseSrc:     { color:"rgba(255,255,255,0.35)", fontSize:11, fontFamily:FONTS.regular, textAlign:"center" },
  featureList:  { width:"100%", gap:10 },
  featureItem:  { alignItems:"center", gap:10 },
  featureTxt:   { color:"rgba(255,255,255,0.8)", fontSize:14, fontFamily:FONTS.medium, flex:1 },
  featureIcon:  { width:34, height:34, borderRadius:RADIUS.md, backgroundColor: Colors.primary+"22", alignItems:"center", justifyContent:"center" },
  primaryBtn:   { borderRadius:RADIUS.xl, overflow:"hidden", marginHorizontal:24, marginTop:8 },
  primaryBtnGrad:{ alignItems:"center", justifyContent:"center", gap:10, paddingVertical:17 },
  primaryBtnTxt:{ color:"#fff", fontSize:18, fontFamily:FONTS.bold },
  secureNote:   { textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:12, fontFamily:FONTS.regular, paddingTop:10 },
  stepHeader:   { paddingTop:16, paddingBottom:24, gap:6 },
  stepEmoji:    { fontSize:40 },
  stepTitle:    { color:"#fff", fontSize:30, fontFamily:FONTS.extraBold },
  stepDesc:     { color:"rgba(255,255,255,0.6)", fontSize:15, fontFamily:FONTS.regular, lineHeight:24 },
  fieldsWrap:   { gap:18 },
  fieldGroup:   { gap:8 },
  labelRow:     { alignItems:"center", gap:8 },
  fieldLabel:   { color:"rgba(255,255,255,0.8)", fontSize:14, fontFamily:FONTS.semiBold },
  optionalTag:  { backgroundColor:"rgba(255,255,255,0.08)", borderRadius:RADIUS.full, paddingHorizontal:8, paddingVertical:2 },
  optionalTxt:  { color:"rgba(255,255,255,0.4)", fontSize:11, fontFamily:FONTS.medium },
  inputWrap:    { flexDirection:"row", alignItems:"center", backgroundColor:"rgba(255,255,255,0.07)", borderRadius:RADIUS.lg, borderWidth:1, borderColor:"rgba(255,255,255,0.12)" },
  inputError:   { borderColor:"#E05555" },
  input:        { flex:1, color:"#fff", fontSize:16, fontFamily:FONTS.regular, paddingVertical:15, paddingHorizontal:14 },
  inputIcon:    { paddingHorizontal:14 },
  errorTxt:     { color:"#E05555", fontSize:12, fontFamily:FONTS.medium },
  infoBox:      { flexDirection:"row", alignItems:"flex-start", gap:8, backgroundColor:"rgba(255,255,255,0.05)", borderRadius:RADIUS.lg, padding:14, marginTop:16, borderWidth:1, borderColor:"rgba(255,255,255,0.06)" },
  infoTxt:      { color: Colors.primaryLight, fontSize:13, fontFamily:FONTS.regular, flex:1, lineHeight:22 },
  intervalList: { gap:10 },
  intervalCard: { flexDirection:"row", alignItems:"center", gap:14, borderRadius:RADIUS.xl, padding:16, borderWidth:1.5, borderColor:"rgba(255,255,255,0.08)", backgroundColor:"rgba(255,255,255,0.04)", overflow:"hidden" },
  intervalCardActive:{ borderColor: Colors.primary + "80" },
  intervalCheck:{ width:26, height:26, borderRadius:RADIUS.full, borderWidth:2, borderColor:"rgba(255,255,255,0.2)", alignItems:"center", justifyContent:"center", flexShrink:0 },
  intervalCheckActive:{ backgroundColor: Colors.primary, borderColor: Colors.primary },
  intervalBody: { flex:1, gap:2 },
  intervalLabel:{ fontSize:17, fontFamily:FONTS.bold },
  intervalSub:  { color:"rgba(255,255,255,0.4)", fontSize:12, fontFamily:FONTS.regular },
  intervalDaysTag:{ borderRadius:RADIUS.md, paddingHorizontal:10, paddingVertical:6 },
  intervalDaysTxt:{ fontSize:13, fontFamily:FONTS.bold },
  readyCenter:  { flex:1, alignItems:"center", justifyContent:"center", paddingHorizontal:24, gap:18 },
  readyIconWrap:{ position:"relative", alignItems:"center", justifyContent:"center" },
  readyIcon:    { width:100, height:100, borderRadius:RADIUS.full, alignItems:"center", justifyContent:"center" },
  readyRing:    { position:"absolute", width:128, height:128, borderRadius:RADIUS.full, borderWidth:2 },
  readyTitle:   { color:"#fff", fontSize:34, fontFamily:FONTS.extraBold },
  readyName:    { color: Colors.primaryLight, fontSize:22, fontFamily:FONTS.bold },
  readyDesc:    { color:"rgba(255,255,255,0.6)", fontSize:15, fontFamily:FONTS.regular, lineHeight:26 },
  readySummary: { backgroundColor:"rgba(255,255,255,0.06)", borderRadius:RADIUS.xl, padding:16, width:"100%", borderWidth:1, borderColor:"rgba(255,255,255,0.08)" },
  summaryRow:   { justifyContent:"space-between", alignItems:"center", paddingVertical:11 },
  summaryBorder:{ borderBottomWidth:0.5, borderBottomColor:"rgba(255,255,255,0.08)" },
  summaryLabel: { color:"rgba(255,255,255,0.45)", fontSize:13, fontFamily:FONTS.medium },
  summaryVal:   { color:"#fff", fontSize:14, fontFamily:FONTS.semiBold, maxWidth:"60%", textAlign:TA },
  hadithBox:    { backgroundColor:"rgba(192,120,80,0.12)", borderRadius:RADIUS.xl, padding:18, width:"100%", gap:8, borderWidth:1, borderColor:"rgba(192,120,80,0.2)" },
  hadithTxt:    { color:"rgba(255,255,255,0.8)", fontSize:13, fontFamily:FONTS.regular, lineHeight:24 },
  hadithSrc:    { color: Colors.accent, fontSize:12, fontFamily:FONTS.medium, textAlign:"center" },
  bottomBar:    { paddingHorizontal:24, paddingTop:12, borderTopWidth:0.5, borderTopColor:"rgba(255,255,255,0.06)" },
  loginBox:     { width:"100%", gap:14, padding:4 },
});
