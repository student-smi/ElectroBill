"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Search, X, Boxes, Users, FileText, ArrowRight } from "lucide-react";

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, products, customers, invoices } = useApp();
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.barcode && p.barcode.includes(q))
      )
    : [];

  const filteredCustomers = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.customerType.toLowerCase().includes(q)
      )
    : [];

  const filteredInvoices = q
    ? invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q) ||
          i.customerPhone.includes(q)
      )
    : [];

  const handleSelect = (url: string) => {
    setIsSearchOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search switches, wire meters, MCBs, customers, or bill number..."
            className="w-full bg-transparent text-sm md:text-base outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {!q ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p>Type to search across entire store inventory, electrician ledgers & invoices.</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">"roma"</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">"1.5 wire"</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">"patil"</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">"mcb"</span>
              </div>
            </div>
          ) : (
            <>
              {/* Products */}
              {filteredProducts.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-amber-500" /> Products & Wires ({filteredProducts.length})
                  </div>
                  <div className="space-y-1">
                    {filteredProducts.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect(`/pos`)}
                        className="p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            SKU: {p.sku} • Stock: {p.currentStock} {p.unit.toLowerCase()} • Retail: {formatCurrency(p.retailPrice)}
                          </p>
                        </div>
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Add to Bill <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {filteredCustomers.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" /> Customers & Electricians ({filteredCustomers.length})
                  </div>
                  <div className="space-y-1">
                    {filteredCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelect(`/customers`)}
                        className="p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{c.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {c.phone} • {c.customerType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600 dark:text-amber-400">
                            Udhaar: {formatCurrency(c.currentUdhaar)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {filteredInvoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" /> Invoices ({filteredInvoices.length})
                  </div>
                  <div className="space-y-1">
                    {filteredInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => handleSelect(`/invoices`)}
                        className="p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-bold font-mono text-slate-800 dark:text-slate-100">
                            {inv.invoiceNumber} - {inv.customerName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Total: {formatCurrency(inv.grandTotal)} • {inv.paymentMethod}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400">View</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 &&
                filteredCustomers.length === 0 &&
                filteredInvoices.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
