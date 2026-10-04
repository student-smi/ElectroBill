"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, Search, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function WarrantiesPage() {
  const { invoices } = useApp();
  const [search, setSearch] = useState("");

  // Flatten all items across invoices that have warranty
  const warrantyRecords = invoices.flatMap((inv) =>
    inv.items
      .filter((it) => it.warrantyMonths && it.warrantyMonths > 0)
      .map((it) => {
        const purchaseDate = new Date(inv.invoiceDate);
        const expiryDate = new Date(purchaseDate);
        expiryDate.setMonth(expiryDate.getMonth() + (it.warrantyMonths || 12));
        const isExpired = new Date() > expiryDate;

        return {
          id: `${inv.id}-${it.id}`,
          invoiceNumber: inv.invoiceNumber,
          customerName: inv.customerName,
          customerPhone: inv.customerPhone,
          productName: it.productName,
          warrantyMonths: it.warrantyMonths,
          purchaseDate: inv.invoiceDate,
          expiryDate: expiryDate.toISOString(),
          isExpired,
        };
      })
  );

  const filtered = warrantyRecords.filter(
    (w) =>
      w.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      w.customerName.toLowerCase().includes(search.toLowerCase()) ||
      w.customerPhone.includes(search) ||
      w.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1700px] mx-auto w-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-black dark:text-white" />
            <span>Product Warranty Verification</span>
          </h2>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            {warrantyRecords.length} Active Records
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Verify manufacturer warranty claims for LED drivers, bulbs, ceiling fans, and MCBs against original invoice date.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer phone, invoice #, or product name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-black dark:focus:border-white text-slate-900 dark:text-white font-medium"
          />
        </div>
      </div>

      {/* Warranties Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-3">Bill #</th>
                <th className="py-3 px-3">Customer & Phone</th>
                <th className="py-3 px-3">Purchase Date</th>
                <th className="py-3 px-3">Warranty Expiry</th>
                <th className="py-3 px-3 text-center">Duration</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {w.productName}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {w.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    <p className="font-semibold">{w.customerName}</p>
                    <p className="text-[10px] text-slate-400">{w.customerPhone}</p>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {formatDate(w.purchaseDate)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {formatDate(w.expiryDate)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {w.warrantyMonths} Months
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        w.isExpired
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {w.isExpired ? (
                        <>
                          <AlertCircle className="w-3 h-3" /> Expired
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Active Warranty
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
