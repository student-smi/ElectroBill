"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Shop, SubscriptionPlan } from "@/types";
import { Settings, Save, ShieldCheck, Sparkles, Building, Printer, CreditCard, Lock } from "lucide-react";

export default function SettingsPage() {
  const { shop, setShop, user } = useApp();

  const [form, setForm] = useState<Shop>(shop);
  const [savedNotice, setSavedNotice] = useState(false);

  if (user.role !== "SHOP_OWNER") {
    return (
      <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
        <Lock className="w-12 h-12 text-slate-400 mb-3" />
        <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
          Shop Owner Only
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Store configuration, subscription plans, and invoice templates can only be managed by the Shop Owner.
        </p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShop(form);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-500" />
            <span>Store Profile & Invoicing Settings</span>
          </h2>
          <p className="text-xs text-slate-500">
            Customize your store header, GSTIN, invoice prefixes, and thermal printer defaults.
          </p>
        </div>

        {savedNotice && (
          <span className="text-xs bg-emerald-500/10 text-emerald-600 font-bold px-3 py-1 rounded-full animate-bounce">
            Settings Saved Successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Shop Info Card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-500" />
            <span>Shop Details & Header Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Shop Legal Name (Printed on Bills)
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Proprietor / Owner Name
              </label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Store Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Shop Address & Landmark
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                City & State
              </label>
              <input
                type="text"
                value={`${form.city}, ${form.state}`}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                GSTIN Number
              </label>
              <input
                type="text"
                value={form.gstin || ""}
                onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Invoice & Print Settings */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-500" />
            <span>Invoice Series & Default Terms</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Invoice Series Prefix
              </label>
              <input
                type="text"
                value={form.invoicePrefix}
                onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Next Invoice Number
              </label>
              <input
                type="number"
                value={form.nextInvoiceNumber}
                onChange={(e) => setForm({ ...form, nextInvoiceNumber: Number(e.target.value) })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Terms & Conditions Printed on Bill
              </label>
              <textarea
                rows={3}
                value={form.termsAndConditions}
                onChange={(e) => setForm({ ...form, termsAndConditions: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        {/* Subscription Plan Card */}
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Current Plan
            </span>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <span>ElectroBill PRO Tier</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Unlimited Invoices • Wire Meter Tracking • Electrician Udhaar Ledger • AI Assistant Active
            </p>
          </div>

          <span className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-lg text-xs">
            Active License
          </span>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md shadow-amber-500/20"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
