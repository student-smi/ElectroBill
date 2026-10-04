"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Boxes,
  Users,
  Truck,
  ShieldCheck,
  BarChart3,
  Bot,
  Settings,
  Zap,
  Lock,
  LogOut,
} from "lucide-react";

export function AppSidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useApp();

  const isOwner = user.role === "SHOP_OWNER";
  const isManager = user.role === "MANAGER" || isOwner;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permitted: true },
    { name: "Fast POS Bill", href: "/pos", icon: ShoppingCart, permitted: true, badge: "F2" },
    { name: "Invoices & Estimates", href: "/invoices", icon: FileText, permitted: true },
    { name: "Products & Wire", href: "/products", icon: Boxes, permitted: true },
    { name: "Customers & Udhaar", href: "/customers", icon: Users, permitted: true },
    { name: "Purchases & Inward", href: "/purchases", icon: Truck, permitted: isManager },
    { name: "Warranty Tracker", href: "/warranties", icon: ShieldCheck, permitted: true },
    { name: "Reports & GST", href: "/reports", icon: BarChart3, permitted: isManager },
    { name: "AI Shop Assistant", href: "/ai-assistant", icon: Bot, permitted: true, badge: "AI" },
    { name: "Shop Settings", href: "/settings", icon: Settings, permitted: isOwner },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-black text-slate-900 dark:text-white flex flex-col border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Electro<span className="text-black dark:text-white underline decoration-2">Bill</span>
              </span>
              <span className="text-[9px] uppercase font-mono font-bold bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Electrical Shop SaaS</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Menu
          </div>

          {navigation.map((item) => {
            const isActive = pathname === item.href;
            if (!item.permitted) {
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 dark:text-slate-600 rounded-lg cursor-not-allowed select-none"
                  title="Restricted for Cashier role"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 opacity-40" />
                    <span>{item.name}</span>
                  </div>
                  <Lock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-black dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-white/20 text-white dark:bg-black/20 dark:text-black font-bold"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Role Card & Logout */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white truncate text-xs">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-mono uppercase truncate">
                  {user.role.replace("_", " ")}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out of ElectroBill"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
