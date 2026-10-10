import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function safeCurrency(currency: string): string {
  const c = (currency ?? "").trim().toUpperCase();
  return /^[A-Z]{3}$/.test(c) ? c : "USD";
}

export function formatCurrency(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: safeCurrency(currency),
    maximumFractionDigits: 0,
  }).format(n);
}

/** Currency with cents — invoices, billing. */
export function formatCurrencyAmount(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: safeCurrency(currency),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPercent(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}
