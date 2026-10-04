"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Invoice, InvoiceItem } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceModal } from "@/components/billing/InvoiceModal";
import {
  FileText,
  Search,
  Filter,
  Printer,
  Share2,
  RotateCcw,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  FileCheck,
  Receipt,
  Sparkles,
} from "lucide-react";

export default function InvoicesPage() {
  const { invoices, shop, salesReturn, convertEstimateToInvoice, user } = useApp();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Return Modal state
  const [returnInvoice, setReturnInvoice] = useState<Invoice | null>(null);
  const [returnItemId, setReturnItemId] = useState("");
  const [returnQty, setReturnQty] = useState(1);
  const [returnReason, setReturnReason] = useState("Customer returned unused items");

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerPhone.includes(search) ||
      (inv.siteName && inv.siteName.toLowerCase().includes(search.toLowerCase()));
    const matchStatus =
      filterStatus === "ALL" ||
      (filterStatus === "ESTIMATE" && inv.isEstimate) ||
      (filterStatus === "GST" && !inv.isEstimate) ||
      (filterStatus === "PAID" && inv.paymentStatus === "PAID") ||
      (filterStatus === "UNPAID" && inv.paymentStatus === "UNPAID") ||
      (filterStatus === "RETURNED" && inv.isReturned);
    return matchSearch && matchStatus;
  });

  const handleOpenReturn = (inv: Invoice) => {
    setReturnInvoice(inv);
    if (inv.items.length > 0) {
      setReturnItemId(inv.items[0].id);
      setReturnQty(1);
    }
  };

  const handleProcessReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnInvoice) return;

    const item = returnInvoice.items.find((i) => i.id === returnItemId);
    if (!item) return;

    const refundAmount = item.rate * returnQty;
    salesReturn(returnInvoice.id, item.productId, returnQty, refundAmount);

    alert(`Successfully returned ${returnQty} ${item.unit.toLowerCase()} of ${item.productName}. Stock has been restored!`);
    setReturnInvoice(null);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1700px] mx-auto w-full bg-white dark:bg-black text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight">
              Invoices & Estimate Slips
            </h2>
            <span className="text-xs bg-black text-white dark:bg-white dark:text-black font-mono font-bold px-2.5 py-0.5 rounded">
              {invoices.length} Bills
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            1-Click convert Kacchi Parchi to GST Tax Invoice, view site project materials, and process returns.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Bill #, Customer Name, Phone, or Site (e.g. Verma Ji)..."
            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none focus:border-black text-slate-900 dark:text-white font-medium"
          />
        </div>

        <div className="flex gap-1.5 text-xs font-semibold overflow-x-auto">
          {["ALL", "ESTIMATE", "GST", "PAID", "UNPAID", "RETURNED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                filterStatus === st
                  ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold"
                  : "bg-white dark:bg-black text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
              }`}
            >
              {st === "ESTIMATE" ? "Kacchi Parchi" : st === "GST" ? "GST Tax Bill" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Customer & Site</th>
                <th className="py-3 px-3 text-center">Type</th>
                <th className="py-3 px-3 text-center">Items</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-3 text-center">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">
                    {formatDate(inv.invoiceDate)}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    <p className="font-bold">{inv.customerName}</p>
                    {inv.siteName ? (
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold">
                        📍 Site: {inv.siteName}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400">{inv.customerPhone}</p>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        inv.isEstimate
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                          : "bg-black text-white dark:bg-white dark:text-black"
                      }`}
                    >
                      {inv.isEstimate ? "Estimate" : "GST Bill"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {inv.items.length} items
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                    ₹{inv.grandTotal.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.isReturned
                          ? "bg-orange-500/10 text-orange-600"
                          : inv.paymentStatus === "PAID"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {inv.isReturned ? "RETURNED" : inv.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                    >
                      View / Print
                    </button>
                    {/* Convert Estimate to GST Bill */}
                    {inv.isEstimate && (
                      <button
                        onClick={() => convertEstimateToInvoice(inv.id)}
                        className="px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black font-bold text-[10px]"
                        title="1-Click Convert to GST Tax Invoice"
                      >
                        Convert to GST
                      </button>
                    )}
                    {!inv.isReturned && user.role !== "CASHIER" && (
                      <button
                        onClick={() => handleOpenReturn(inv)}
                        className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-400 font-semibold text-[10px]"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Return Modal */}
      {returnInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>Sales Return: {returnInvoice.invoiceNumber}</span>
              </h3>
              <button
                onClick={() => setReturnInvoice(null)}
                className="p-1 text-slate-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessReturn} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Item to Return
                </label>
                <select
                  value={returnItemId}
                  onChange={(e) => setReturnItemId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-semibold text-slate-900 dark:text-white"
                >
                  {returnInvoice.items.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.productName} ({it.quantity} {it.unit.toLowerCase()} @ ₹{it.rate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Return Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={returnQty}
                  onChange={(e) => setReturnQty(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Return Reason
                </label>
                <input
                  type="text"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Extra wire returned, wrong switch model"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReturnInvoice(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold"
                >
                  Confirm Return & Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          shop={shop}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
