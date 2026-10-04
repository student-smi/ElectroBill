"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Role } from "@/types";
import {
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Loader2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect") || "/dashboard";

  const { login } = useApp();

  const [email, setEmail] = useState("smitpanchal734@gmail.com");
  const [password, setPassword] = useState("Owner@123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your registered email address or phone number");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      if (res.success) {
        setSuccessMsg(res.message || "Logged in successfully!");
        setTimeout(() => {
          router.push(redirectPath);
        }, 400);
      } else {
        setError(res.message || "Invalid email or password");
        setIsLoading(false);
      }
    }, 450);
  };

  const handleQuickLogin = (quickEmail: string, role: Role, quickPass: string = "Pass@123") => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      login(quickEmail, quickPass, role);
      setSuccessMsg(`Welcome, ${role.replace("_", " ")}!`);
      setTimeout(() => {
        router.push(redirectPath);
      }, 350);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shadow-xs">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight">
            Electro<span className="underline decoration-2">Bill</span>
          </span>
          <span className="text-[9px] uppercase font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300">
            Auth
          </span>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 hidden sm:inline">New to ElectroBill?</span>
          <Link
            href="/signup"
            className="font-bold text-black border border-slate-300 hover:border-black px-3 py-1.5 rounded-lg transition-all"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span>Secure Shop Sign In</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Sign in to manage your electrical shop invoices, loose wire stock, and electrician accounts.
            </p>
          </div>

          {/* Quick Demo Logins Pill Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                1-Click Quick Demo Sign In:
              </span>
              <span className="text-[10px] font-mono text-slate-400">INSTANT ACCESS</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("smitpanchal734@gmail.com", "SHOP_OWNER")}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-black text-center transition-all group shadow-2xs hover:shadow-xs active:scale-95"
              >
                <span className="text-sm">👑</span>
                <span className="text-[11px] font-extrabold text-slate-900 group-hover:text-black">
                  Owner
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Full Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("manager@electrobill.com", "MANAGER")}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-black text-center transition-all group shadow-2xs hover:shadow-xs active:scale-95"
              >
                <span className="text-sm">💼</span>
                <span className="text-[11px] font-extrabold text-slate-900 group-hover:text-black">
                  Manager
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Stock & Bill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("cashier@electrobill.com", "CASHIER")}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-black text-center transition-all group shadow-2xs hover:shadow-xs active:scale-95"
              >
                <span className="text-sm">🧾</span>
                <span className="text-[11px] font-extrabold text-slate-900 group-hover:text-black">
                  Cashier
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Fast POS</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Email or Mobile Number</span>
                <span className="text-[10px] text-slate-400 font-normal">e.g. smitpanchal734@gmail.com</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email or mobile"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-slate-500 hover:text-black underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-black focus:ring-black"
                />
                <span className="text-slate-600 font-medium">Keep me signed in</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">SSL 256-Bit</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Signing in..." : "Sign In to ElectroBill"}</span>
              {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* Bottom Card Footer */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Don&apos;t have a shop account yet?{" "}
              <Link href="/signup" className="font-extrabold text-black hover:underline">
                Register Free
              </Link>
            </p>
            <p className="text-[11px] text-slate-400">
              Need urgent support? WhatsApp:{" "}
              <span className="font-mono font-bold text-slate-700">+91 98765 43210</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-3 text-center text-[11px] text-slate-400">
        © 2026 ElectroBill SaaS. Built for Indian Electrical Hardware Stores.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
