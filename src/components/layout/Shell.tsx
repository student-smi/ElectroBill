"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppProvider, useApp } from "@/context/AppContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";
import { Lock, Loader2 } from "lucide-react";
import Link from "next/link";

const STANDALONE_ROUTES = ["/", "/onboarding", "/login", "/signup", "/forgot-password"];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAuthReady } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isStandalone = STANDALONE_ROUTES.includes(pathname);

  useEffect(() => {
    if (isAuthReady && !isAuthenticated && !isStandalone) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthReady, isAuthenticated, isStandalone, pathname, router]);

  // Standalone pages (Landing, Login, Signup, Forgot Password, Onboarding)
  if (isStandalone) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Waiting for session to hydrate from localStorage
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-black dark:text-white mb-3" />
        <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
          Authenticating ElectroBill Session...
        </p>
      </div>
    );
  }

  // Not authenticated and trying to access protected route
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-4 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Authentication Required
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          Please log in to your ElectroBill store account to access the POS, invoices, and shop data.
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className="px-6 py-2.5 bg-black hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md"
        >
          Go to Login Screen
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>

      {/* Global Search Modal (Ctrl + K) */}
      <GlobalSearchModal />
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ShellInner>{children}</ShellInner>
    </AppProvider>
  );
}

