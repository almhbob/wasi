import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fsUser, fsWills, fsGuardians, fsDebts, fsAssets } from "@/lib/firestoreDB";
import { storage, User, Will, Guardian, Debt, DigitalAsset } from "@/lib/storage";

interface AppState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  wills: Will[];
  guardians: Guardian[];
  debts: Debt[];
  digitalAssets: DigitalAsset[];
  lastCheckin: string | null;
  isLoading: boolean;
  isAuthReady: boolean;
  geminiKey: string | null;
  authError: string | null;
}

interface AppContextType extends AppState {
  refreshAll: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
  recordCheckin: () => Promise<void>;
  saveGeminiKey: (key: string) => Promise<void>;
  refreshWills: () => Promise<void>;
  refreshGuardians: () => Promise<void>;
  refreshDebts: () => Promise<void>;
  refreshAssets: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

function fallbackProfile(fbUser: FirebaseUser): User {
  const now = new Date().toISOString();
  const email = fbUser.email ?? "";
  return {
    id: fbUser.uid,
    name: fbUser.displayName || email.split("@")[0] || "مستخدم وصي",
    email,
    lastCheckinAt: now,
    checkinIntervalDays: 30,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    firebaseUser: null,
    user: null,
    wills: [],
    guardians: [],
    debts: [],
    digitalAssets: [],
    lastCheckin: null,
    isLoading: true,
    isAuthReady: false,
    geminiKey: null,
    authError: null,
  });

  const loadUserData = useCallback(async (fbUser: FirebaseUser) => {
    setState(prev => ({ ...prev, firebaseUser: fbUser, isLoading: true, isAuthReady: true, authError: null }));

    try {
      let profile = await fsUser.get(fbUser.uid);
      if (!profile) {
        profile = fallbackProfile(fbUser);
        await fsUser.save(fbUser.uid, {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          lastCheckinAt: profile.lastCheckinAt,
          checkinIntervalDays: profile.checkinIntervalDays,
        });
      }

      const [wills, guardians, debts, digitalAssets, geminiKey] = await Promise.all([
        fsWills.getAll(fbUser.uid).catch(() => []),
        fsGuardians.getAll(fbUser.uid).catch(() => []),
        fsDebts.getAll(fbUser.uid).catch(() => []),
        fsAssets.getAll(fbUser.uid).catch(() => []),
        storage.getGeminiKey().catch(() => null),
      ]);

      setState(prev => ({
        ...prev,
        firebaseUser: fbUser,
        user: profile,
        wills,
        guardians,
        debts,
        digitalAssets,
        lastCheckin: profile?.lastCheckinAt ?? null,
        geminiKey,
        isLoading: false,
        isAuthReady: true,
        authError: null,
      }));
    } catch (error) {
      console.warn("Wasi auth data load failed", error);
      const profile = fallbackProfile(fbUser);
      setState(prev => ({
        ...prev,
        firebaseUser: fbUser,
        user: profile,
        wills: [],
        guardians: [],
        debts: [],
        digitalAssets: [],
        lastCheckin: profile.lastCheckinAt,
        isLoading: false,
        isAuthReady: true,
        authError: "تعذر تحميل بعض البيانات، ويمكنك المتابعة وسيتم التحديث لاحقاً.",
      }));
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        await loadUserData(fbUser);
      } else {
        const geminiKey = await storage.getGeminiKey().catch(() => null);
        setState({
          firebaseUser: null,
          user: null,
          wills: [],
          guardians: [],
          debts: [],
          digitalAssets: [],
          lastCheckin: null,
          isLoading: false,
          isAuthReady: true,
          geminiKey,
          authError: null,
        });
      }
    });
    return unsub;
  }, [loadUserData]);

  const refreshAll = useCallback(async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    await loadUserData(fbUser);
  }, [loadUserData]);

  const setUser = async (user: User) => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    await fsUser.save(fbUser.uid, {
      name: user.name,
      email: user.email,
      phone: user.phone,
      lastCheckinAt: user.lastCheckinAt,
      checkinIntervalDays: user.checkinIntervalDays,
    });
    setState(prev => ({ ...prev, user }));
  };

  const recordCheckin = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    await fsUser.recordCheckin(fbUser.uid);
    const now = new Date().toISOString();
    setState(prev => ({
      ...prev,
      lastCheckin: now,
      user: prev.user ? { ...prev.user, lastCheckinAt: now } : prev.user,
    }));
  };

  const saveGeminiKey = async (key: string) => {
    await storage.saveGeminiKey(key);
    setState(prev => ({ ...prev, geminiKey: key }));
  };

  const refreshWills = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    const wills = await fsWills.getAll(fbUser.uid).catch(() => []);
    setState(prev => ({ ...prev, wills }));
  };

  const refreshGuardians = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    const guardians = await fsGuardians.getAll(fbUser.uid).catch(() => []);
    setState(prev => ({ ...prev, guardians }));
  };

  const refreshDebts = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    const debts = await fsDebts.getAll(fbUser.uid).catch(() => []);
    setState(prev => ({ ...prev, debts }));
  };

  const refreshAssets = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    const digitalAssets = await fsAssets.getAll(fbUser.uid).catch(() => []);
    setState(prev => ({ ...prev, digitalAssets }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      refreshAll, setUser, recordCheckin, saveGeminiKey,
      refreshWills, refreshGuardians, refreshDebts, refreshAssets,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
