import {
  collection, doc, setDoc, getDoc, getDocs,
  deleteDoc, updateDoc, serverTimestamp, Timestamp,
  query, orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { Will, Guardian, Debt, DigitalAsset, User } from "./storage";

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function toISO(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  return String(val);
}

// ─── User Profile ─────────────────────────────────────────────────────────────
export const fsUser = {
  async save(uid: string, user: Omit<User, "id">): Promise<void> {
    await setDoc(doc(db, "users", uid), {
      ...user,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async get(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      id: snap.id,
      name: d.name ?? "",
      email: d.email ?? "",
      phone: d.phone,
      lastCheckinAt: toISO(d.lastCheckinAt),
      checkinIntervalDays: d.checkinIntervalDays ?? 30,
    };
  },

  async recordCheckin(uid: string): Promise<void> {
    await updateDoc(doc(db, "users", uid), {
      lastCheckinAt: serverTimestamp(),
    });
  },
};

// ─── Wills ────────────────────────────────────────────────────────────────────
export const fsWills = {
  async getAll(uid: string): Promise<Will[]> {
    const q = query(collection(db, "users", uid, "wills"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title ?? "",
        content: data.content ?? "",
        status: data.status ?? "draft",
        recipient: data.recipient,
        witnesses: data.witnesses,
        createdAt: toISO(data.createdAt),
        updatedAt: toISO(data.updatedAt),
      } as Will;
    });
  },

  async save(uid: string, will: Omit<Will, "id" | "createdAt" | "updatedAt">): Promise<Will> {
    const id = genId();
    const now = serverTimestamp();
    await setDoc(doc(db, "users", uid, "wills", id), {
      ...will,
      createdAt: now,
      updatedAt: now,
    });
    const iso = new Date().toISOString();
    return { ...will, id, createdAt: iso, updatedAt: iso };
  },

  async update(uid: string, id: string, updates: Partial<Will>): Promise<void> {
    await updateDoc(doc(db, "users", uid, "wills", id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(db, "users", uid, "wills", id));
  },
};

// ─── Guardians ────────────────────────────────────────────────────────────────
export const fsGuardians = {
  async getAll(uid: string): Promise<Guardian[]> {
    const q = query(collection(db, "users", uid, "guardians"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        relationship: data.relationship ?? "",
        isConfirmed: data.isConfirmed ?? false,
        createdAt: toISO(data.createdAt),
      } as Guardian;
    });
  },

  async save(uid: string, g: Omit<Guardian, "id" | "createdAt" | "isConfirmed">): Promise<Guardian> {
    const id = genId();
    await setDoc(doc(db, "users", uid, "guardians", id), {
      ...g,
      isConfirmed: false,
      createdAt: serverTimestamp(),
    });
    return { ...g, id, isConfirmed: false, createdAt: new Date().toISOString() };
  },

  async delete(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(db, "users", uid, "guardians", id));
  },
};

// ─── Debts ───────────────────────────────────────────────────────────────────
export const fsDebts = {
  async getAll(uid: string): Promise<Debt[]> {
    const q = query(collection(db, "users", uid, "debts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        type: data.type ?? "debt",
        description: data.description ?? "",
        amount: data.amount ?? 0,
        currency: data.currency ?? "SAR",
        creditorName: data.creditorName ?? "",
        isPaid: data.isPaid ?? false,
        createdAt: toISO(data.createdAt),
      } as Debt;
    });
  },

  async save(uid: string, d: Omit<Debt, "id" | "createdAt" | "isPaid">): Promise<Debt> {
    const id = genId();
    await setDoc(doc(db, "users", uid, "debts", id), {
      ...d,
      isPaid: false,
      createdAt: serverTimestamp(),
    });
    return { ...d, id, isPaid: false, createdAt: new Date().toISOString() };
  },

  async toggle(uid: string, id: string, current: boolean): Promise<void> {
    await updateDoc(doc(db, "users", uid, "debts", id), { isPaid: !current });
  },

  async delete(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(db, "users", uid, "debts", id));
  },
};

// ─── Digital Assets ──────────────────────────────────────────────────────────
export const fsAssets = {
  async getAll(uid: string): Promise<DigitalAsset[]> {
    const q = query(collection(db, "users", uid, "digitalAssets"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        platform: data.platform ?? "",
        accountIdentifier: data.accountIdentifier ?? "",
        instructions: data.instructions ?? "",
        action: data.action ?? "inherit",
        createdAt: toISO(data.createdAt),
      } as DigitalAsset;
    });
  },

  async save(uid: string, a: Omit<DigitalAsset, "id" | "createdAt">): Promise<DigitalAsset> {
    const id = genId();
    await setDoc(doc(db, "users", uid, "digitalAssets", id), {
      ...a,
      createdAt: serverTimestamp(),
    });
    return { ...a, id, createdAt: new Date().toISOString() };
  },

  async delete(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(db, "users", uid, "digitalAssets", id));
  },
};
