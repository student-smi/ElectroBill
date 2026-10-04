"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Shop,
  User,
  Role,
  Product,
  Category,
  Customer,
  Supplier,
  Invoice,
  NotificationItem,
  CustomerTransaction,
} from "@/types";
import {
  initialShop,
  initialCategories,
  initialProducts,
  initialCustomers,
  initialSuppliers,
  initialInvoices,
  initialNotifications,
} from "@/lib/store";
import {
  DEMO_USERS,
  getStoredUsers,
  saveUserToStorage,
  getStoredSession,
  saveSession,
  clearSession,
} from "@/lib/auth";

interface AppContextType {
  shop: Shop;
  setShop: React.Dispatch<React.SetStateAction<Shop>>;
  user: User;
  setUserRole: (role: Role) => void;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (email: string, password?: string, role?: Role) => { success: boolean; message?: string };
  signup: (data: {
    shopName: string;
    ownerName: string;
    email: string;
    phone: string;
    password?: string;
    city: string;
    gstin?: string;
  }) => { success: boolean; message?: string };
  logout: () => void;
  resetPassword: (email: string, newPassword?: string) => { success: boolean; message?: string };
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  invoices: Invoice[];
  notifications: NotificationItem[];
  addInvoice: (invoice: Invoice) => void;
  addPayment: (customerId: string, amount: number, paymentMethod: string, notes?: string) => void;
  markNotificationAsRead: (id: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  updateStock: (productId: string, delta: number) => void;
  salesReturn: (invoiceId: string, productId: string, quantity: number, refundAmount: number) => void;
  payCommission: (customerId: string, amount: number) => void;
  convertEstimateToInvoice: (invoiceId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [shop, setShop] = useState<Shop>(initialShop);
  const [user, setUser] = useState<User>(DEMO_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  // Load existing session on initial mount
  useEffect(() => {
    const session = getStoredSession();
    if (session && session.user) {
      setUser(session.user);
      if (session.shop) setShop(session.shop);
      setIsAuthenticated(true);
    } else {
      // Check if user explicitly logged out
      const hasLoggedOut = typeof window !== "undefined" && localStorage.getItem("electrobill_logged_out") === "true";
      if (hasLoggedOut) {
        setIsAuthenticated(false);
      } else {
        // Default to demo authenticated for convenient initial testing
        setIsAuthenticated(true);
        saveSession(DEMO_USERS[0], initialShop);
      }
    }
    setIsAuthReady(true);
  }, []);

  const login = (email: string, password?: string, preferredRole?: Role): { success: boolean; message?: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    const allUsers = getStoredUsers();
    
    // Look up by email or phone
    const matched = allUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail || (u.phone && u.phone === normalizedEmail)
    );

    let activeUser: User;
    if (matched) {
      activeUser = {
        id: matched.id,
        shopId: matched.shopId,
        name: matched.name,
        email: matched.email,
        role: preferredRole || matched.role,
        phone: matched.phone,
      };
    } else {
      // Allow demo login with any role or create demo identity
      activeUser = {
        id: `usr-${Date.now()}`,
        shopId: shop.id,
        name: email.split("@")[0].replace(/[._]/g, " ") || "Shop Member",
        email: email,
        role: preferredRole || "SHOP_OWNER",
      };
    }

    setUser(activeUser);
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("electrobill_logged_out");
    }
    saveSession(activeUser, shop);
    return { success: true, message: `Welcome back, ${activeUser.name}!` };
  };

  const signup = (data: {
    shopName: string;
    ownerName: string;
    email: string;
    phone: string;
    password?: string;
    city: string;
    gstin?: string;
  }): { success: boolean; message?: string } => {
    const newShopId = `shop-${Date.now()}`;
    const newUserId = `usr-${Date.now()}`;

    const newShop: Shop = {
      ...initialShop,
      id: newShopId,
      name: data.shopName,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      gstin: data.gstin || "",
    };

    const newUser: User = {
      id: newUserId,
      shopId: newShopId,
      name: data.ownerName,
      email: data.email,
      role: "SHOP_OWNER",
      phone: data.phone,
    };

    saveUserToStorage({ ...newUser, passwordHash: data.password || "default123" });
    setShop(newShop);
    setUser(newUser);
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("electrobill_logged_out");
    }
    saveSession(newUser, newShop);
    return { success: true, message: `Account created successfully for ${data.shopName}!` };
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearSession();
    if (typeof window !== "undefined") {
      localStorage.setItem("electrobill_logged_out", "true");
    }
  };

