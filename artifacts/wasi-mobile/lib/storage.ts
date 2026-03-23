import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  lastCheckinAt: string;
  checkinIntervalDays: number;
}

export interface Will {
  id: string;
  title: string;
  content: string;
  status: "draft" | "active";
  createdAt: string;
  updatedAt: string;
}

export interface Guardian {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  isConfirmed: boolean;
  createdAt: string;
}

export interface Debt {
  id: string;
  type: "debt" | "obligation";
  description: string;
  amount: number;
  currency: string;
  creditorName: string;
  isPaid: boolean;
  createdAt: string;
}

export interface DigitalAsset {
  id: string;
  platform: string;
  accountIdentifier: string;
  instructions: string;
  action: "close" | "transfer" | "inherit";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const KEYS = {
  USER: "wasi_user",
  WILLS: "wasi_wills",
  GUARDIANS: "wasi_guardians",
  DEBTS: "wasi_debts",
  DIGITAL_ASSETS: "wasi_digital_assets",
  CHAT_HISTORY: "wasi_chat_history",
  LAST_CHECKIN: "wasi_last_checkin",
  GEMINI_KEY: "wasi_gemini_key",
};

function genId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export const storage = {
  async getUser(): Promise<User | null> {
    const raw = await AsyncStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },
  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async getWills(): Promise<Will[]> {
    const raw = await AsyncStorage.getItem(KEYS.WILLS);
    return raw ? JSON.parse(raw) : [];
  },
  async saveWill(will: Omit<Will, "id" | "createdAt" | "updatedAt">): Promise<Will> {
    const wills = await storage.getWills();
    const newWill: Will = { ...will, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.WILLS, JSON.stringify([...wills, newWill]));
    return newWill;
  },
  async updateWill(id: string, updates: Partial<Will>): Promise<void> {
    const wills = await storage.getWills();
    const updated = wills.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w);
    await AsyncStorage.setItem(KEYS.WILLS, JSON.stringify(updated));
  },
  async deleteWill(id: string): Promise<void> {
    const wills = await storage.getWills();
    await AsyncStorage.setItem(KEYS.WILLS, JSON.stringify(wills.filter(w => w.id !== id)));
  },

  async getGuardians(): Promise<Guardian[]> {
    const raw = await AsyncStorage.getItem(KEYS.GUARDIANS);
    return raw ? JSON.parse(raw) : [];
  },
  async saveGuardian(g: Omit<Guardian, "id" | "createdAt" | "isConfirmed">): Promise<Guardian> {
    const guardians = await storage.getGuardians();
    const newG: Guardian = { ...g, id: genId(), isConfirmed: false, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.GUARDIANS, JSON.stringify([...guardians, newG]));
    return newG;
  },
  async deleteGuardian(id: string): Promise<void> {
    const guardians = await storage.getGuardians();
    await AsyncStorage.setItem(KEYS.GUARDIANS, JSON.stringify(guardians.filter(g => g.id !== id)));
  },

  async getDebts(): Promise<Debt[]> {
    const raw = await AsyncStorage.getItem(KEYS.DEBTS);
    return raw ? JSON.parse(raw) : [];
  },
  async saveDebt(d: Omit<Debt, "id" | "createdAt" | "isPaid">): Promise<Debt> {
    const debts = await storage.getDebts();
    const newD: Debt = { ...d, id: genId(), isPaid: false, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.DEBTS, JSON.stringify([...debts, newD]));
    return newD;
  },
  async toggleDebt(id: string): Promise<void> {
    const debts = await storage.getDebts();
    const updated = debts.map(d => d.id === id ? { ...d, isPaid: !d.isPaid } : d);
    await AsyncStorage.setItem(KEYS.DEBTS, JSON.stringify(updated));
  },
  async deleteDebt(id: string): Promise<void> {
    const debts = await storage.getDebts();
    await AsyncStorage.setItem(KEYS.DEBTS, JSON.stringify(debts.filter(d => d.id !== id)));
  },

  async getDigitalAssets(): Promise<DigitalAsset[]> {
    const raw = await AsyncStorage.getItem(KEYS.DIGITAL_ASSETS);
    return raw ? JSON.parse(raw) : [];
  },
  async saveDigitalAsset(a: Omit<DigitalAsset, "id" | "createdAt">): Promise<DigitalAsset> {
    const assets = await storage.getDigitalAssets();
    const newA: DigitalAsset = { ...a, id: genId(), createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.DIGITAL_ASSETS, JSON.stringify([...assets, newA]));
    return newA;
  },
  async deleteDigitalAsset(id: string): Promise<void> {
    const assets = await storage.getDigitalAssets();
    await AsyncStorage.setItem(KEYS.DIGITAL_ASSETS, JSON.stringify(assets.filter(a => a.id !== id)));
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    const raw = await AsyncStorage.getItem(KEYS.CHAT_HISTORY);
    return raw ? JSON.parse(raw) : [];
  },
  async addChatMessage(msg: Omit<ChatMessage, "id" | "timestamp">): Promise<ChatMessage> {
    const history = await storage.getChatHistory();
    const newMsg: ChatMessage = { ...msg, id: genId(), timestamp: new Date().toISOString() };
    const updated = [...history, newMsg];
    if (updated.length > 100) updated.splice(0, updated.length - 100);
    await AsyncStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(updated));
    return newMsg;
  },
  async clearChatHistory(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.CHAT_HISTORY);
  },

  async getLastCheckin(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.LAST_CHECKIN);
  },
  async recordCheckin(): Promise<void> {
    await AsyncStorage.setItem(KEYS.LAST_CHECKIN, new Date().toISOString());
  },

  async getGeminiKey(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.GEMINI_KEY);
  },
  async saveGeminiKey(key: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.GEMINI_KEY, key);
  },
};
