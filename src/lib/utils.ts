import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getPriceByCustomerType(
  product: {
    retailPrice: number;
    electricianPrice: number;
    contractorPrice: number;
    wholesalePrice: number;
  },
  customerType: string
): number {
  switch (customerType) {
    case "ELECTRICIAN":
      return product.electricianPrice || product.retailPrice;
    case "CONTRACTOR":
      return product.contractorPrice || product.retailPrice;
    case "BUILDER":
    case "COMPANY":
      return product.wholesalePrice || product.retailPrice;
    case "NORMAL":
    default:
      return product.retailPrice;
  }
}
