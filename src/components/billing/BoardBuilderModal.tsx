"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { X, Plus, Minus, Check, Sparkles, Zap, Layers } from "lucide-react";

interface BoardBuilderModalProps {
  products: Product[];
  onAddBoardToCart: (items: { product: Product; quantity: number }[]) => void;
  onClose: () => void;
}

export function BoardBuilderModal({
  products,
  onAddBoardToCart,
  onClose,
}: BoardBuilderModalProps) {
  // Quantities for each module type
  const [switches6A, setSwitches6A] = useState(4);
  const [switches16A, setSwitches16A] = useState(1);
  const [sockets6A, setSockets6A] = useState(1);
  const [sockets16A, setSockets16A] = useState(0);
  const [fanRegulators, setFanRegulators] = useState(1);
  const [blanks, setBlanks] = useState(0);

  // Module sizing rules (standard modular electrical standards)
  // 6A Switch = 1 Module
  // 16A Switch = 1 Module
  // 6A Socket = 2 Modules
  // 16A Socket = 2 Modules
  // Fan Regulator = 1 Module
  // Blank = 1 Module

  const totalModulesNeeded =
    switches6A * 1 +
    switches16A * 1 +
    sockets6A * 2 +
    sockets16A * 2 +
    fanRegulators * 1 +
    blanks * 1;

  // Available standard Indian modular plates
  const availablePlates = [1, 2, 3, 4, 6, 8, 12, 16, 18];
  const recommendedPlateSize =
    availablePlates.find((size) => size >= totalModulesNeeded) || 18;

  // Map to actual products in catalog
  const handleAddAll = () => {
    const list: { product: Product; quantity: number }[] = [];

    // Find products
    const pSw6A = products.find((p) => p.sku === "ANC-ROM-6A-SW") || products[0];
    const pSw16A = products.find((p) => p.sku === "ANC-ROM-16A-SW") || products[1];
    const pSoc6A = products.find((p) => p.sku === "ANC-ROM-6A-SOC") || products[2];
    const pSoc16A = products.find((p) => p.sku === "ANC-ROM-16A-SOC") || products[3];
    const pReg = products.find((p) => p.sku === "ANC-ROM-REG-100W") || products[13];

    // Find Plate (e.g. 4M, 6M, 8M plate)
    let pPlate = products.find((p) => p.sku.includes(`PLT-${recommendedPlateSize}M`));
    if (!pPlate) {
      pPlate = products.find((p) => p.sku === "ANC-ROM-PLT-8M") || products[5];
    }

    if (switches6A > 0 && pSw6A) list.push({ product: pSw6A, quantity: switches6A });
    if (switches16A > 0 && pSw16A) list.push({ product: pSw16A, quantity: switches16A });
    if (sockets6A > 0 && pSoc6A) list.push({ product: pSoc6A, quantity: sockets6A });
    if (sockets16A > 0 && pSoc16A) list.push({ product: pSoc16A, quantity: sockets16A });
    if (fanRegulators > 0 && pReg) list.push({ product: pReg, quantity: fanRegulators });
    if (pPlate) list.push({ product: pPlate, quantity: 1 });

    onAddBoardToCart(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
                Switchboard Visual Builder
              </h3>
              <p className="text-[11px] text-slate-500">
                Pick switches & sockets. Automatically calculates exact Modular Plate size.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Visual Schematic Box */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Live Modular Plate Fit
            </span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {recommendedPlateSize}-Module Plate
              </span>
              <span className="text-xs bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 rounded-md font-bold">
                {totalModulesNeeded} / {recommendedPlateSize} Slots Used
              </span>
            </div>

            {/* Visual Plate grid representation */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 p-3 bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
              {Array.from({ length: switches6A }).map((_, i) => (
                <div
                  key={`sw-${i}`}
                  className="w-10 h-14 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded flex flex-col items-center justify-center text-[9px] font-bold text-slate-700 dark:text-slate-300"
                >
                  <div className="w-4 h-5 border border-slate-400 rounded-xs mb-1" />
                  6A
                </div>
              ))}
              {Array.from({ length: switches16A }).map((_, i) => (
                <div
                  key={`sw16-${i}`}
                  className="w-10 h-14 bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded flex flex-col items-center justify-center text-[9px] font-bold text-slate-900 dark:text-white"
                >
                  <div className="w-5 h-6 bg-slate-400 rounded-xs mb-1" />
                  16A
                </div>
              ))}
              {Array.from({ length: sockets6A }).map((_, i) => (
                <div
                  key={`soc-${i}`}
                  className="w-18 h-14 bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded flex flex-col items-center justify-center text-[9px] font-bold text-slate-800 dark:text-slate-200"
                >
                  <div className="flex gap-1 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  </div>
                  6A Socket (2M)
                </div>
              ))}
              {Array.from({ length: fanRegulators }).map((_, i) => (
                <div
                  key={`reg-${i}`}
                  className="w-10 h-14 bg-amber-50 dark:bg-amber-950/40 border border-amber-400/50 rounded flex flex-col items-center justify-center text-[9px] font-bold text-amber-700 dark:text-amber-400"
                >
                  <div className="w-4 h-4 rounded-full border border-amber-600 mb-1" />
                  Reg
                </div>
              ))}
            </div>
          </div>

          {/* Module Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 6A Switch */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">6A Normal Switch</p>
                <span className="text-[10px] text-slate-500">1 Module (Roma / Fabio)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSwitches6A(Math.max(0, switches6A - 1))}
                  className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold font-mono text-sm">{switches6A}</span>
                <button
                  onClick={() => setSwitches6A(switches6A + 1)}
                  className="w-7 h-7 rounded bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 6A Socket */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">6A 3-Pin Socket</p>
                <span className="text-[10px] text-slate-500">2 Modules (With shutter)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSockets6A(Math.max(0, sockets6A - 1))}
                  className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold font-mono text-sm">{sockets6A}</span>
                <button
                  onClick={() => setSockets6A(sockets6A + 1)}
                  className="w-7 h-7 rounded bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 16A Power Switch */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">16A Power Switch</p>
                <span className="text-[10px] text-slate-500">1 Module (Geyser/AC load)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSwitches16A(Math.max(0, switches16A - 1))}
                  className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold font-mono text-sm">{switches16A}</span>
                <button
                  onClick={() => setSwitches16A(switches16A + 1)}
                  className="w-7 h-7 rounded bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Fan Regulator */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Fan Step Regulator</p>
                <span className="text-[10px] text-slate-500">1 Module (Rotary 4-Step)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFanRegulators(Math.max(0, fanRegulators - 1))}
                  className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold font-mono text-sm">
                  {fanRegulators}
                </span>
                <button
                  onClick={() => setFanRegulators(fanRegulators + 1)}
                  className="w-7 h-7 rounded bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Auto-adds <strong>{recommendedPlateSize}M Plate</strong> + all accessories to bill.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAll}
              className="px-5 py-2.5 bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Add Entire Switchboard to Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
