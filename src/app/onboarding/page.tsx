"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Zap,
  Check,
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Receipt,
  Boxes,
} from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const { shop, setShop } = useApp();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    shopName: shop.name || "Shree Ram Electric & Hardware",
    ownerName: shop.ownerName || "Smit Panchal",
    phone: shop.phone || "9876543210",
    email: shop.email || "smitpanchal734@gmail.com",
    address: shop.address || "Shop No 4, Mahavir Darshan, LBS Marg",
    city: shop.city || "Ahmedabad",
    state: shop.state || "Gujarat",
    pincode: shop.pincode || "380001",
    gstin: shop.gstin || "",
    invoicePrefix: "SRE-",
    defaultCatalog: true,
  });

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Save and finish
      setShop((prev) => ({
        ...prev,
        name: form.shopName,
        ownerName: form.ownerName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        gstin: form.gstin,
        invoicePrefix: form.invoicePrefix,
      }));
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Top Brand Bar */}
      <header className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight">
              Electro<span className="underline decoration-2">Bill</span> Setup Wizard
            </span>
          </Link>
          <span className="text-xs font-mono bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-md border border-slate-300">
            Step {step} of 6
          </span>
        </div>
      </header>

      {/* Main Wizard Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl mx-auto w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Step Progress Bar */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-black" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Shop Name */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  What is your electrical shop name?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  This name will appear on the top of all printed invoices and WhatsApp estimates.
                </p>
              </div>
              <input
                type="text"
                autoFocus
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                placeholder="e.g. Shree Ram Electric & Hardware"
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>
          )}

          {/* Step 2: Owner Info */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Proprietor & Contact details
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Used for account ownership and invoice contact number.
                </p>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    placeholder="e.g. Smit Panchal"
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mobile Number (WhatsApp Enabled)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black font-mono font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Shop Address & City
                </h3>
                <p className="text-xs text-slate-500 mt-1">Where is your retail counter located?</p>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Shop Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. Shop No 4, Mahavir Darshan, LBS Marg"
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black font-mono font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: GST */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  GSTIN & Tax Scheme
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your 15-digit GST number for automatic B2B tax calculation. (Leave blank if composition or non-GST)
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                  placeholder="24AAAAA0000A1Z5"
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl font-mono text-sm uppercase outline-none focus:border-black focus:ring-1 focus:ring-black font-bold"
                />
              </div>
            </div>
          )}

          {/* Step 5: Invoice Configuration */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Invoice Number Series
                </h3>
                <p className="text-xs text-slate-500 mt-1">Set your preferred bill prefix.</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bill Prefix</label>
                <input
                  type="text"
                  value={form.invoicePrefix}
                  onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value.toUpperCase() })}
                  placeholder="e.g. EB-, INV-, SRE-"
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl font-mono font-bold text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Preview: <span className="font-mono text-black font-extrabold">{form.invoicePrefix}1001</span>
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Initial Catalog */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Pre-load Electrical Catalog
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We will automatically load standard Anchor Roma switches, Havells wire meter items, Philips LEDs, and Legrand MCBs into your store inventory.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-slate-900">Pre-populate 16+ Electrical Items</p>
                  <p className="text-slate-500 text-[11px]">Ready for instant POS billing from day 1.</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-black font-bold px-3.5 py-2 rounded-xl border border-slate-200 hover:border-black transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs md:text-sm shadow-md transition-all active:scale-95"
            >
              <span>{step === 6 ? "Open My Shop Dashboard" : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-3 text-center text-xs text-slate-400">
        ElectroBill © 2026 • Specially crafted for Indian Electrical Retailers
      </footer>
    </div>
  );
}
