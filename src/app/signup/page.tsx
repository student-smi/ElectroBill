"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Zap,
  Store,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  FileText,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Scissors,
  Layers,
  Share2,
  AlertCircle,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useApp();

  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    email: "",
    password: "",
    city: "Ahmedabad, Gujarat",
    gstin: "",
    hasGst: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.shopName.trim()) {
      setError("Please enter your electrical shop name");
      return;
    }
    if (!formData.ownerName.trim()) {
      setError("Please enter the shop owner's name");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = signup({
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        city: formData.city,
        gstin: formData.hasGst ? formData.gstin : "",
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        setError(res.message || "Failed to create account. Try again.");
        setIsLoading(false);
      }
    }, 500);
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
            Register
          </span>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 hidden sm:inline">Already registered?</span>
          <Link
            href="/login"
            className="font-bold text-black border border-slate-300 hover:border-black px-3 py-1.5 rounded-lg transition-all"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 flex flex-col lg:flex-row items-center gap-10">
        {/* Left Side: Value Proposition for Electrical Shop Owners */}
        <div className="w-full lg:w-5/12 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>100% Free 14-Day Pro Trial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Start Billing in <br />
            <span className="text-black underline decoration-4 decoration-amber-500 underline-offset-8">
              Under 2 Minutes.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Join 3,500+ Indian electrical and hardware dealers who save 2 hours every day on wire cuttings, modular switchboard calculations, and electrician commissions.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                <Scissors className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Loose Wire Meter Deductions</p>
                <p className="text-[11px] text-slate-500">Auto-deduct loose meters from 90m rolls with zero waste.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Modular Switchboard Calculator</p>
                <p className="text-[11px] text-slate-500">Auto-fit plate modules and calculate exact total pricing.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                <Share2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">WhatsApp PDF Invoices & UPI</p>
                <p className="text-[11px] text-slate-500">Instant bill delivery to customer and electrician on WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-7/12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-950">
              Register Electrical Store
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your shop details to create your secure admin account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Store created! Redirecting to your dashboard...</span>
              </div>
            )}

            {/* Shop Name & Owner Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Shop / Store Name *</label>
                <div className="relative">
                  <Store className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="e.g. Mahavir Electricals"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Owner Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. Smit Panchal"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Number & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">WhatsApp / Mobile *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. store@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Password & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Create Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">City & State</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Ahmedabad, Gujarat"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
              </div>
            </div>

            {/* GSTIN Toggle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="hasGst"
                    checked={formData.hasGst}
                    onChange={handleChange}
                    className="rounded border-slate-300 text-black focus:ring-black"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    My shop has GSTIN Registration
                  </span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Optional</span>
              </div>

              {formData.hasGst && (
                <div className="relative pt-1">
                  <FileText className="w-4 h-4 absolute left-3 top-4 text-slate-400" />
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="e.g. 24AAAAA0000A1Z5"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs uppercase font-mono font-bold"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Setting up shop..." : "Create My Store & Launch Dashboard"}</span>
              {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-extrabold text-black underline">
              Sign In here
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-3 text-center text-[11px] text-slate-400">
        © 2026 ElectroBill SaaS. Built for Indian Electrical Hardware Stores.
      </footer>
    </div>
  );
}
