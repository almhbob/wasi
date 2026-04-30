import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fsUser } from "@/lib/firestoreDB";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function firebaseAuthMessage(code?: string): string {
  if (code === "auth/email-already-in-use") return "هذا البريد مستخدم بالفعل. جرّب تسجيل الدخول.";
  if (code === "auth/invalid-email") return "البريد الإلكتروني غير صحيح.";
  if (code === "auth/weak-password") return "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.";
  if (code === "auth/invalid-credential") return "بيانات الدخول غير صحيحة أو الحساب غير موجود.";
  if (code === "auth/user-not-found") return "لا يوجد حساب بهذا البريد.";
  if (code === "auth/wrong-password") return "كلمة المرور غير صحيحة.";
  if (code === "auth/network-request-failed") return "تعذر الاتصال بالإنترنت.";
  if (code === "auth/too-many-requests") return "محاولات كثيرة. انتظر قليلاً.";
  if (code === "auth/operation-not-allowed") return "تسجيل البريد وكلمة المرور غير مفعّل في Firebase.";
  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}

export async function registerWithFirebase(name: string, email: string, password: string) {
  const cleanEmail = normalizeEmail(email);
  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  const now = new Date().toISOString();
  await fsUser.save(credential.user.uid, {
    name: name.trim(),
    email: cleanEmail,
    lastCheckinAt: now,
    checkinIntervalDays: 30,
  });
  return credential.user;
}

export async function loginWithFirebase(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, normalizeEmail(email), password);
  return credential.user;
}
