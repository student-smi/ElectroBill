"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Product, ElectricalUnit } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Download,
  Upload,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  Zap,
} from "lucide-react";

export default function ProductsPage() {
  const { products, setProducts, categories, user, updateStock } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    categoryId: categories[0]?.id || "cat-1",
    unit: "PIECE",
    purchasePrice: 0,
    retailPrice: 0,
    electricianPrice: 0,
    contractorPrice: 0,
    wholesalePrice: 0,
    gstRate: 18,
    hsnCode: "8536",
    currentStock: 0,
    minStockAlert: 10,
    isCable: false,
    crossSection: "1.5 sq.mm",
    wireColor: "Red",
    warrantyMonths: 0,
  });

  const isOwnerOrManager = user.role === "SHOP_OWNER" || user.role === "MANAGER";

  // Filter products
  const filtered = products.filter((p) => {
    const matchQuery =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.hsnCode.includes(search);
    const matchCat = selectedCat === "ALL" || p.categoryId === selectedCat;
    return matchQuery && matchCat;
  });

  // Handle Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...formData } as Product) : p))
      );
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        shopId: "shop-shree-ram-01",
        name: formData.name!,
        sku: formData.sku!,
        categoryId: formData.categoryId || categories[0]?.id || "cat-1",
        unit: formData.unit as ElectricalUnit,
        purchasePrice: Number(formData.purchasePrice) || 0,
        retailPrice: Number(formData.retailPrice) || 0,
        electricianPrice: Number(formData.electricianPrice) || Number(formData.retailPrice) || 0,
        contractorPrice: Number(formData.contractorPrice) || Number(formData.retailPrice) || 0,
        wholesalePrice: Number(formData.wholesalePrice) || Number(formData.retailPrice) || 0,
        gstRate: Number(formData.gstRate) || 18,
        hsnCode: formData.hsnCode || "8536",
        openingStock: Number(formData.currentStock) || 0,
        currentStock: Number(formData.currentStock) || 0,
        minStockAlert: Number(formData.minStockAlert) || 10,
        isCable: !!formData.isCable,
        crossSection: formData.crossSection,
        wireColor: formData.wireColor,
        warrantyMonths: Number(formData.warrantyMonths) || 0,
        isActive: true,
      };
      setProducts((prev) => [newProd, ...prev]);
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      "Name",
      "SKU",
      "Unit",
      "Retail Price",
      "Electrician Price",
      "Stock",
      "GST %",
      "HSN",
    ];
    const rows = products.map((p) => [
      `"${p.name}"`,
      p.sku,
      p.unit,
      p.retailPrice,
      p.electricianPrice,
      p.currentStock,
      p.gstRate,
      p.hsnCode,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `electrobill_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1700px] mx-auto w-full">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              Products & Wire Inventory
            </h2>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono">
              {products.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Multi-tier pricing (Retail, Electrician, Contractor) and meter-based stock for wires.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          {isOwnerOrManager && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: "",
                  sku: "",
                  categoryId: categories[0]?.id || "cat-1",
                  unit: "PIECE",
                  purchasePrice: 0,
                  retailPrice: 0,
                  electricianPrice: 0,
                  contractorPrice: 0,
                  wholesalePrice: 0,
                  gstRate: 18,
                  hsnCode: "8536",
                  currentStock: 50,
                  minStockAlert: 10,
                  isCable: false,
                });
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" /> Add Electrical Product
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, or HSN code..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Product & Specification</th>
                <th className="py-3 px-3">SKU / HSN</th>
                <th className="py-3 px-3 text-center">Unit</th>
                <th className="py-3 px-3 text-right">Retail</th>
                <th className="py-3 px-3 text-right">Electrician</th>
                {isOwnerOrManager && <th className="py-3 px-3 text-right">Purchase</th>}
                <th className="py-3 px-3 text-center">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((p) => {
                const isLowStock = p.currentStock <= p.minStockAlert && p.currentStock > 0;
                const isOutOfStock = p.currentStock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">
                            {p.name}
                          </p>
                          {p.isCable ? (
                            <span className="inline-block mt-0.5 text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded font-mono">
                              Wire: {p.crossSection} • {p.wireColor} • {p.cableType}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 line-clamp-1">
                              {p.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{p.sku}</p>
                      <p className="text-[10px] text-slate-400">HSN: {p.hsnCode}</p>
                    </td>
                    <td className="py-3 px-3 text-center font-bold font-mono">
                      {p.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(p.retailPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {formatCurrency(p.electricianPrice)}
                    </td>
                    {isOwnerOrManager && (
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {formatCurrency(p.purchasePrice)}
                      </td>
                    )}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] ${
                          isOutOfStock
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : isLowStock
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {p.currentStock} {p.unit.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {isOwnerOrManager && (
                        <>
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingProduct ? "Edit Electrical Product" : "Add New Electrical Product"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anchor Roma 6A 1-Way Switch"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. ANC-ROM-6A-SW"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit of Measurement
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value as ElectricalUnit })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  >
                    <option value="PIECE">Piece (Switches, Sockets, Lights)</option>
                    <option value="METER">Meter (Wires & Cables)</option>
                    <option value="BOX">Box (Wholesale pack)</option>
                    <option value="BUNDLE">Bundle</option>
                    <option value="ROLL">Roll (90m wire roll)</option>
                    <option value="PACKET">Packet</option>
                    <option value="SET">Set</option>
                  </select>
                </div>

                {/* Wire Checkbox */}
                <div className="sm:col-span-2 flex items-center gap-2 p-2 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20 rounded-lg">
                  <input
                    type="checkbox"
                    id="isCableCheck"
                    checked={formData.isCable}
                    onChange={(e) => setFormData({ ...formData, isCable: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <label
                    htmlFor="isCableCheck"
                    className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Is this a Wire / Cable item? (Enables meter-based tracking & specs)
                  </label>
                </div>

                {formData.isCable && (
                  <>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Cross-sectional Area
                      </label>
                      <input
                        type="text"
                        value={formData.crossSection}
                        onChange={(e) =>
                          setFormData({ ...formData, crossSection: e.target.value })
                        }
                        placeholder="e.g. 1.5 sq.mm, 2.5 sq.mm"
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Insulation Color
                      </label>
                      <input
                        type="text"
                        value={formData.wireColor}
                        onChange={(e) => setFormData({ ...formData, wireColor: e.target.value })}
                        placeholder="Red, Black, Blue, Green, Yellow"
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Multi-tier Prices */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Retail Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.retailPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, retailPrice: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Electrician Special Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.electricianPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, electricianPrice: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono text-amber-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Contractor Bulk Price (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.contractorPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, contractorPrice: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Purchase Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.purchasePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, purchasePrice: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Stock ({formData.unit?.toLowerCase()})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.currentStock}
                    onChange={(e) =>
                      setFormData({ ...formData, currentStock: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Low Stock Alert Limit
                  </label>
                  <input
                    type="number"
                    value={formData.minStockAlert}
                    onChange={(e) =>
                      setFormData({ ...formData, minStockAlert: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
