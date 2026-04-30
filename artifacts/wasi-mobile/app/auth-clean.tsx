import React, { useState } from "react";
import { Alert, View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { loginWithFirebase, registerWithFirebase, firebaseAuthMessage } from "@/lib/firebaseAuthService";

export default function AuthClean() {
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    if (mode === "signup" && name.trim().length < 2) return Alert.alert("خطأ","أدخل الاسم");
    if (!email.includes("@")) return Alert.alert("خطأ","بريد غير صحيح");
    if (pass.length < 6) return Alert.alert("خطأ","كلمة المرور قصيرة");

    setLoading(true);
    try {
      if (mode === "signup") {
        await registerWithFirebase(name, email, pass);
      } else {
        await loginWithFirebase(email, pass);
      }
      router.replace("/(tabs)");
    } catch (e:any) {
      Alert.alert("خطأ", firebaseAuthMessage(e?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>وصي</Text>

      {mode === "signup" && (
        <TextInput placeholder="الاسم" style={styles.input} value={name} onChangeText={setName} />
      )}

      <TextInput placeholder="email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="password" secureTextEntry style={styles.input} value={pass} onChangeText={setPass} />

      <Pressable onPress={submit} style={styles.btn}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>{mode === "login" ? "دخول" : "إنشاء"}</Text>}
      </Pressable>

      <Pressable onPress={()=>setMode(mode === "login" ? "signup" : "login")}>
        <Text style={styles.switch}>{mode === "login" ? "إنشاء حساب" : "لديك حساب؟"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",padding:20},
  title:{fontSize:32,textAlign:"center",marginBottom:20},
  input:{borderWidth:1,padding:12,borderRadius:10,marginBottom:10},
  btn:{backgroundColor:"#18A782",padding:15,borderRadius:10,alignItems:"center"},
  btnText:{color:"#fff",fontWeight:"bold"},
  switch:{textAlign:"center",marginTop:10}
});
