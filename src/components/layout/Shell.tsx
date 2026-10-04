"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/context/AppContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Standalone pages that don't need the dashboard sidebar/header
  const isStandalone = pathname === "/" || pathname === "/onboarding";

  return (
    <AppProvider>
      {isStandalone ? (
        <main className="min-h-screen">{children}</main>
      ) : (
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
      )}
    </AppProvider>
  );
}
