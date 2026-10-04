import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ElectroBill - Smart Billing & Inventory for Indian Electrical Shops",
  description:
    "Production-grade SaaS billing, wire meter inventory, electrician udhaar ledger, and instant GST invoices specifically tailored for Indian electrical businesses.",
  keywords: [
    "Electrical shop billing software",
    "Wire meter inventory",
    "Electrician credit ledger",
    "Anchor Roma billing",
    "Havells wire billing",
    "GST invoice for electrical store",
    "Indian electrical POS",
  ],
  authors: [{ name: "ElectroBill Team" }],
  openGraph: {
    title: "ElectroBill - Electrical Shop Billing & Inventory SaaS",
    description:
      "Create bills in seconds, track wire meter stock, manage contractor udhaar, and never lose an invoice.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F59E0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${outfit.variable} font-sans h-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
