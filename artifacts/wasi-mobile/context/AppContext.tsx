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
  });

  const loadUserData = useCallback(async (fbUser: FirebaseUser) => {
    setState(prev => ({ ...prev, isLoading: true }));
    const [profile, wills, guardians, debts, digitalAssets, geminiKey] = await Promise.all([
      fsUser.get(fbUser.uid),
      fsWills.getAll(fbUser.uid),
      fsGuardians.getAll(fbUser.uid),
      fsDebts.getAll(fbUser.uid),
      fsAssets.getAll(fbUser.uid),
      storage.getGeminiKey(),
    ]);
    const lastCheckin = profile?.lastCheckinAt ?? null;
    setState(prev => ({
      ...prev,
      user: profile,
      wills,
      guardians,
      debts,
      digitalAssets,
      lastCheckin,
      geminiKey,
      isLoading: false,
    }));
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setState(prev => ({ ...prev, firebaseUser: fbUser, isAuthReady: true }));
        await loadUserData(fbUser);
      } else {
        const geminiKey = await storage.getGeminiKey();
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
    const wills = await fsWills.getAll(fbUser.uid);
    setState(prev => ({ ...prev, wills }));
  };

  const refreshGuardians = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    const guardians = await fsGuardians.getAll(fbUser.uid);
    setState(prev => ({ ...prev, guardians }));
  };

  const refreshDebts = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    const debts = await fsDebts.getAll(fbUser.uid);
    setState(prev => ({ ...prev, debts }));
  };

  const refreshAssets = async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return;
    const digitalAssets = await fsAssets.getAll(fbUser.uid);
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
