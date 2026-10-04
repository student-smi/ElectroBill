"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Supplier, Product } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Truck,
  Plus,
  Search,
  IndianRupee,
  Boxes,
  CheckCircle,
  FileCheck,
  X,
  Phone,
} from "lucide-react";

export default function PurchasesPage() {
  const { suppliers, setSuppliers, products, updateStock, user } = useApp();

  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup-1");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "prod-1");
  const [purchaseQty, setPurchaseQty] = useState(50);
  const [purchaseCost, setPurchaseCost] = useState(products[0]?.purchasePrice || 22);

  // Supplier Add Modal
  const [isAddSupOpen, setIsAddSupOpen] = useState(false);
  const [newSup, setNewSup] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    gstin: "",
  });

  const totalSupplierDue = suppliers.reduce((sum, s) => sum + s.pendingAmount, 0);

  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId);
    const sup = suppliers.find((s) => s.id === selectedSupplierId);
    if (!prod || !sup) return;

    // Automatically increase inventory!
    updateStock(prod.id, purchaseQty);

    const totalBill = purchaseQty * purchaseCost;
    // Update supplier pending
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === sup.id
          ? {
              ...s,
              totalPurchases: s.totalPurchases + totalBill,
              pendingAmount: s.pendingAmount + totalBill,
            }
          : s
      )
    );

    alert(
      `Purchase recorded! ${purchaseQty} ${prod.unit.toLowerCase()} of ${prod.name} added to inventory. Total cost: ₹${totalBill}`
    );
    setIsNewPurchaseOpen(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSup.company || !newSup.phone) return;

    const created: Supplier = {
      id: `sup-${Date.now()}`,
      shopId: "shop-shree-ram-01",
      name: newSup.name || newSup.company,
      company: newSup.company,
      phone: newSup.phone,
      email: newSup.email,
      address: newSup.address,
      gstin: newSup.gstin,
      totalPurchases: 0,
      pendingAmount: 0,
    };

    setSuppliers((prev) => [created, ...prev]);
    setIsAddSupOpen(false);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1700px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              Suppliers & Stock Inward
            </h2>
            <span className="text-xs bg-amber-500/10 text-amber-600 font-bold px-2.5 py-0.5 rounded-full">
              Supplier Dues: {formatCurrency(totalSupplierDue)}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Record wholesale purchases from distributor bills. Inventory updates automatically on inward.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddSupOpen(true)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold shadow-xs"
          >
            + Add Supplier
          </button>
          <button
            onClick={() => setIsNewPurchaseOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Inward Stock Purchase
          </button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {s.company}
                  </h4>
                  <p className="text-xs text-slate-500">Contact: {s.name}</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 px-2 py-0.5 rounded">
                  GST: {s.gstin || "N/A"}
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phone}
                </p>
                <p className="text-[11px] text-slate-500">{s.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Total Purchases
                  </span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(s.totalPurchases)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Pending Payable
                  </span>
                  <p className="font-mono font-extrabold text-red-600">
                    {formatCurrency(s.pendingAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setSelectedSupplierId(s.id);
                  setIsNewPurchaseOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 font-bold text-xs"
              >
                + Record Bill Inward
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Purchase Inward Modal */}
      {isNewPurchaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Record Stock Inward (Purchase)</span>
              </h3>
              <button
                onClick={() => setIsNewPurchaseOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePurchase} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Supplier / Distributor
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-semibold"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.company} ({s.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Electrical Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod) setPurchaseCost(prod.purchasePrice);
                  }}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-semibold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.currentStock} {p.unit.toLowerCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Inward Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Purchase Rate (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20 rounded-xl font-mono flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400">Total Purchase Bill:</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {formatCurrency(purchaseQty * purchaseCost)}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPurchaseOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Confirm Inward & Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddSupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add Wholesale Supplier
              </h3>
              <button
                onClick={() => setIsAddSupOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Company / Agency Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSup.company}
                  onChange={(e) => setNewSup({ ...newSup, company: e.target.value })}
                  placeholder="e.g. Lohar Chawl Electrical Agency"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newSup.phone}
                  onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                  placeholder="e.g. 022-22019988"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={newSup.gstin}
                  onChange={(e) => setNewSup({ ...newSup, gstin: e.target.value })}
                  placeholder="27AAACA1234D1Z2"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono uppercase"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSupOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
