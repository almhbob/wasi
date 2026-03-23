import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCe8KA8YBBicb-ymcLXTlTaKRnYs14OLU8",
  authDomain: "wasi-e1f16.firebaseapp.com",
  projectId: "wasi-e1f16",
  storageBucket: "wasi-e1f16.firebasestorage.app",
  messagingSenderId: "359147064565",
  appId: "1:359147064565:web:8ae0c5121f017ef0e249bc",
  measurementId: "G-S4P1XHV06P",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: ReturnType<typeof getAuth>;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

const db = getFirestore(app);
const firebaseStorage = getStorage(app);

export { app, auth, db, firebaseStorage };
