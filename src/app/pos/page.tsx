"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Product, Customer, CustomerType, InvoiceItem, Invoice, PaymentMethod } from "@/types";
import { formatCurrency, getPriceByCustomerType } from "@/lib/utils";
import { InvoiceModal } from "@/components/billing/InvoiceModal";
import { BoardBuilderModal } from "@/components/billing/BoardBuilderModal";
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  User,
  Zap,
  Tag,
  CreditCard,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  MapPin,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

export default function PosPage() {
  const { shop, products, customers, addInvoice } = useApp();

  // Mode: Kacchi Parchi (Estimate) vs Pakka Bill (Tax Invoice)
  const [isEstimate, setIsEstimate] = useState(false);

  // Search & Cart states
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("walk-in");
  const [customerName, setCustomerName] = useState("Walk-in Retail Customer");
  const [customerPhone, setCustomerPhone] = useState("9876543210");
  const [customerType, setCustomerType] = useState<CustomerType>("NORMAL");
  const [siteName, setSiteName] = useState(""); // Site-wise billing (e.g. Verma Ji Flat 402)

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [notes, setNotes] = useState("");

  // Modals
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleCustomerChange = (id: string) => {
    setSelectedCustomerId(id);
    if (id === "walk-in") {
      setCustomerName("Walk-in Retail Customer");
      setCustomerPhone("9876543210");
      setCustomerType("NORMAL");
      setSiteName("");
    } else {
      const found = customers.find((c) => c.id === id);
      if (found) {
        setCustomerName(found.name);
        setCustomerPhone(found.phone);
        setCustomerType(found.customerType);
        if (found.customerType === "ELECTRICIAN") {
          setSiteName("Site 1: Main Project");
        }

        // Recalculate cart rates based on new customer tier
        setCart((prev) =>
          prev.map((item) => {
            const prod = products.find((p) => p.id === item.productId);
            if (prod) {
              const newRate = getPriceByCustomerType(prod, found.customerType);
              const taxable = isEstimate ? newRate * item.quantity : (newRate * item.quantity) / (1 + item.gstRate / 100);
              const gstAmt = isEstimate ? 0 : newRate * item.quantity - taxable;
              return {
                ...item,
                rate: newRate,
                taxableValue: taxable,
                gstAmount: gstAmt,
                total: newRate * item.quantity,
              };
            }
            return item;
          })
        );
      }
    }
  };

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.barcode && p.barcode.includes(searchQuery)) ||
          p.hsnCode.includes(searchQuery)
      )
    : products.slice(0, 10);

  const addToCart = (product: Product, defaultQty: number = 1) => {
    const existingIndex = cart.findIndex((i) => i.productId === product.id);
    const applicableRate = getPriceByCustomerType(product, customerType);

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + defaultQty;
            const taxable = isEstimate ? applicableRate * newQty : (applicableRate * newQty) / (1 + item.gstRate / 100);
            const gst = isEstimate ? 0 : applicableRate * newQty - taxable;
            return {
              ...item,
              quantity: newQty,
              rate: applicableRate,
              taxableValue: taxable,
              gstAmount: gst,
              total: applicableRate * newQty,
            };
          }
          return item;
        })
      );
    } else {
      const taxable = isEstimate ? applicableRate * defaultQty : (applicableRate * defaultQty) / (1 + product.gstRate / 100);
      const gst = isEstimate ? 0 : applicableRate * defaultQty - taxable;
      const newItem: InvoiceItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        hsnCode: product.hsnCode,
        unit: product.unit,
        quantity: defaultQty,
        rate: applicableRate,
        discountAmount: 0,
        taxableValue: taxable,
        gstRate: isEstimate ? 0 : product.gstRate,
        gstAmount: gst,
        total: applicableRate * defaultQty,
        warrantyMonths: product.warrantyMonths,
      };
      setCart((prev) => [newItem, ...prev]);
    }
  };

  const updateItemQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const taxable = isEstimate ? item.rate * newQty : (item.rate * newQty) / (1 + item.gstRate / 100);
          const gst = isEstimate ? 0 : item.rate * newQty - taxable;
          return {
            ...item,
            quantity: newQty,
            taxableValue: taxable,
            gstAmount: gst,
            total: item.rate * newQty,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setNotes("");
    setSiteName("");
  };

  // Cart Calculations
  const rawSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const postDiscountTotal = Math.max(0, rawSubtotal - discountAmount);

  const totalTax = isEstimate ? 0 : cart.reduce((sum, item) => sum + item.gstAmount, 0);
  const cgstAmount = totalTax / 2;
  const sgstAmount = totalTax / 2;
  const grandTotal = Math.round(postDiscountTotal);
  const roundOff = Number((grandTotal - postDiscountTotal).toFixed(2));

  // Generate Invoice Action
  const handleGenerateInvoice = () => {
    if (cart.length === 0) return;

    const prefix = isEstimate ? "EST-" : shop.invoicePrefix;
    const newInvoiceNumber = `${prefix}${shop.nextInvoiceNumber}`;
    const isUdhaar = paymentMethod === "UDHAAR";

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      shopId: shop.id,
      customerId: selectedCustomerId === "walk-in" ? undefined : selectedCustomerId,
      invoiceNumber: newInvoiceNumber,
      invoiceDate: new Date().toISOString(),
      customerName,
      customerPhone,
      customerType,
      siteName: siteName.trim() || undefined,
      isEstimate,
      subtotal: rawSubtotal,
      discountAmount,
      taxableAmount: isEstimate ? rawSubtotal : rawSubtotal - totalTax,
      cgstAmount,
      sgstAmount,
      igstAmount: 0,
      totalTax,
      roundOff,
      grandTotal,
      paymentMethod,
      paymentStatus: isUdhaar ? "UNPAID" : "PAID",
      paidAmount: isUdhaar ? 0 : grandTotal,
      dueAmount: isUdhaar ? grandTotal : 0,
      notes,
      items: cart,
    };

    addInvoice(newInvoice);
    setCompletedInvoice(newInvoice);
    clearCart();
  };

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 max-w-[1700px] mx-auto w-full bg-white dark:bg-black text-slate-900 dark:text-white">
      {/* Top Bar with 80% White, 20% Black styling & Estimate toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight">Fast POS Counter</h2>
            {/* Kacchi Parchi vs Pakka Bill Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsEstimate(false)}
                className={`px-3 py-1 rounded-md transition-all ${
                  !isEstimate
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                    : "text-slate-500 hover:text-black dark:hover:text-white"
                }`}
              >
                Pakka Bill (GST Tax Invoice)
              </button>
              <button
                onClick={() => setIsEstimate(true)}
                className={`px-3 py-1 rounded-md transition-all ${
                  isEstimate
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                    : "text-slate-500 hover:text-black dark:hover:text-white"
                }`}
              >
                Kacchi Parchi (Estimate Slip)
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEstimate
              ? "Estimate mode: Clean slip without GST calculations, perfect for quick WhatsApp quotations."
              : "GST Tax Invoice mode: Official tax invoice with CGST/SGST & HSN codes."}
          </p>
        </div>

        {/* Customer & Site Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Switchboard Visual Builder Trigger */}
          <button
            onClick={() => setIsBoardModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-black rounded-xl text-xs font-bold transition-all text-slate-900 dark:text-white"
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>⚡ Board Builder</span>
          </button>

          {/* Customer Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCustomerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="bg-transparent font-bold outline-none cursor-pointer text-slate-900 dark:text-white"
            >
              <option value="walk-in">Retail Customer (Retail Rate)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.customerType}) • Udhaar: {formatCurrency(c.currentUdhaar)}
                </option>
              ))}
            </select>
          </div>

          {/* Site / Project input for Electricians */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs w-48">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Site (e.g. Verma Ji Flat 402)"
              className="w-full bg-transparent outline-none font-medium placeholder:text-slate-400 text-slate-900 dark:text-white text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT: Catalog & Search (7 cols) ================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type switch, socket, wire meter, MCB or barcode..."
              className="w-full pl-10 pr-20 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs md:text-sm font-medium outline-none focus:border-black dark:focus:border-white shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-black dark:hover:text-white font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {["All", "Wires & Cables", "Switches & Sockets", "Modular Plates", "LED Lights", "MCBs"].map(
              (cat, idx) => (
                <button
                  key={cat}
                  onClick={() => setSearchQuery(idx === 0 ? "" : cat.split(" ")[0].toLowerCase())}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors border ${
                    (idx === 0 && !searchQuery) || (idx > 0 && searchQuery.toLowerCase().includes(cat.split(" ")[0].toLowerCase()))
                      ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold"
                      : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const activeRate = getPriceByCustomerType(p, customerType);
              const isLowStock = p.currentStock <= p.minStockAlert && p.currentStock > 0;
              const isOutOfStock = p.currentStock <= 0;

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl bg-white dark:bg-slate-950 border transition-all flex flex-col justify-between ${
                    isOutOfStock
                      ? "border-red-200 dark:border-red-900/30 opacity-70"
                      : "border-slate-200 dark:border-slate-800 hover:border-black dark:hover:border-white shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {p.sku}
                      </span>
                      {p.isCable ? (
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold px-1.5 py-0.5 rounded font-mono">
                          Loose Meter Wire
                        </span>
                      ) : isOutOfStock ? (
                        <span className="text-[9px] bg-red-500/10 text-red-600 font-bold px-1.5 py-0.5 rounded">
                          0 Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="text-[9px] bg-amber-500/10 text-amber-600 font-bold px-1.5 py-0.5 rounded">
                          Low Stock ({p.currentStock})
                        </span>
                      ) : null}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 line-clamp-2">
                      {p.name}
                    </h4>

                    {p.isCable ? (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Spec: {p.crossSection} • {p.wireColor}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {p.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                          {formatCurrency(activeRate)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          /{p.unit.toLowerCase()}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        In Stock: <strong>{p.currentStock}</strong> {p.unit.toLowerCase()}
                      </span>
                    </div>

                    {/* Add action */}
                    {p.isCable ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => addToCart(p, 10)}
                          className="px-2 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
                        >
                          +10m
                        </button>
                        <button
                          onClick={() => addToCart(p, 25)}
                          className="px-2 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
                        >
                          +25m
                        </button>
                        <button
                          onClick={() => addToCart(p, 90)}
                          className="px-2 py-1 text-[10px] font-bold bg-black text-white dark:bg-white dark:text-black rounded-md"
                        >
                          +90m Roll
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(p, 1)}
                        disabled={isOutOfStock}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                          isOutOfStock
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                            : "bg-black text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-95"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT: Cart & Checkout (5 cols) ================= */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-4 md:p-5 flex flex-col justify-between min-h-[640px]">
          <div>
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-black dark:text-white" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {isEstimate ? "Estimate Slip (Kacchi Parchi)" : "GST Tax Invoice Cart"}
                </h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md font-mono font-bold">
                  {cart.length}
                </span>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Site indicator if provided */}
            {siteName && (
              <div className="my-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-500 font-medium">📍 Site / Project:</span>
                <span className="font-bold text-slate-900 dark:text-white">{siteName}</span>
              </div>
            )}

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
                <ShoppingCart className="w-10 h-10 mb-2 stroke-1 text-slate-300 dark:text-slate-700" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Cart is empty
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                  Click electrical products or use &quot;Board Builder&quot; to configure switchboards.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[300px] overflow-y-auto my-2 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-start justify-between gap-2 text-xs">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">
                        {item.productName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ₹{item.rate}/{item.unit.toLowerCase()} {!isEstimate && `• GST ${item.gstRate}%`}
                      </p>
                    </div>

                    {/* Quantity Modifier */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateItemQty(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <input
                        type="number"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => updateItemQty(item.id, parseFloat(e.target.value) || 0)}
                        className="w-14 text-center font-bold font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded py-0.5 text-xs outline-none"
                      />

                      <button
                        onClick={() => updateItemQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <p className="font-bold font-mono text-slate-900 dark:text-white">
                        ₹{item.total.toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] text-slate-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout & Totals */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Discount (%)
                </label>
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent || ""}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-transparent outline-none font-bold font-mono text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="CASH">💵 Cash</option>
                  <option value="UPI">📱 UPI / QR</option>
                  <option value="CARD">💳 Card</option>
                  <option value="BANK_TRANSFER">🏦 Bank NEFT</option>
                  <option value="UDHAAR">📝 Udhaar / Credit</option>
                </select>
              </div>
            </div>

            {/* Calculations Box */}
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span>₹{rawSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({discountPercent}%):</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {!isEstimate && (
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>GST Total (CGST + SGST):</span>
                  <span>₹{totalTax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-1.5">
                <span>Total Amount:</span>
                <span className="text-black dark:text-white font-mono">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateInvoice}
              disabled={cart.length === 0}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-md ${
                cart.length === 0
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : paymentMethod === "UDHAAR"
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
                  : isEstimate
                  ? "bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black"
                  : "bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>
                {isEstimate
                  ? `Save Estimate Slip (₹${grandTotal.toLocaleString("en-IN")})`
                  : paymentMethod === "UDHAAR"
                  ? `Save Udhaar Bill (₹${grandTotal.toLocaleString("en-IN")})`
                  : `Generate & Print Bill (₹${grandTotal.toLocaleString("en-IN")})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Switchboard Builder Modal */}
      {isBoardModalOpen && (
        <BoardBuilderModal
          products={products}
          onAddBoardToCart={(items) => {
            items.forEach((it) => addToCart(it.product, it.quantity));
          }}
          onClose={() => setIsBoardModalOpen(false)}
        />
      )}

      {/* Invoice Generated Pop-up Modal */}
      {completedInvoice && (
        <InvoiceModal
          invoice={completedInvoice}
          shop={shop}
          onClose={() => setCompletedInvoice(null)}
        />
      )}
    </div>
  );
}
