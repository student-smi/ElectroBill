import { User, Shop, Role } from "@/types";
import { initialShop } from "@/lib/store";

export interface StoredUser extends User {
  passwordHash?: string;
  phone?: string;
}

export const DEMO_USERS: StoredUser[] = [
  {
    id: "usr-smit",
    shopId: initialShop.id,
    name: "Smit Panchal",
    email: "smitpanchal734@gmail.com",
    role: "SHOP_OWNER",
    phone: "9876543210",
  },
  {
    id: "usr-owner-alt",
    shopId: initialShop.id,
    name: "Smit Panchal (Owner)",
    email: "owner@electrobill.com",
    role: "SHOP_OWNER",
    phone: "9876543210",
  },
  {
    id: "usr-manager",
    shopId: initialShop.id,
    name: "Ramesh Patel",
    email: "manager@electrobill.com",
    role: "MANAGER",
    phone: "9876500001",
  },
  {
    id: "usr-cashier",
    shopId: initialShop.id,
    name: "Amit Sharma",
    email: "cashier@electrobill.com",
    role: "CASHIER",
    phone: "9876500002",
  },
];

const STORAGE_KEY_AUTH = "electrobill_auth_session";
const STORAGE_KEY_USERS = "electrobill_registered_users";

export function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return DEMO_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) return DEMO_USERS;
    const custom = JSON.parse(raw);
    return [...DEMO_USERS, ...custom];
  } catch {
    return DEMO_USERS;
  }
}

export function saveUserToStorage(user: StoredUser) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    const existing: StoredUser[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([...filtered, user]));
  } catch (err) {
    console.error("Failed to save user", err);
  }
}

export function getStoredSession(): { user: User; shop: Shop } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(user: User, shop: Shop) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify({ user, shop, timestamp: Date.now() }));
  } catch (err) {
    console.error("Failed to save session", err);
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  } catch (err) {
    console.error("Failed to clear session", err);
  }
}
