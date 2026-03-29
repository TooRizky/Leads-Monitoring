import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Save, Building2, Phone, MapPin, TrendingUp, Tag } from "lucide-react"
import {
  TIGA_P_OPTIONS,
  HASIL_FU_OPTIONS,
  LEADS_TYPE_INTENSIFIKASI,
  LEADS_TYPE_EKSTENSIFIKASI,
  KETERANGAN_OPTIONS,
} from "@/lib/utils"
import type { LeadBase } from "@/types"

interface LeadFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Record<string, unknown>, oldPic?: string) => Promise<void>
  initialData?: LeadBase | null
  tabType: "intensification" | "extensification"
}

const inputCls =
  "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#003f7d]/20 focus:border-[#003f7d] outline-none transition-all placeholder:text-slate-300"
const labelCls =
  "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-0.5"
const selectCls =
  "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#003f7d]/20 focus:border-[#003f7d] outline-none cursor-pointer appearance-none"

function Field({
  label,
  children,
  className = "",
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

function parseKeteranganTags(keterangan: string): string[] {
  return keterangan
    .split(",")
    .map((s) => s.trim())
    .filter((s) => KETERANGAN_OPTIONS.includes(s as (typeof KETERANGAN_OPTIONS)[number]))
}

function needsDetailChips(hasilFU: string): boolean {
  const h = hasilFU.toLowerCase()
  return h.includes("need") || h.includes("follow") || h.includes("closing")
}

function isDimmed(hasilFU: string): boolean {
  const h = hasilFU.toLowerCase()
  return h.includes("take") || h.includes("tidak")
}

export default function LeadForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  tabType,
}: LeadFormProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const isEdit = !!initialData

  useEffect(() => {
    if (initialData) {
      const mapped: Record<string, string> = {}
      for (const [k, v] of Object.entries(initialData)) {
        mapped[k] = v != null ? String(v) : ""
      }
      setForm(mapped)
      const tags = parseKeteranganTags(mapped.keterangan || "")
      setSelectedTags(tags.length > 0 ? tags : [])
    } else {
      setForm({
        tiga_p: "Pebisnis",
        leads: tabType === "intensification" ? "Everhigh" : "Leakage Tabungan",
        status_fu: "Belum",
        hasil_fu: "Pending",
      })
      setSelectedTags([])
    }
  }, [initialData, isOpen, tabType])

  if (!isOpen) return null

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const hasilFU = form.hasil_fu || "Pending"
  const showChips = needsDetailChips(hasilFU)
  const dimKeterangan = isDimmed(hasilFU)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: Record<string, unknown> = { ...form }
      if (payload.potensi_nominal) payload.potensi_nominal = Number(payload.potensi_nominal)
      if (payload.closing_tabungan) payload.closing_tabungan = Number(payload.closing_tabungan)
      if (payload.jumlah_fu) payload.jumlah_fu = Number(payload.jumlah_fu)

      if (showChips) {
        payload.keterangan = selectedTags.join(", ")
      }

      const oldPic = initialData?.pic || ""
      await onSave(payload, oldPic)
    } finally {
      setSaving(false)
    }
  }

  const leadsOptions =
    tabType === "intensification" ? LEADS_TYPE_INTENSIFIKASI : LEADS_TYPE_EKSTENSIFIKASI

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
        <Card className="modal-content w-full max-w-2xl shadow-2xl border border-[#003f7d]/10 my-4">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-[#003f7d] to-[#005299] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                <Building2 size={18} className="text-[#f5a623]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {isEdit ? "Edit Data Nasabah" : "Tambah Nasabah Baru"}
                </h3>
                <p className="text-[10px] text-white/60 font-semibold uppercase tracking-widest">
                  {tabType === "intensification" ? "Intensifikasi" : "Ekstensifikasi"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors mt-0.5"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* SECTION: Identitas */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={13} className="text-[#003f7d]" />
                <span className="text-[10px] font-bold text-[#003f7d] uppercase tracking-widest">
                  Identitas Perusahaan
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nama Perusahaan / Nasabah *" className="md:col-span-2">
                  <input
                    required
                    className={inputCls}
                    placeholder="PT / CV / Nama Nasabah"
                    value={form.nama_perusahaan || ""}
                    onChange={(e) => set("nama_perusahaan", e.target.value)}
                  />
                </Field>
                {tabType === "intensification" && (
                  <Field label="CIF">
                    <input
                      className={inputCls + " font-mono"}
                      placeholder="CIF Number"
                      value={form.cif || ""}
                      onChange={(e) => set("cif", e.target.value)}
                    />
                  </Field>
                )}
                {tabType === "extensification" && (
                  <>
                    <Field label="CIF (jika closing)">
                      <input
                        className={inputCls + " font-mono"}
                        placeholder="Diisi setelah closing"
                        value={form.cif || ""}
                        onChange={(e) => set("cif", e.target.value)}
                      />
                    </Field>
                    <Field label="No Rekening (jika closing)">
                      <input
                        className={inputCls + " font-mono"}
                        placeholder="Diisi setelah closing"
                        value={form.no_rek || ""}
                        onChange={(e) => set("no_rek", e.target.value)}
                      />
                    </Field>
                  </>
                )}
                <Field label="3P Segmen">
                  <select
                    className={selectCls}
                    value={form.tiga_p || "Pebisnis"}
                    onChange={(e) => set("tiga_p", e.target.value)}
                  >
                    {TIGA_P_OPTIONS.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Leads Type">
                  <select
                    className={selectCls}
                    value={form.leads || leadsOptions[0]}
                    onChange={(e) => set("leads", e.target.value)}
                  >
                    {leadsOptions.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            {/* SECTION: Kontak */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Phone size={13} className="text-[#003f7d]" />
                <span className="text-[10px] font-bold text-[#003f7d] uppercase tracking-widest">
                  Kontak
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="No WA / Kontak (link atau nomor)">
                  <input
                    className={inputCls}
                    placeholder="https://wa.me/628xx atau 08xx"
                    value={form.kontak || ""}
                    onChange={(e) => set("kontak", e.target.value)}
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="email@perusahaan.com"
                    value={form.email || ""}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
                <Field label="LinkedIn URL">
                  <input
                    className={inputCls}
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedin || ""}
                    onChange={(e) => set("linkedin", e.target.value)}
                  />
                </Field>
                <Field label="PIC Sales">
                  <input
                    className={inputCls}
                    placeholder="Nama staff penanggung jawab"
                    value={form.pic || ""}
                    onChange={(e) => set("pic", e.target.value)}
                  />
                </Field>
                <Field label="Alamat Kantor" className="md:col-span-2">
                  <textarea
                    rows={2}
                    className={inputCls + " resize-none"}
                    placeholder="Jl. ..."
                    value={form.alamat || ""}
                    onChange={(e) => set("alamat", e.target.value)}
                  />
                </Field>
              </div>
            </div>

            {/* SECTION: Potensi & FU */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} className="text-[#003f7d]" />
                <span className="text-[10px] font-bold text-[#003f7d] uppercase tracking-widest">
                  Potensi & Follow Up
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Potensi Nominal (IDR)">
                  <input
                    type="number"
                    className={inputCls + " font-mono text-[#003f7d] font-bold"}
                    placeholder="0"
                    value={form.potensi_nominal || ""}
                    onChange={(e) => set("potensi_nominal", e.target.value)}
                  />
                </Field>
                <Field label="Closing Tabungan / Realisasi (IDR)">
                  <input
                    type="number"
                    className={inputCls + " font-mono text-[#00a651] font-bold"}
                    placeholder="0"
                    value={form.closing_tabungan || ""}
                    onChange={(e) => set("closing_tabungan", e.target.value)}
                  />
                </Field>
                <Field label="Status Follow Up">
                  <select
                    className={selectCls}
                    value={form.status_fu || "Belum"}
                    onChange={(e) => set("status_fu", e.target.value)}
                  >
                    <option value="Belum">Belum</option>
                    <option value="Sudah">Sudah</option>
                  </select>
                </Field>
                <Field label="Jumlah Follow Up (kali)">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    placeholder="0"
                    value={form.jumlah_fu || ""}
                    onChange={(e) => set("jumlah_fu", e.target.value)}
                  />
                </Field>
                <Field label="Tanggal Follow Up Terakhir">
                  <input
                    type="date"
                    className={inputCls}
                    value={form.terakhir_fu ? form.terakhir_fu.split("T")[0] : ""}
                    onChange={(e) => set("terakhir_fu", e.target.value)}
                  />
                </Field>
                <Field label="Hasil Follow Up">
                  <select
                    className={selectCls}
                    value={form.hasil_fu || "Pending"}
                    onChange={(e) => {
                      set("hasil_fu", e.target.value)
                      setSelectedTags([])
                    }}
                  >
                    {HASIL_FU_OPTIONS.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            {/* SECTION: Keterangan / Action Detail */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={13} className="text-[#003f7d]" />
                <span className="text-[10px] font-bold text-[#003f7d] uppercase tracking-widest">
                  Detail Aksi / Keterangan
                </span>
                {showChips && (
                  <span className="text-[10px] text-white bg-[#003f7d] px-2 py-0.5 rounded-full ml-auto">
                    pilih yang relevan
                  </span>
                )}
                {dimKeterangan && (
                  <span className="text-[10px] text-slate-400 ml-auto">opsional</span>
                )}
              </div>

              {showChips ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 mb-2">
                    Pilih kebutuhan support untuk nasabah ini:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {KETERANGAN_OPTIONS.map((opt) => {
                      const active = selectedTags.includes(opt)
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleTag(opt)}
                          className={[
                            "inline-flex items-center gap-1.5 text-[11px] font-semibold px-4 py-2 rounded-xl border-2 transition-all duration-150",
                            active
                              ? "bg-[#003f7d] border-[#003f7d] text-white shadow-sm shadow-[#003f7d]/20"
                              : "bg-white border-slate-200 text-slate-500 hover:border-[#003f7d]/40 hover:text-[#003f7d]",
                          ].join(" ")}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#f5a623]" : "bg-slate-300"}`}
                          />
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {selectedTags.length > 0 && (
                    <p className="text-[10px] text-[#003f7d] font-semibold mt-1">
                      Dipilih: {selectedTags.join(", ")}
                    </p>
                  )}
                </div>
              ) : (
                <div className={dimKeterangan ? "opacity-50" : ""}>
                  <textarea
                    rows={2}
                    className={inputCls + " resize-none"}
                    placeholder={
                      dimKeterangan
                        ? "Alasan tidak berminat / take out (opsional)"
                        : "Keterangan tambahan"
                    }
                    value={form.keterangan || ""}
                    onChange={(e) => set("keterangan", e.target.value)}
                  />
                  {dimKeterangan && (
                    <p className="text-[10px] text-slate-400 mt-1 ml-0.5">
                      Field ini opsional untuk status {hasilFU}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#003f7d] hover:bg-[#002d5c] h-11 text-xs font-bold tracking-wide gap-2"
              >
                <Save size={14} />
                {saving ? "MENYIMPAN..." : isEdit ? "UPDATE DATA" : "SIMPAN NASABAH"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="px-8 h-11 text-xs"
              >
                BATAL
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
