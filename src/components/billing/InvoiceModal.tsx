"use client";

import React, { useState } from "react";
import { Invoice, Shop } from "@/types";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  X,
  Printer,
  Share2,
  Download,
  Receipt,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  MapPin,
} from "lucide-react";

interface InvoiceModalProps {
  invoice: Invoice;
  shop: Shop;
  onClose: () => void;
}

export function InvoiceModal({ invoice, shop, onClose }: InvoiceModalProps) {
  const [printFormat, setPrintFormat] = useState<"A4" | "THERMAL">("A4");

  const handlePrint = () => {
    window.print();
  };

  // WhatsApp Share Message Generator
  const shareOnWhatsApp = () => {
    const phone = invoice.customerPhone.replace(/[^0-9]/g, "");
    const formattedPhone = phone.length === 10 ? `91${phone}` : phone;

    const itemsSummary = invoice.items
      .map(
        (it) =>
          `• ${it.productName} (${it.quantity} ${it.unit.toLowerCase()}) = ₹${it.total}`
      )
      .join("\n");

    const message = `⚡ *${shop.name}*
📍 ${shop.city} | Ph: ${shop.phone}

*${invoice.isEstimate ? "ESTIMATE / QUOTATION SLIP" : "TAX INVOICE"}*: ${invoice.invoiceNumber}
*Date*: ${formatDate(invoice.invoiceDate)}
*Customer*: ${invoice.customerName}
${invoice.siteName ? `*Site / Project*: 📍 ${invoice.siteName}\n` : ""}----------------------------------
*ITEMS*:
${itemsSummary}
----------------------------------
*Total Amount*: ₹${invoice.grandTotal.toLocaleString("en-IN")}
*Payment*: ${invoice.paymentMethod} (${invoice.paymentStatus})
${invoice.dueAmount > 0 ? `*Pending Udhaar*: ₹${invoice.dueAmount.toLocaleString("en-IN")}` : ""}

Thank you for your business! Electrical materials once sold are tested.`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${formattedPhone}?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-100">
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Top Action Bar (No-print) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black no-print">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {invoice.isEstimate ? "Estimate Slip" : "Tax Invoice"} #{invoice.invoiceNumber}
            </span>
            <span className="text-[11px] bg-black text-white dark:bg-white dark:text-black font-semibold px-2 py-0.5 rounded">
              {invoice.paymentStatus}
            </span>
            {invoice.siteName && (
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                📍 {invoice.siteName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle: A4 vs Thermal */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setPrintFormat("A4")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  printFormat === "A4"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold"
                    : "text-slate-500 hover:text-black dark:hover:text-white"
                }`}
              >
                A4 Sheet
              </button>
              <button
                onClick={() => setPrintFormat("THERMAL")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  printFormat === "THERMAL"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold"
                    : "text-slate-500 hover:text-black dark:hover:text-white"
                }`}
              >
                3&quot; Thermal
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950 flex justify-center">
          {printFormat === "A4" ? (
            /* ================= A4 INVOICE / ESTIMATE ================= */
            <div
              id="printable-invoice"
              className="w-full max-w-[800px] bg-white text-slate-900 p-8 rounded-xl shadow-md border border-slate-200 text-xs flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-950">
                      {shop.name}
                    </h2>
                    <p className="text-slate-600 font-medium">{shop.address}</p>
                    <p className="text-slate-600">
                      {shop.city}, {shop.state} - {shop.pincode}
                    </p>
                    <p className="text-slate-600 font-mono">
                      Phone: <span className="font-semibold">{shop.phone}</span> | Email: {shop.email}
                    </p>
                    {!invoice.isEstimate && (
                      <p className="mt-1 font-bold font-mono text-slate-900">
                        GSTIN: {shop.gstin || "27AABCS1429B1Z8"}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-black text-white font-extrabold rounded-md text-xs uppercase tracking-wider mb-2">
                      {invoice.isEstimate ? "ESTIMATE / QUOTATION" : "TAX INVOICE"}
                    </span>
                    <p className="font-mono text-sm font-bold text-slate-900">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-slate-600">Date: {formatDate(invoice.invoiceDate)}</p>
                    <p className="text-slate-600">Time: {formatDateTime(invoice.invoiceDate)}</p>
                  </div>
                </div>

                {/* Billed To & Site Information */}
                <div className="my-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Customer / Electrician:
                    </span>
                    <p className="font-bold text-sm text-slate-900">{invoice.customerName}</p>
                    <p className="text-slate-600">Ph: {invoice.customerPhone}</p>
                    {invoice.siteName && (
                      <p className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1">
                        📍 Site: {invoice.siteName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Category:
                    </span>
                    <p className="font-semibold text-slate-800 uppercase">{invoice.customerType}</p>
                    {!invoice.isEstimate && invoice.customerGstin && (
                      <p className="font-mono text-slate-700">GST: {invoice.customerGstin}</p>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse my-3">
                  <thead>
                    <tr className="border-y-2 border-slate-900 bg-slate-100 text-[11px] font-bold text-slate-800 text-left">
                      <th className="py-2 px-1 text-center w-8">#</th>
                      <th className="py-2 px-2">Description of Electrical Goods</th>
                      {!invoice.isEstimate && <th className="py-2 px-2 text-center">HSN</th>}
                      <th className="py-2 px-2 text-center">Qty / Unit</th>
                      <th className="py-2 px-2 text-right">Rate</th>
                      {!invoice.isEstimate && <th className="py-2 px-2 text-right">GST%</th>}
                      <th className="py-2 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {invoice.items.map((item, idx) => (
                      <tr key={item.id} className="text-slate-800 text-[11px]">
                        <td className="py-2 px-1 text-center font-mono">{idx + 1}</td>
                        <td className="py-2 px-2 font-medium">
                          {item.productName}
                          {item.warrantyMonths ? (
                            <span className="ml-2 text-[10px] text-slate-500 font-semibold">
                              ({item.warrantyMonths}m Warranty)
                            </span>
                          ) : null}
                        </td>
                        {!invoice.isEstimate && (
                          <td className="py-2 px-2 text-center font-mono text-slate-600">
                            {item.hsnCode}
                          </td>
                        )}
                        <td className="py-2 px-2 text-center font-bold">
                          {item.quantity} {item.unit.toLowerCase()}
                        </td>
                        <td className="py-2 px-2 text-right font-mono">₹{item.rate}</td>
                        {!invoice.isEstimate && (
                          <td className="py-2 px-2 text-right font-mono text-slate-600">
                            {item.gstRate}%
                          </td>
                        )}
                        <td className="py-2 px-2 text-right font-bold font-mono">
                          ₹{item.total.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Calculations */}
              <div>
                <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-start">
                  <div className="max-w-[50%]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Payment Mode:
                    </span>
                    <p className="font-bold text-slate-800">
                      {invoice.paymentMethod} - {invoice.paymentStatus}
                    </p>
                    {invoice.notes && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        Note: {invoice.notes}
                      </p>
                    )}
                  </div>

                  <div className="w-64 space-y-1.5 text-right font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>₹{invoice.subtotal.toFixed(2)}</span>
                    </div>
                    {invoice.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount:</span>
                        <span>- ₹{invoice.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {!invoice.isEstimate && (
                      <>
                        <div className="flex justify-between text-slate-600">
                          <span>CGST (9%):</span>
                          <span>₹{invoice.cgstAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>SGST (9%):</span>
                          <span>₹{invoice.sgstAmount.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-base font-extrabold text-slate-950 border-t-2 border-slate-900 pt-1.5">
                      <span>Total Amount:</span>
                      <span>₹{invoice.grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                    {invoice.dueAmount > 0 && (
                      <div className="flex justify-between text-xs font-bold text-red-600 border-t border-red-200 pt-1">
                        <span>Udhaar Added:</span>
                        <span>₹{invoice.dueAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Terms & Sign */}
                <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-[10px] text-slate-500">
                  <div className="max-w-[65%] whitespace-pre-line leading-relaxed">
                    <span className="font-bold text-slate-700">Terms & Conditions:</span>
                    <br />
                    {shop.termsAndConditions}
                  </div>
                  <div className="text-center">
                    <div className="h-12 border-b border-slate-400 w-36 mb-1" />
                    <p className="font-bold text-slate-800">Authorized Signatory</p>
                    <p className="text-[9px]">For {shop.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= 3-INCH THERMAL RECEIPT ================= */
            <div
              id="printable-invoice"
              className="w-full max-w-[320px] bg-white text-slate-950 p-4 font-mono text-[11px] rounded-lg shadow-md border border-slate-300"
            >
              <div className="text-center pb-2 border-b border-dashed border-slate-400">
                <h3 className="font-extrabold text-sm uppercase">{shop.name}</h3>
                <p className="text-[10px]">{shop.address}</p>
                <p className="text-[10px]">Ph: {shop.phone}</p>
                {!invoice.isEstimate && (
                  <p className="text-[10px] font-bold">GST: {shop.gstin || "27AABCS1429B1Z8"}</p>
                )}
                <p className="text-[10px] font-bold uppercase mt-1">
                  *** {invoice.isEstimate ? "ESTIMATE SLIP" : "TAX INVOICE"} ***
                </p>
              </div>

              <div className="py-2 border-b border-dashed border-slate-400 text-[10px]">
                <div className="flex justify-between">
                  <span>Bill: {invoice.invoiceNumber}</span>
                  <span>{formatDate(invoice.invoiceDate)}</span>
                </div>
                <p className="font-bold">Cust: {invoice.customerName}</p>
                {invoice.siteName && <p className="font-bold">Site: {invoice.siteName}</p>}
                <p>Mob: {invoice.customerPhone}</p>
              </div>

              {/* Items */}
              <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
                {invoice.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-start">
                    <div className="pr-2">
                      <p className="font-bold leading-tight">{it.productName}</p>
                      <span className="text-[10px] text-slate-600">
                        {it.quantity} {it.unit.toLowerCase()} × ₹{it.rate}
                      </span>
                    </div>
                    <span className="font-bold font-mono">₹{it.total}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{invoice.subtotal}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{invoice.discountAmount}</span>
                  </div>
                )}
                {!invoice.isEstimate && (
                  <div className="flex justify-between">
                    <span>GST Total:</span>
                    <span>₹{invoice.totalTax.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm border-t border-slate-900 pt-1">
                  <span>TOTAL:</span>
                  <span>₹{invoice.grandTotal}</span>
                </div>
              </div>

              <div className="text-center pt-3 text-[9px] text-slate-500">
                <p>Goods once sold are tested.</p>
                <p className="font-bold text-slate-800 mt-1">Thank you! Visit again.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
