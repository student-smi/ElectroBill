export type Role = "SUPER_ADMIN" | "SHOP_OWNER" | "MANAGER" | "CASHIER";

export type SubscriptionPlan = "FREE" | "BASIC" | "BUSINESS" | "PRO";

export type CustomerType = "NORMAL" | "ELECTRICIAN" | "CONTRACTOR" | "BUILDER" | "COMPANY";

export type ElectricalUnit =
  | "PIECE"
  | "METER"
  | "BOX"
  | "BUNDLE"
  | "ROLL"
  | "PACKET"
  | "SET"
  | "PAIR";

export type PaymentMethod =
  | "CASH"
  | "UPI"
  | "CARD"
  | "BANK_TRANSFER"
  | "CHEQUE"
  | "UDHAAR";

export type PaymentStatus = "PAID" | "PARTIAL" | "UNPAID";

export interface Shop {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  pan?: string;
  logoUrl?: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  termsAndConditions: string;
  plan: SubscriptionPlan;
  active: boolean;
}

export interface User {
  id: string;
  shopId: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
}

export interface Category {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Brand {
  id: string;
  shopId: string;
  name: string;
}

export interface Product {
  id: string;
  shopId: string;
  categoryId: string;
  brandId?: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  unit: ElectricalUnit;
  
  // Price tiers
  purchasePrice: number;
  retailPrice: number;
  electricianPrice: number;
  contractorPrice: number;
  wholesalePrice: number;
  
  gstRate: number;
  hsnCode: string;
  
  // Stock
  openingStock: number;
  currentStock: number;
  minStockAlert: number;
  
  // Wire / Cable specs
  isCable?: boolean;
  cableType?: string; // Copper, Aluminium, Armoured, Flexible
  coreCount?: number;
  crossSection?: string; // 1.0 sq.mm, 1.5 sq.mm, etc.
  wireColor?: string; // Red, Black, Green, Blue, Yellow
  
  warrantyMonths: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  customerType: CustomerType;
  gstin?: string;
  creditLimit: number;
  currentUdhaar: number;
  commissionBalance?: number; // Electrician secret commission passbook balance
  totalPurchases: number;
  totalPaid: number;
  notes?: string;
  createdAt: string;
}

export interface CustomerTransaction {
  id: string;
  shopId: string;
  customerId: string;
  invoiceId?: string;
  amount: number;
  type: "DEBIT" | "CREDIT"; // DEBIT = Udhaar added, CREDIT = Payment received
  paymentMethod: PaymentMethod;
  referenceNo?: string;
  notes?: string;
  balanceAfter: number;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  hsnCode: string;
  unit: ElectricalUnit;
  quantity: number;
  rate: number;
  discountAmount: number;
  taxableValue: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  warrantyMonths?: number;
  warrantyExpiry?: string;
}

export interface Invoice {
  id: string;
  shopId: string;
  customerId?: string;
  userId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  
  customerName: string;
  customerPhone: string;
  customerType: CustomerType;
  customerGstin?: string;
  customerAddress?: string;
  
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  dueAmount: number;
  
  isEstimate?: boolean; // True = Kacchi Parchi / Quotation, False = Pakka GST Tax Invoice
  siteName?: string;    // Site / Project Name (e.g. Verma Ji Flat 402)
  electricianCommission?: number; // Secret commission credited to electrician
  
  notes?: string;
  isReturned?: boolean;
  items: InvoiceItem[];
}

export interface Supplier {
  id: string;
  shopId: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  totalPurchases: number;
  pendingAmount: number;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  gstRate: number;
  totalCost: number;
}

export interface Purchase {
  id: string;
  shopId: string;
  supplierId: string;
  supplierName: string;
  purchaseNumber: string;
  billNumber?: string;
  purchaseDate: string;
  items: PurchaseItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
}

export interface NotificationItem {
  id: string;
  type: "LOW_STOCK" | "OUT_OF_STOCK" | "PENDING_PAYMENT" | "WARRANTY" | "SALES";
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  linkUrl?: string;
}
