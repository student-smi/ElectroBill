"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Bot, Send, Sparkles, User, Zap, AlertTriangle, ShieldCheck } from "lucide-react";

interface Message {
  sender: "USER" | "AI";
  text: string;
  time: string;
}

export default function AiAssistantPage() {
  const { shop, products, customers, invoices } = useApp();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "AI",
      text: `⚡ Namaste! Main hoon ElectroBill AI — aapki electrical shop ka smart assistant.
Aap mujhse store ki sales, low stock items, electrician udhaar, ya top products ke baare me Hindi ya English me pooch sakte hain!`,
      time: "Just now",
    },
  ]);

  // Answer engine using live store data
  const handleQuery = (queryText: string) => {
    const q = queryText.toLowerCase();
    let reply = "";

    const todaySales = invoices.reduce((sum, i) => sum + i.grandTotal, 0);
    const lowStock = products.filter((p) => p.currentStock <= p.minStockAlert);
    const outOfStock = products.filter((p) => p.currentStock <= 0);

    if (q.includes("sale") || q.includes("aaj") || q.includes("today") || q.includes("kitni")) {
      reply = `📊 **Sales Summary:**
• Total Recorded Sales: **${formatCurrency(todaySales)}**
• Total Invoices Generated: **${invoices.length} bills**
• Largest Bill: **SRE-1041** to Mayur Shah (Contractor) for ₹18,000.`;
    } else if (q.includes("stock") || q.includes("low") || q.includes("khatam") || q.includes("empty")) {
      const outNames = outOfStock.map((p) => p.name).join(", ");
      const lowNames = lowStock.map((p) => `${p.name} (${p.currentStock} ${p.unit.toLowerCase()})`).join(", ");
      reply = `⚠️ **Stock Alert Analysis:**
• **Out of Stock (0 qty):** ${outNames || "None"}
• **Low Stock Alert:** ${lowNames || "All items well stocked"}
Distributor **Cable House Mumbai** se reorder karne ki advice di jaati hai.`;
    } else if (q.includes("udhaar") || q.includes("credit") || q.includes("suresh") || q.includes("baki")) {
      const suresh = customers.find((c) => c.name.toLowerCase().includes("suresh"));
      const totalUdhaar = customers.reduce((sum, c) => sum + c.currentUdhaar, 0);
      reply = `💳 **Udhaar & Credit Ledger:**
• Total Store Pending Udhaar: **${formatCurrency(totalUdhaar)}**
${suresh ? `• **Suresh Patil (Patil Electricals):** Currently has **${formatCurrency(suresh.currentUdhaar)}** pending out of ₹50,000 credit limit.` : ""}
• Mayur Shah (Shah Developers): **₹42,300** pending.`;
    } else if (q.includes("wire") || q.includes("cable") || q.includes("meter")) {
      const wires = products.filter((p) => p.isCable);
      const wireList = wires.map((w) => `• ${w.name}: **${w.currentStock} meters remaining**`).join("\n");
      reply = `🔌 **Wire & Cable Meter Stock:**
${wireList}
*Note:* Meter-based wire cutting is automatically synced during POS checkout.`;
    } else {
      reply = `Aapke store ke data ke anusar:
• Total Registered Electrical Products: **${products.length} items**
• Active Electricians / Contractors: **${customers.length} accounts**
• Current Store Turnover: **${formatCurrency(todaySales)}**
Koi specific query poohein jaise: *"Kaunse products low stock me hain?"* ya *"Today's sales kitni hai?"*`;
    }

    const newMsgs: Message[] = [
      ...messages,
      { sender: "USER", text: queryText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      { sender: "AI", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ];
    setMessages(newMsgs);
    setInput("");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleQuery(input.trim());
  };

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 max-w-4xl mx-auto w-full h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
            <Bot className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>ElectroBill AI Assistant</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-600 font-bold px-1.5 py-0.2 rounded">
                Read-Only Safe
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Natural language electrical shop assistant with real-time inventory & sales intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Question Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          "Today's sales kitni hai?",
          "Kaunse products low stock me hain?",
          "Suresh electrician ka kitna udhaar baki hai?",
          "Wires me kitna meter stock bacha hai?",
        ].map((q) => (
          <button
            key={q}
            onClick={() => handleQuery(q)}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500 hover:text-amber-600 whitespace-nowrap text-[11px] transition-colors shadow-xs"
          >
            ✨ {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === "USER" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === "USER"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-amber-500 text-slate-950"
              }`}
            >
              {m.sender === "USER" ? <User className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-slate-950" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                m.sender === "USER"
                  ? "bg-amber-500 text-slate-950 font-medium rounded-tr-none"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none whitespace-pre-line"
              }`}
            >
              {m.text}
              <span
                className={`block text-[9px] mt-1.5 ${
                  m.sender === "USER" ? "text-slate-800/70 text-right" : "text-slate-400"
                }`}
              >
                {m.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask in Hindi or English (e.g. 'Aaj ki sales kitni hui?')..."
          className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white shadow-xs"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 top-2 p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 rounded-xl transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
