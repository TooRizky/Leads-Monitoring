// =================================================================
// types/index.ts — Type definitions for Mandiri Leads Monitoring
// =================================================================

export type HasilFU =
  | "Pending"
  | "Need Follow Up"
  | "Closing"
  | "Take Out"
  | "Tidak Berminat";

export type StatusFU = "Sudah" | "Belum";

export type TigaP = "Pebisnis" | "Prioritas" | "Payroll";

export type LeadsTypeIntens =
  | "Everhigh"
  | "Value Chain K1"
  | "Funding Debitur SME <30%"
  | "Leakage Tabungan"
  | "Uplift Merchant"
  | "RTW Cakra"
  | "RTW Owner Merchant"
  | "RTW MM100"
  | "Teknikal RDPU"
  | "Top Up Eksisting"
  | "2nd Account"
  | "Payroll Mitra Eksisting"
  | string;

export type LeadsTypeExtens =
  | "Leakage Tabungan"
  | "Value Chain K1"
  | "New Merchant"
  | "Bottom Up"
  | string;

export interface LeadBase {
  id: number;
  nama_perusahaan: string;
  kontak?: string;
  email?: string;
  linkedin?: string;
  wa?: string;
  alamat?: string;
  tiga_p?: string;
  leads?: string;
  potensi_nominal?: number;
  status_fu?: string;
  jumlah_fu?: number;
  terakhir_fu?: string;
  hasil_fu?: string;
  closing_tabungan?: number;
  keterangan?: string;
  pic?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LeadIntensifikasi extends LeadBase {
  cif?: string;
}

export interface LeadEktensifikasi extends LeadBase {
  cif?: string;
  no_rek?: string;
}

export type TabType = "intensification" | "extensification";

export interface Stats {
  totalPotensi: number;
  totalRealisasi: number;
  totalLeads: number;
  totalFU: number;
  totalClosing: number;
  totalNeedFU: number;
  totalTakeOut: number;
  totalTidakBerminat: number;
  totalBelumFU: number;
}

export interface FilterState {
  search: string;
  tigaP: string;
  leadsType: string;
  hasilFU: string;
}

export interface LeadChangeLog {
  id: number;
  table_name: string;
  lead_id: number;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_by?: string;
  changed_at: string;
}

export const KETERANGAN_OPTIONS = [
  "Program/Promosi",
  "Relationship/Negosiasi",
  "Product Development",
] as const;

export type KeteranganOption = typeof KETERANGAN_OPTIONS[number];
