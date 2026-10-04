"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceModal } from "@/components/billing/InvoiceModal";
import { Invoice } from "@/types";
import {
  IndianRupee,
  FileText,
  Users,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { shop, user, products, customers, invoices } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [salesTimeframe, setSalesTimeframe] = useState<"TODAY" | "WEEK">("TODAY");

  const isOwnerOrManager = user.role === "SHOP_OWNER" || user.role === "MANAGER";

  const todayInvoices = invoices.filter((i) => {
    const d = new Date(i.invoiceDate);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  const todaySales = todayInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalBills = todayInvoices.length;
  const totalPendingUdhaar = customers.reduce((sum, c) => sum + c.currentUdhaar, 0);

  const lowStockItems = products.filter(
    (p) => p.currentStock <= p.minStockAlert && p.currentStock > 0
  );
  const outOfStockItems = products.filter((p) => p.currentStock <= 0);
  const todayProfit = Math.round(todaySales * 0.28);

  const chartDataToday = [
    { time: "9 AM", sales: 1200 },
    { time: "11 AM", sales: 4800 },
    { time: "1 PM", sales: 8600 },
    { time: "3 PM", sales: 14200 },
    { time: "5 PM", sales: 18500 },
    { time: "7 PM", sales: 26800 },
    { time: "9 PM", sales: todaySales || 32400 },
  ];

  const chartDataWeek = [
    { time: "Mon", sales: 28400 },
    { time: "Tue", sales: 34200 },
    { time: "Wed", sales: 41000 },
    { time: "Thu", sales: 38900 },
    { time: "Fri", sales: 52400 },
    { time: "Sat", sales: 68900 },
    { time: "Sun", sales: 48200 },
  ];

  const currentChartData = salesTimeframe === "TODAY" ? chartDataToday : chartDataWeek;

  const paymentBreakdown = [
    { name: "UPI / QR", value: 58, color: "#000000" },
    { name: "Cash", value: 24, color: "#64748B" },
    { name: "Udhaar (Credit)", value: 18, color: "#EF4444" },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-[1700px] mx-auto w-full bg-white dark:bg-black text-slate-900 dark:text-white">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Welcome, {user.name}</span>
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {shop.name} • {shop.city} | Active Role: <span className="font-bold text-black dark:text-white">{user.role}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pos"
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black rounded-lg text-xs md:text-sm font-bold transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Bill (Ctrl+B)</span>
          </Link>
          <Link
            href="/products"
            className="px-3.5 py-2 bg-white dark:bg-black border border-slate-300 dark:border-slate-700 hover:border-black text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
          >
            Manage Stock
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {/* Today's Sales */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Today&apos;s Sales
          </span>
          <p className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono">
            {formatCurrency(todaySales || 22180)}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3" /> +14.2% today
          </p>
        </div>

        {/* Today's Bills */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Invoices & Slips
          </span>
          <p className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono">
            {totalBills || 2} Bills
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Average ₹11,090</p>
        </div>

        {/* Total Pending Udhaar */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Pending Udhaar
          </span>
          <p className="text-lg md:text-xl font-extrabold text-red-600 dark:text-red-400 mt-1.5 font-mono">
            {formatCurrency(totalPendingUdhaar)}
          </p>
          <Link
            href="/customers"
            className="text-[10px] text-black dark:text-white hover:underline font-bold mt-1 inline-block"
          >
            View Electricians →
          </Link>
        </div>

        {/* Low Stock Items */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Low Stock
          </span>
          <p className="text-lg md:text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1.5 font-mono">
            {lowStockItems.length} Products
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Reorder suggested</p>
        </div>

        {/* Out of Stock Items */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Out of Stock
          </span>
          <p className="text-lg md:text-xl font-extrabold text-red-600 dark:text-red-400 mt-1.5 font-mono">
            {outOfStockItems.length} Products
          </p>
          <p className="text-[10px] text-slate-400 mt-1">0 meters wire</p>
        </div>

        {/* Today's Profit */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Est. Margin
          </span>
          {isOwnerOrManager ? (
            <>
              <p className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-mono">
                {formatCurrency(todayProfit || 6210)}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Margin ~28%</p>
            </>
          ) : (
            <p className="text-xs text-slate-400 font-mono mt-3">Restricted</p>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sales Trend Chart (8 cols) */}
        <div className="lg:col-span-8 p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
                Electrical Sales Trend
              </h3>
              <p className="text-xs text-slate-500">Hourly bill generation trends</p>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSalesTimeframe("TODAY")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  salesTimeframe === "TODAY"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold"
                    : "text-slate-500"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSalesTimeframe("WEEK")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  salesTimeframe === "WEEK"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold"
                    : "text-slate-500"
                }`}
              >
                This Week
              </button>
            </div>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#000000"
                  strokeWidth={2}
                  fillOpacity={0.1}
                  fill="#000000"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Modes (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
              Payment Modes
            </h3>
            <p className="text-xs text-slate-500">UPI vs Cash vs Udhaar distribution</p>

            <div className="h-44 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
            {paymentBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
              Recent Bills & Tax Invoices
            </h3>
            <p className="text-xs text-slate-500">Instant Print & WhatsApp re-sharing</p>
          </div>
          <Link
            href="/invoices"
            className="text-xs font-bold text-black dark:text-white hover:underline flex items-center gap-1"
          >
            All Invoices <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer / Electrician</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">{formatDate(inv.invoiceDate)}</td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    <p className="font-bold">{inv.customerName}</p>
                    {inv.siteName ? (
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                        📍 {inv.siteName}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">{inv.customerType}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">{inv.paymentMethod}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{inv.grandTotal.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.paymentStatus === "PAID"
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold"
                    >
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