  const resetPassword = (email: string, newPassword?: string): { success: boolean; message?: string } => {
    const allUsers = getStoredUsers();
    const userFound = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userFound) {
      saveUserToStorage({
        ...userFound,
        passwordHash: newPassword || "Electro@2026",
      });
      return { success: true, message: "Password updated successfully! Please log in." };
    }
    return { success: true, message: "Password reset link sent to your registered email/phone!" };
  };

  const setUserRole = (role: Role) => {
    setUser((prev) => {
      const updated = { ...prev, role };
      saveSession(updated, shop);
      return updated;
    });
  };

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync dark mode class on <html>
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  // Stock deduction / adjustment helper
  const updateStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = Math.max(0, p.currentStock + delta);
          // Check stock alert
          if (updated <= p.minStockAlert && updated > 0) {
            setNotifications((n) => [
              {
                id: `notif-${Date.now()}`,
                type: "LOW_STOCK",
                title: `Low Stock: ${p.name}`,
                message: `Only ${updated} ${p.unit.toLowerCase()} remaining!`,
                isRead: false,
                timestamp: "Just now",
                linkUrl: "/products",
              },
              ...n,
            ]);
          } else if (updated === 0) {
            setNotifications((n) => [
              {
                id: `notif-${Date.now()}`,
                type: "OUT_OF_STOCK",
                title: `Out of Stock: ${p.name}`,
                message: `Current stock reached 0 ${p.unit.toLowerCase()}! Reorder now.`,
                isRead: false,
                timestamp: "Just now",
                linkUrl: "/products",
              },
              ...n,
            ]);
          }
          return { ...p, currentStock: updated };
        }
        return p;
      })
    );
  };

  // Add new Invoice
  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [invoice, ...prev]);

    // Update next invoice number
    setShop((prev) => ({
      ...prev,
      nextInvoiceNumber: prev.nextInvoiceNumber + 1,
    }));

    // Deduct stock for all items
    invoice.items.forEach((item) => {
      updateStock(item.productId, -item.quantity);
    });

    // If Udhaar, add to Customer Udhaar balance & calculate electrician commission
    if (invoice.customerId) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === invoice.customerId) {
            const isElectrician = c.customerType === "ELECTRICIAN";
            const comm = isElectrician ? Math.round(invoice.grandTotal * 0.05) : 0;
            return {
              ...c,
              currentUdhaar: invoice.dueAmount > 0 ? c.currentUdhaar + invoice.dueAmount : c.currentUdhaar,
              commissionBalance: (c.commissionBalance || 0) + comm,
              totalPurchases: c.totalPurchases + invoice.grandTotal,
            };
          }
          return c;
        })
      );
    }
  };

  // Pay out commission to electrician (Secret Passbook)
  const payCommission = (customerId: string, amount: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            commissionBalance: Math.max(0, (c.commissionBalance || 0) - amount),
          };
        }
        return c;
      })
    );
  };

  // 1-Click Convert Kacchi Parchi (Estimate) to Pakka GST Tax Invoice
  const convertEstimateToInvoice = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            isEstimate: false,
            invoiceNumber: inv.invoiceNumber.replace("EST-", shop.invoicePrefix),
          };
        }
        return inv;
      })
    );
  };

  // Customer Udhaar Payment Received
  const addPayment = (customerId: string, amount: number, paymentMethod: string, notes?: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newUdhaar = Math.max(0, c.currentUdhaar - amount);
          return {
            ...c,
            currentUdhaar: newUdhaar,
            totalPaid: c.totalPaid + amount,
          };
        }
        return c;
      })
    );
  };

  // Sales Return
  const salesReturn = (invoiceId: string, productId: string, quantity: number, refundAmount: number) => {
    // Restock product
    updateStock(productId, quantity);

    // Update invoice record
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            isReturned: true,
            grandTotal: Math.max(0, inv.grandTotal - refundAmount),
          };
        }
        return inv;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Global Keyboard shortcuts: Ctrl+K for search, Ctrl+B for new bill
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        window.location.href = "/pos";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        shop,
        setShop,
        user,
        setUserRole,
        isAuthenticated,
        isAuthReady,
        login,
        signup,
        logout,
        resetPassword,
        products,
        setProducts,
        categories,
        setCategories,
        customers,
        setCustomers,
        suppliers,
        setSuppliers,
        invoices,
        notifications,
        addInvoice,
        addPayment,
        markNotificationAsRead,
        isSearchOpen,
        setIsSearchOpen,
        isDarkMode,
        toggleDarkMode,
        updateStock,
        salesReturn,
        payCommission,
        convertEstimateToInvoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
