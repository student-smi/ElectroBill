"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Boxes,
  Users,
  FileText,
  ShieldCheck,
  Bot,
  Share2,
  Sparkles,
  Scissors,
  Receipt,
  Check,
  Layers,
  MapPin,
  Gift,
  Printer,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-black selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight">
              Electro<span className="underline decoration-2">Bill</span>
            </span>
            <span className="text-[9px] uppercase font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300">
              India
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-black transition-colors">
              Electrical Features
            </a>
            <a href="#board-builder" className="hover:text-black transition-colors">
              Board Builder
            </a>
            <a href="#pricing" className="hover:text-black transition-colors">
              SaaS Pricing
            </a>
            <a href="#faq" className="hover:text-black transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-black px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex text-xs font-bold text-slate-700 hover:text-black px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-black transition-all"
            >
              Open Live Demo
            </Link>
            <Link
              href="/signup"
              className="text-xs font-extrabold bg-black text-white hover:bg-slate-800 px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Register Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold shadow-2xs">
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>Built Specifically for Indian Electrical & Hardware Stores</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
            Billing Made Simple for <br />
            <span className="text-black underline decoration-4 decoration-amber-500 underline-offset-8">
              Electrical Shops.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create bills in 10 seconds, manage loose wire meter cutting, calculate modular switchboards, track electrician commissions, and never lose an invoice again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-7 py-3.5 bg-black hover:bg-slate-800 text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Setup Your Shop Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pos"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl text-sm border border-slate-300 hover:border-black transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Try Fast POS Screen</span>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-black" /> Wires Sold by Meters
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-black" /> Kacchi Parchi vs Pakka Bill
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-black" /> Site-Wise Project Billing
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-black" /> Electrician Secret Passbook
            </span>
          </div>
        </div>

        {/* Live UI Mockup Preview - 80% White, 20% Black */}
        <div className="max-w-5xl mx-auto mt-12 bg-white border border-slate-300 rounded-2xl p-4 sm:p-6 shadow-xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-black" />
              <span className="ml-2 font-bold text-slate-800">
                Shree Ram Electric & Hardware • POS Live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                Kacchi Parchi Mode: OFF
              </span>
              <span className="bg-black text-white px-2 py-0.5 rounded font-bold text-[10px]">
                GST Tax Invoice
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
            {/* Left Items */}
            <div className="md:col-span-7 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">Anchor Roma 6A 1-Way Switch</p>
                  <span className="text-[10px] text-slate-500 font-mono">20 pcs × ₹30 (Electrician Rate)</span>
                </div>
                <span className="font-mono font-bold text-slate-900">₹600.00</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">Havells 1.5 sq.mm FR Copper Wire (Red)</p>
                  <span className="text-[10px] text-slate-500 font-mono">27 loose meters cut × ₹26.5/m</span>
                </div>
                <span className="font-mono font-bold text-slate-900">₹715.50</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">8-Module Modular Switchboard Kit</p>
                  <span className="text-[10px] text-slate-500 font-mono">4 Sw + 1 Soc + 1 Reg + 8M Plate</span>
                </div>
                <span className="font-mono font-bold text-slate-900">₹820.00</span>
              </div>
            </div>

            {/* Right Summary */}
            <div className="md:col-span-5 bg-white p-4 rounded-xl border border-slate-300 flex flex-col justify-between text-xs space-y-4 shadow-xs">
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-medium">Electrician:</span>
                    <span className="font-bold text-slate-900">Suresh Patil</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] mt-1">
                    <span className="text-slate-500 font-medium">📍 Site / Project:</span>
                    <span className="font-bold text-slate-900">Verma Ji Flat 402</span>
                  </div>
                </div>

                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>₹2,135.50</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18%):</span>
                    <span>₹384.39</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-950 border-t border-slate-200 pt-1">
                    <span>Grand Total:</span>
                    <span>₹2,520.00</span>
                  </div>
                </div>
              </div>

              <Link
                href="/pos"
                className="w-full py-2.5 bg-black hover:bg-slate-800 text-white font-bold rounded-lg text-center transition-all shadow-xs"
              >
                Launch Fast Counter POS →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Killer Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-950">
              Engineered for Real Indian Electrical Counters
            </h2>
            <p className="text-sm text-slate-600">
              Generic POS fails because electrical shops don&apos;t just sell packaged goods. They cut wires, build modular switchboards, and manage electrician commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-black transition-all space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Wire & Cable Loose Meter Cutting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stock 900 meters of Havells copper wire. Customer maangta hai 27 meters? Type 27m and inventory drops automatically with zero manual calculation errors.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-black transition-all space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                ⚡ Switchboard Visual Builder
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customer bolta hai &quot;4 switch aur 1 socket ka board bana do&quot;. Visual builder khud calculate karke 8-Module plate suggest karta hai aur 1 click me add ho jata hai.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-black transition-all space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Kacchi Parchi vs Pakka Bill Toggle
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                1-Click toggle between Estimate Slip (no GST) for retail cash customers, and official GST Tax Invoice. Convert any old estimate into a GST invoice in 1 click.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-black transition-all space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Site-Wise Project Billing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Electrician Ramesh 3 sites ka kaam kar raha hai? Bill me &quot;Verma Ji Flat 402&quot; tag karein taaki mahine ke end me customer aur electrician ke beech koi jhagda na ho.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-black transition-all space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Electrician Secret Commission Passbook
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Electricians ko 5-8% cut milta hai. Customer ke bill par show nahi hoga, lekin background me electrician passbook me credit hoga. Click &quot;Pay Cash&quot; anytime!
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-black transition-all space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                WhatsApp Invoices & Instant UPI Reminders
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bill bante hi WhatsApp par formatted estimate bhej do. Udhaar customer ko 1-tap WhatsApp reminder bhej do jisme direct shop ka UPI payment ID hota hai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section - 80/20 High-Contrast */}
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-950">Simple SaaS Pricing</h2>
            <p className="text-sm text-slate-600">
              No hidden fees. Start free on any laptop, tablet, or desktop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-400 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Starter</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">FREE</h3>
                <p className="text-xs text-slate-500 mt-1">Single counter trial.</p>
                <div className="my-5 border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Up to 50 Bills / month
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Loose Wire Meters
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> A4 & Thermal Print
                  </p>
                </div>
              </div>
              <Link
                href="/onboarding"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-center text-xs font-bold"
              >
                Get Started
              </Link>
            </div>

            {/* Basic */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-400 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Basic</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹499<span className="text-xs font-normal text-slate-500">/mo</span></h3>
                <p className="text-xs text-slate-500 mt-1">For growing retailers.</p>
                <div className="my-5 border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Unlimited Invoices
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Kacchi Parchi & GST Bills
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> WhatsApp Sharing
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Barcode Scanning
                  </p>
                </div>
              </div>
              <Link
                href="/onboarding"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-center text-xs font-bold"
              >
                Choose Basic
              </Link>
            </div>

            {/* Business (Most Popular - Solid Black Card) */}
            <div className="p-6 rounded-2xl bg-black text-white border-2 border-black relative flex flex-col justify-between space-y-6 shadow-xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-black font-mono font-extrabold text-[10px] rounded-full uppercase border border-black shadow-xs">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Business</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">₹999<span className="text-xs font-normal text-slate-400">/mo</span></h3>
                <p className="text-xs text-slate-400 mt-1">Full Udhaar & Multi-staff control.</p>
                <div className="my-5 border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" /> Everything in Basic
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" /> Electrician Secret Passbook
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" /> Site-Wise Project Billing
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" /> ⚡ Switchboard Builder
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" /> Multi-Role Staff Control
                  </p>
                </div>
              </div>
              <Link
                href="/onboarding"
                className="w-full py-2.5 bg-white hover:bg-slate-200 text-black font-extrabold rounded-lg text-center text-xs shadow-md"
              >
                Start Business Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-400 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Enterprise</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹1,999<span className="text-xs font-normal text-slate-500">/mo</span></h3>
                <p className="text-xs text-slate-500 mt-1">Multi-branch & AI assistant.</p>
                <div className="my-5 border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> AI Electrical Shop Assistant
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Multi-Shop Branches Sync
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Dedicated Phone Support
                  </p>
                </div>
              </div>
              <Link
                href="/onboarding"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-center text-xs font-bold"
              >
                Go Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 py-10 px-4 sm:px-6 text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-black fill-black" />
            <span className="font-bold text-slate-900">ElectroBill SaaS</span>
            <span>• Specially designed for Indian Electrical & Hardware Stores.</span>
          </div>
          <div>© 2026 ElectroBill Technologies Pvt Ltd. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
