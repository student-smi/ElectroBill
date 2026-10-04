"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Customer, CustomerType, PaymentMethod } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Plus,
  Search,
  IndianRupee,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  X,
  CreditCard,
  FileText,
  UserCheck,
  Share2,
  Gift,
  Coins,
} from "lucide-react";

export default function CustomersPage() {
  const { customers, setCustomers, addPayment, payCommission, shop } = useApp();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Payment Recording Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMethod>("UPI");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Commission Pay Modal
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [commPayAmount, setCommPayAmount] = useState<number>(0);

  // Add Customer Modal
  const [isAddCustOpen, setIsAddCustOpen] = useState(false);
  const [newCust, setNewCust] = useState<Partial<Customer>>({
    name: "",
    phone: "",
    email: "",
    address: "",
    customerType: "ELECTRICIAN",
    creditLimit: 50000,
    currentUdhaar: 0,
    commissionBalance: 0,
    notes: "",
  });

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchType = filterType === "ALL" || c.customerType === filterType;
    return matchSearch && matchType;
  });

  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentUdhaar, 0);
  const totalCommissionOwed = customers.reduce(
    (sum, c) => sum + (c.commissionBalance || 0),
    0
  );

  const handleOpenPayment = (c: Customer) => {
    setSelectedCustomer(c);
    setPaymentAmount(c.currentUdhaar);
    setIsPayModalOpen(true);
  };

  const handleOpenCommission = (c: Customer) => {
    setSelectedCustomer(c);
    setCommPayAmount(c.commissionBalance || 0);
    setIsCommModalOpen(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || paymentAmount <= 0) return;

    addPayment(selectedCustomer.id, paymentAmount, paymentMode, paymentNotes);
    alert(`Payment of ₹${paymentAmount} recorded successfully for ${selectedCustomer.name}!`);
    setIsPayModalOpen(false);
  };

  const handlePayCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || commPayAmount <= 0) return;

    payCommission(selectedCustomer.id, commPayAmount);
    alert(`Commission payout of ₹${commPayAmount} recorded for ${selectedCustomer.name}!`);
    setIsCommModalOpen(false);
  };

  // WhatsApp Udhaar Reminder with UPI payment link
  const sendWhatsAppReminder = (c: Customer) => {
    const phone = c.phone.replace(/[^0-9]/g, "");
    const formattedPhone = phone.length === 10 ? `91${phone}` : phone;

    const message = `⚡ *${shop.name}* - Udhaar Payment Reminder
Namaste ${c.name} ji,

Aapka Shree Ram Electric & Hardware me pending udhaar hisaab:
*Total Pending Balance*: ₹${c.currentUdhaar.toLocaleString("en-IN")}

Kripya niche diye UPI ID par payment send karein:
*UPI ID*: ${shop.phone.replace(/[^0-9]/g, "")}@upi

Payment karne ke baad screenshot isi number par share kar dein.
Dhanyawad!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${formattedPhone}?text=${encoded}`, "_blank");
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone) return;

    const created: Customer = {
      id: `cust-${Date.now()}`,
      shopId: shop.id,
      name: newCust.name!,
      phone: newCust.phone!,
      email: newCust.email,
      address: newCust.address,
      customerType: newCust.customerType as CustomerType,
      creditLimit: Number(newCust.creditLimit) || 50000,
      currentUdhaar: Number(newCust.currentUdhaar) || 0,
      commissionBalance: Number(newCust.commissionBalance) || 0,
      totalPurchases: Number(newCust.currentUdhaar) || 0,
      totalPaid: 0,
      notes: newCust.notes,
      createdAt: new Date().toISOString(),
    };

    setCustomers((prev) => [created, ...prev]);
    setIsAddCustOpen(false);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1700px] mx-auto w-full bg-white dark:bg-black text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight">
              Electricians & Udhaar Khata
            </h2>
            <span className="text-xs bg-black text-white dark:bg-white dark:text-black font-mono font-bold px-2.5 py-0.5 rounded">
              Pending Udhaar: {formatCurrency(totalOutstanding)}
            </span>
            <span className="text-xs bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
              Electrician Commissions: {formatCurrency(totalCommissionOwed)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Site-wise project tracking, WhatsApp payment reminders with UPI, and secret electrician commission passbook.
          </p>
        </div>

        <button
          onClick={() => setIsAddCustOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Electrician / Customer
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search electrician by name or phone..."
            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none focus:border-black text-slate-900 dark:text-white font-medium"
          />
        </div>

        <div className="flex gap-1.5 text-xs font-semibold overflow-x-auto">
          {["ALL", "ELECTRICIAN", "CONTRACTOR", "NORMAL"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                filterType === type
                  ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold"
                  : "bg-white dark:bg-black text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
              }`}
            >
              {type === "ALL" ? "All Profiles" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const creditUsage = Math.min(100, Math.round((c.currentUdhaar / c.creditLimit) * 100));

          return (
            <div
              key={c.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-black dark:hover:border-white transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {c.phone}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    {c.customerType}
                  </span>
                </div>

                {/* Udhaar & Credit Bar */}
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-slate-500 font-medium">Pending Udhaar:</span>
                    <span
                      className={`font-mono font-extrabold text-sm ${
                        c.currentUdhaar > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600"
                      }`}
                    >
                      {formatCurrency(c.currentUdhaar)}
                    </span>
                  </div>

                  {/* Credit Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        creditUsage > 80 ? "bg-red-500" : creditUsage > 50 ? "bg-amber-500" : "bg-black dark:bg-white"
                      }`}
                      style={{ width: `${creditUsage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>Limit: {formatCurrency(c.creditLimit)}</span>
                    <span>{creditUsage}% used</span>
                  </div>
                </div>

                {/* Secret Electrician Commission Passbook */}
                {c.customerType === "ELECTRICIAN" && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                        <Gift className="w-3 h-3" /> Commission Earned (Cut)
                      </span>
                      <p className="font-mono font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {formatCurrency(c.commissionBalance || 0)}
                      </p>
                    </div>

                    {(c.commissionBalance || 0) > 0 && (
                      <button
                        onClick={() => handleOpenCommission(c)}
                        className="px-2 py-1 bg-black text-white dark:bg-white dark:text-black font-bold text-[10px] rounded hover:opacity-90 transition-all"
                      >
                        Pay Cash (₹)
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                {c.currentUdhaar > 0 ? (
                  <>
                    <button
                      onClick={() => sendWhatsAppReminder(c)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      title="Send WhatsApp payment reminder with shop UPI ID"
                    >
                      <Share2 className="w-3 h-3" /> WhatsApp Reminder
                    </button>
                    <button
                      onClick={() => handleOpenPayment(c)}
                      className="px-3 py-1.5 bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black rounded-lg text-xs font-bold transition-all"
                    >
                      Receive Payment
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> All Udhaar Cleared
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Payment Modal */}
      {isPayModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Receive Udhaar Payment
              </h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 text-slate-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="font-bold text-slate-900 dark:text-white">
                  Customer: {selectedCustomer.name}
                </p>
                <p className="font-mono text-red-600 font-bold mt-1">
                  Pending Balance: {formatCurrency(selectedCustomer.currentUdhaar)}
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Amount Received (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedCustomer.currentUdhaar}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold font-mono outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMethod)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-semibold text-slate-900 dark:text-white"
                >
                  <option value="UPI">📱 UPI / QR Transfer</option>
                  <option value="CASH">💵 Cash in Hand</option>
                  <option value="CHEQUE">📑 Bank Cheque</option>
                  <option value="BANK_TRANSFER">🏦 NEFT / RTGS</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold"
                >
                  Record Payment & Clear Udhaar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Commission Modal */}
      {isCommModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-500" />
                <span>Pay Electrician Commission Cut</span>
              </h3>
              <button
                onClick={() => setIsCommModalOpen(false)}
                className="p-1 text-slate-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayCommission} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 rounded-xl">
                <p className="font-bold text-slate-900 dark:text-white">
                  Electrician: {selectedCustomer.name}
                </p>
                <p className="font-mono text-amber-800 dark:text-amber-400 font-bold mt-1">
                  Accumulated Commission Balance: {formatCurrency(selectedCustomer.commissionBalance || 0)}
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Commission Payout Amount (₹ Cash) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedCustomer.commissionBalance || 0}
                  value={commPayAmount}
                  onChange={(e) => setCommPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold font-mono outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCommModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold"
                >
                  Confirm Payout & Deduct Passbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add Electrician / Customer
              </h3>
              <button
                onClick={() => setIsAddCustOpen(false)}
                className="p-1 text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name / Enterprise *
                </label>
                <input
                  type="text"
                  required
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  placeholder="e.g. Ramesh Patil (Patil Electricals)"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    placeholder="e.g. 9820123456"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCust.customerType}
                    onChange={(e) =>
                      setNewCust({ ...newCust, customerType: e.target.value as CustomerType })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="ELECTRICIAN">Electrician (Special Price & Commission)</option>
                    <option value="CONTRACTOR">Contractor (Wholesale)</option>
                    <option value="NORMAL">Normal Retail</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    value={newCust.creditLimit}
                    onChange={(e) =>
                      setNewCust({ ...newCust, creditLimit: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Opening Udhaar (₹)
                  </label>
                  <input
                    type="number"
                    value={newCust.currentUdhaar}
                    onChange={(e) =>
                      setNewCust({ ...newCust, currentUdhaar: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
