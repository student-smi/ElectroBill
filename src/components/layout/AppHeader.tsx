"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Role } from "@/types";
import {
  Search,
  PlusCircle,
  Bell,
  Sun,
  Moon,
  Zap,
  CheckCircle,
  Menu,
  UserCheck,
} from "lucide-react";

export function AppHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const {
    shop,
    user,
    setUserRole,
    logout,
    notifications,
    markNotificationAsRead,
    setIsSearchOpen,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile hamburger & Shop Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white leading-tight">
              {shop.name}
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block font-mono">
              {shop.city} • GST: {shop.gstin || "Composition"}
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Quick Search Trigger */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-3.5 py-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 hover:border-black rounded-lg border border-slate-200 dark:border-slate-800 transition-all w-72 justify-between"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search wire, switch, customer...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Fast POS Button */}
        <Link
          href="/pos"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs md:text-sm font-bold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-xs active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Bill</span>
          <kbd className="hidden lg:inline text-[10px] font-mono ml-1 opacity-70">
            Ctrl+B
          </kbd>
        </Link>

        {/* User Account & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-black text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-black dark:hover:border-white transition-all shadow-2xs"
          >
            <div className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-black">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[11px] font-bold leading-tight truncate max-w-[100px]">{user.name}</span>
              <span className="text-[9px] text-slate-400 font-mono uppercase">{user.role.replace("_", " ")}</span>
            </div>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-extrabold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate font-mono">{user.email}</p>
              </div>

              <div className="px-3.5 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Switch Active Role
              </div>
              {(["SHOP_OWNER", "MANAGER", "CASHIER"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-900 ${
                    user.role === r ? "font-bold text-black dark:text-white" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-xs">{r.replace("_", " ")}</span>
                  {user.role === r && <CheckCircle className="w-3.5 h-3.5 text-black dark:text-white" />}
                </button>
              ))}

              <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-1.5 px-1.5 space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setShowRoleMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <span>Shop Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                    window.location.href = "/login";
                  }}
                  className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-semibold"
                >
                  <span>Log Out of Store</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-black dark:bg-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">Store Alerts</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono font-bold">
                  {unreadCount} New
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 mt-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`py-2 px-2 rounded-lg cursor-pointer ${
                      n.isRead ? "opacity-50" : "bg-slate-50 dark:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900 dark:text-white">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
