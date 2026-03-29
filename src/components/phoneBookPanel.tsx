import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  formatNominal,
  formatDate,
  formatDateTime,
  calcProgress,
  hasilFUVariant,
  buildGoogleMapsUrl,
} from "@/lib/utils"
import {
  X,
  Phone,
  Mail,
  Linkedin,
  MapPin,
  Building2,
  User,
  TrendingUp,
  Calendar,
  MessageSquare,
  ExternalLink,
  Edit3,
  Navigation,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { LeadBase, LeadChangeLog } from "@/types"
import { supabase } from "@/lib/supabase"

interface PhoneBookPanelProps {
  lead: LeadBase | null
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  tabType: "intensification" | "extensification"
}

function ContactChip({
  icon: Icon,
  label,
  href,
  color,
}: {
  icon: React.ElementType
  label: string
  href?: string
  color: string
}) {
  const content = (
    <div className="contact-chip text-white" style={{ background: color }}>
      <Icon size={12} />
      <span className="truncate max-w-[140px]">{label}</span>
    </div>
  )
  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  return content
}

export default function PhoneBookPanel({
  lead,
  isOpen,
  onClose,
  onEdit,
  tabType,
}: PhoneBookPanelProps) {
  const [changeLogs, setChangeLogs] = useState<LeadChangeLog[]>([])
  const [logsOpen, setLogsOpen] = useState(false)

  useEffect(() => {
    if (!lead || !isOpen) {
      setChangeLogs([])
      setLogsOpen(false)
      return
    }
    const table =
      tabType === "intensification" ? "leads_intensifikasi" : "leads_ekstensifikasi"
    supabase
      .from("lead_change_logs")
      .select("*")
      .eq("table_name", table)
      .eq("lead_id", lead.id)
      .order("changed_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setChangeLogs(data as LeadChangeLog[])
      })
  }, [lead, isOpen, tabType])

  if (!isOpen || !lead) return null

  const hasilVariant = hasilFUVariant(lead.hasil_fu)
  const closingPct = calcProgress(
    Number(lead.closing_tabungan) || 0,
    Number(lead.potensi_nominal) || 1
  )

  const kontakRaw = lead.kontak || ""
  const waMatch = kontakRaw.match(/(?:wame|wa\.me|whatsapp\.com)\/(\d+)/)
  const waNum = waMatch ? waMatch[1] : null
  const emailMatch = kontakRaw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  const emailAddr = emailMatch ? emailMatch[0] : lead.email || null
  const liMatch = kontakRaw.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s\n]+/)
  const liUrl = liMatch ? liMatch[0] : lead.linkedin || null

  const mapsUrl = lead.nama_perusahaan
    ? buildGoogleMapsUrl(lead.nama_perusahaan, lead.alamat)
    : null
  const mapsQueryHint = [lead.nama_perusahaan, lead.alamat].filter(Boolean).join(", ")

  const picLogs = changeLogs.filter((l) => l.field_name === "pic")

  const leadRecord = lead as unknown as Record<string, unknown>
  const cifStr = leadRecord.cif ? String(leadRecord.cif) : ""
  const noRekStr = leadRecord.no_rek ? String(leadRecord.no_rek) : ""

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] modal-overlay"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col modal-content overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-[#003f7d] to-[#005299] text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Building2 size={18} className="text-[#f5a623]" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                  {tabType === "intensification" ? "Intensifikasi" : "Ekstensifikasi"} ·{" "}
                  {lead.leads}
                </p>
                <p className="text-[10px] font-semibold opacity-80">
                  {lead.tiga_p || "—"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                onClick={onEdit}
                className="bg-[#f5a623] hover:bg-[#e8961e] text-white w-8 h-8 rounded-xl"
              >
                <Edit3 size={14} />
              </Button>
              <Button
                size="icon"
                onClick={onClose}
                className="bg-white/15 hover:bg-white/25 text-white w-8 h-8 rounded-xl"
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          <h2 className="text-lg font-extrabold tracking-tight leading-tight mb-3">
            {lead.nama_perusahaan || "—"}
          </h2>

          <div className="flex flex-wrap gap-2">
            {cifStr && (
              <span className="text-[10px] font-mono bg-white/15 px-2.5 py-1 rounded-lg">
                CIF: {cifStr}
              </span>
            )}
            {noRekStr && (
              <span className="text-[10px] font-mono bg-white/15 px-2.5 py-1 rounded-lg">
                No Rek: {noRekStr}
              </span>
            )}
            <Badge variant={hasilVariant} className="text-[9px]">
              {lead.hasil_fu || "Pending"}
            </Badge>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-6">
          {/* Kontak */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Kontak
            </p>
            <div className="flex flex-wrap gap-2">
              {waNum ? (
                <ContactChip
                  icon={Phone}
                  label={`+${waNum}`}
                  href={`https://wa.me/${waNum}`}
                  color="#25D366"
                />
              ) : (
                <span className="text-xs text-slate-400 italic">No WA</span>
              )}
              {emailAddr && (
                <ContactChip
                  icon={Mail}
                  label={emailAddr}
                  href={`mailto:${emailAddr}`}
                  color="#003f7d"
                />
              )}
              {liUrl && (
                <ContactChip
                  icon={Linkedin}
                  label="LinkedIn"
                  href={liUrl}
                  color="#0077b5"
                />
              )}
            </div>
          </div>

          {/* Alamat + Google Maps */}
          {(lead.alamat || mapsUrl) && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Alamat
              </p>
              <div className="flex gap-2 items-start">
                <MapPin size={13} className="text-[#003f7d] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  {lead.alamat ? (
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{lead.alamat}</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mb-2">Alamat belum diisi</p>
                  )}
                  {mapsUrl && (
                    <div className="space-y-1.5">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#003f7d] hover:bg-[#002d5c] transition-colors px-3 py-1.5 rounded-lg"
                      >
                        <Navigation size={11} />
                        Buka di Google Maps
                        <ExternalLink size={10} className="opacity-70" />
                      </a>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        🔍 Query: <span className="text-slate-500 font-medium">{mapsQueryHint}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Potensi & Realisasi */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Potensi vs Realisasi
            </p>
            <div className="bg-[#f0f5fb] rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Potensi Nominal</span>
                <span className="text-sm font-extrabold text-[#003f7d]">
                  {formatNominal(Number(lead.potensi_nominal))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Realisasi Closing</span>
                <span className="text-sm font-extrabold text-[#00a651]">
                  {formatNominal(Number(lead.closing_tabungan))}
                </span>
              </div>
              <Progress
                value={closingPct}
                barClassName={
                  closingPct >= 80 ? "bg-[#00a651]" : closingPct >= 40 ? "bg-[#f5a623]" : "bg-rose-500"
                }
                className="h-2.5"
              />
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Pencapaian</span>
                <span className={`font-bold ${closingPct >= 50 ? "text-[#00a651]" : "text-amber-600"}`}>
                  {closingPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Follow Up Activity */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Follow Up Activity
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-600">Status FU</span>
                </div>
                <Badge variant={lead.status_fu?.toLowerCase() === "sudah" ? "success" : "pending"}>
                  {lead.status_fu || "Belum"}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2.5 px-4 bg-[#e8f0f9] rounded-xl border border-[#003f7d]/10">
                <div className="flex items-center gap-2">
                  <MessageSquare size={12} className="text-[#003f7d]" />
                  <span className="text-xs font-semibold text-[#003f7d]">Jumlah FU</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-[#003f7d]">
                    {lead.jumlah_fu || 0}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">× kontak</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-600">Terakhir FU</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {formatDate(lead.terakhir_fu)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 px-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <TrendingUp size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-600">Hasil FU</span>
                </div>
                <Badge variant={hasilVariant}>{lead.hasil_fu || "Pending"}</Badge>
              </div>
            </div>
          </div>

          {/* PIC Sales */}
          {lead.pic && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                PIC Sales
              </p>
              <div className="flex items-center gap-2 py-2 px-4 bg-[#e8f0f9] rounded-xl">
                <User size={12} className="text-[#003f7d]" />
                <span className="text-xs font-semibold text-[#003f7d]">{lead.pic}</span>
              </div>
            </div>
          )}

          {/* Keterangan / Action Detail */}
          {lead.keterangan && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Detail Aksi / Keterangan
              </p>
              <div className="flex flex-wrap gap-2">
                {lead.keterangan
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-[#003f7d]/10 text-[#003f7d] border border-[#003f7d]/15"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Change Log (PIC Trace) */}
          <div>
            <button
              onClick={() => setLogsOpen((v) => !v)}
              className="flex items-center gap-2 w-full text-left group"
            >
              <History size={12} className="text-slate-400 group-hover:text-[#003f7d] transition-colors" />
              <p className="text-[10px] font-bold text-slate-400 group-hover:text-[#003f7d] uppercase tracking-widest transition-colors flex-1">
                Log Perubahan PIC
              </p>
              <span className="text-[10px] text-slate-400 font-medium">
                {picLogs.length} entri
              </span>
              {logsOpen ? (
                <ChevronUp size={12} className="text-slate-400" />
              ) : (
                <ChevronDown size={12} className="text-slate-400" />
              )}
            </button>

            {logsOpen && (
              <div className="mt-3 space-y-2">
                {picLogs.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic px-3">Belum ada perubahan PIC</p>
                ) : (
                  picLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-50 rounded-xl p-3 border border-slate-100"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          PIC diubah
                        </span>
                        <span className="text-[10px] text-slate-400 ml-auto">
                          {formatDateTime(log.changed_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="line-through text-slate-400">
                          {log.old_value || "(kosong)"}
                        </span>
                        <span className="text-slate-300">→</span>
                        <span className="font-semibold text-[#003f7d]">
                          {log.new_value || "(kosong)"}
                        </span>
                      </div>
                      {log.changed_by && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          Oleh: {log.changed_by}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
