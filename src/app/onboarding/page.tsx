"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Zap, Check, ArrowRight, ArrowLeft, Building2, User, MapPin, Receipt, Boxes, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { shop, setShop } = useApp();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    shopName: shop.name || "",
    ownerName: shop.ownerName || "",
    phone: shop.phone || "",
    email: shop.email || "",
    address: shop.address || "",
    city: shop.city || "Mumbai",
    state: shop.state || "Maharashtra",
    pincode: shop.pincode || "400086",
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4 md:p-8">
      {/* Top Brand */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full pt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <span className="font-extrabold text-base tracking-tight">
            Electro<span className="text-amber-400">Bill</span> Setup Wizard
          </span>
        </div>
        <span className="text-xs font-mono text-amber-400 font-bold">Step {step} of 6</span>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-xl mx-auto w-full my-auto bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Step Progress Bar */}
        <div className="flex items-center gap-1.5 mb-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-amber-400" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Shop Name */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">What is your electrical shop name?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This name will appear on the top of all printed invoices and WhatsApp estimates.
              </p>
            </div>
            <input
              type="text"
              autoFocus
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              placeholder="e.g. Shree Ram Electric & Hardware"
              className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white outline-none focus:border-amber-400"
            />
          </div>
        )}

        {/* Step 2: Owner Info */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Proprietor & Contact details</h3>
              <p className="text-xs text-slate-400 mt-1">
                Used for account ownership and invoice contact number.
              </p>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Owner Name</label>
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  placeholder="e.g. Smit Panchal"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Mobile Number (WhatsApp Enabled)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Address */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Shop Address & City</h3>
              <p className="text-xs text-slate-400 mt-1">Where is your retail counter located?</p>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Shop Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Shop No 4, Mahavir Darshan, LBS Marg"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: GST */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">GSTIN & Tax Scheme</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your 15-digit GST number for automatic B2B tax calculation. (Leave blank if composition or non-GST)
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                placeholder="27AABCS1429B1Z8"
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-sm uppercase outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* Step 5: Invoice Configuration */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Invoice Number Series</h3>
              <p className="text-xs text-slate-400 mt-1">Set your preferred bill prefix.</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Bill Prefix</label>
              <input
                type="text"
                value={form.invoicePrefix}
                onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value.toUpperCase() })}
                placeholder="e.g. EB-, INV-, SRE-"
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono font-bold text-sm outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Preview: <span className="font-mono text-amber-400 font-bold">{form.invoicePrefix}1001</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Initial Catalog */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pre-load Electrical Catalog</h3>
              <p className="text-xs text-slate-400 mt-1">
                We will automatically load standard Anchor Roma switches, Havells wire meter items, Philips LEDs, and Legrand MCBs into your store inventory.
              </p>
            </div>
            <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-2xl flex items-center gap-3">
              <Check className="w-5 h-5 text-amber-400" />
              <div className="text-xs">
                <p className="font-bold text-white">Pre-populate 16+ Electrical Items</p>
                <p className="text-slate-400 text-[11px]">Ready for instant POS billing from day 1.</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-700">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs md:text-sm shadow-lg shadow-amber-400/20"
          >
            <span>{step === 6 ? "Open My Shop Dashboard" : "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 pb-2">
        ElectroBill © 2026 • Specially crafted for Indian Electrical Retailers
      </div>
    </div>
  );
}
