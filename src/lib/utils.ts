import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LeadBase, Stats } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNominal(value: number, short = true): string {
  if (!value || isNaN(value)) return "0"
  if (short) {
    if (Math.abs(value) >= 1_000_000_000) {
      return (value / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " M"
    }
    if (Math.abs(value) >= 1_000_000) {
      return (value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " Jt"
    }
    return value.toLocaleString("id-ID", { maximumFractionDigits: 0 })
  }
  return value.toLocaleString("id-ID", { maximumFractionDigits: 0 })
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-"
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return "-"
  try {
    const d = new Date(dateStr)
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateStr
  }
}

export function parseWANumber(kontak?: string): string | null {
  if (!kontak) return null
  const waMatch = kontak.match(/wame\/(\d+)|wa\.me\/(\d+)|whatsapp\.com\/(\d+)/)
  if (waMatch) return waMatch[1] || waMatch[2] || waMatch[3]
  const phoneMatch = kontak.match(/^(\+62|62|0)[\d\s\-]{8,13}$/)
  if (phoneMatch) return kontak.replace(/\D/g, "")
  return null
}

export function parseEmail(text?: string): string | null {
  if (!text) return null
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return match ? match[0] : null
}

export function parseLinkedIn(text?: string): string | null {
  if (!text) return null
  const match = text.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?/)
  return match ? match[0] : null
}

export function calcProgress(current: number, total: number): number {
  if (!total || total === 0) return 0
  return Math.min(Math.round((current / total) * 100), 100)
}

export function progressColor(pct: number): string {
  if (pct >= 80) return "bg-mandiri-green"
  if (pct >= 50) return "bg-mandiri-yellow"
  return "bg-rose-500"
}

export function hasilFUVariant(
  hasil?: string
): "closing" | "needfu" | "takeout" | "tidakberminat" | "pending" | "default" {
  const h = hasil?.toLowerCase() || ""
  if (h.includes("closing")) return "closing"
  if (h.includes("need") || h.includes("follow")) return "needfu"
  if (h.includes("take")) return "takeout"
  if (h.includes("tidak")) return "tidakberminat"
  if (h === "pending" || h === "") return "pending"
  return "default"
}

export function computeStats(leads: LeadBase[]): Stats {
  return {
    totalPotensi: leads.reduce((sum, l) => sum + (Number(l.potensi_nominal) || 0), 0),
    totalRealisasi: leads.reduce((sum, l) => sum + (Number(l.closing_tabungan) || 0), 0),
    totalLeads: leads.length,
    totalFU: leads.filter((l) => l.status_fu?.toLowerCase() === "sudah").length,
    totalClosing: leads.filter((l) => l.hasil_fu?.toLowerCase().includes("closing")).length,
    totalNeedFU: leads.filter(
      (l) =>
        l.hasil_fu?.toLowerCase().includes("need") ||
        l.hasil_fu?.toLowerCase().includes("follow")
    ).length,
    totalTakeOut: leads.filter((l) => l.hasil_fu?.toLowerCase() === "take out").length,
    totalTidakBerminat: leads.filter((l) => l.hasil_fu?.toLowerCase() === "tidak berminat").length,
    totalBelumFU: leads.filter((l) => !l.status_fu || l.status_fu?.toLowerCase() === "belum").length,
  }
}

export const LEADS_TYPE_INTENSIFIKASI = [
  "Everhigh",
  "Value Chain K1",
  "Funding Debitur SME <30%",
  "Leakage Tabungan",
  "Uplift Merchant",
  "RTW Cakra",
  "RTW Owner Merchant",
  "RTW MM100",
  "Teknikal RDPU",
  "Top Up Eksisting",
  "2nd Account",
  "Payroll Mitra Eksisting",
]

export const LEADS_TYPE_EKSTENSIFIKASI = [
  "Leakage Tabungan",
  "Value Chain K1",
  "New Merchant",
  "Bottom Up",
  "Akuisisi VC",
]

export const TIGA_P_OPTIONS = ["Pebisnis", "Prioritas", "Payroll"]

export const HASIL_FU_OPTIONS = [
  "Pending",
  "Need Follow Up",
  "Closing",
  "Take Out",
  "Tidak Berminat",
]

export const KETERANGAN_OPTIONS = [
  "Program/Promosi",
  "Relationship/Negosiasi",
  "Product Development",
]

export function buildGoogleMapsUrl(namaPerusahaan?: string, alamat?: string): string {
  const parts = [namaPerusahaan, alamat].filter(Boolean).join(", ")
  if (!parts) return ""
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts)}`
}
