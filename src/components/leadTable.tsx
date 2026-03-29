import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatNominal, formatDate, calcProgress, hasilFUVariant } from "@/lib/utils"
import { Eye, Edit3, Phone, Mail, ChevronUp, ChevronDown } from "lucide-react"
import type { LeadBase } from "@/types"

interface LeadTableProps {
  data: LeadBase[]
  tabType: "intensification" | "extensification"
  onView: (lead: LeadBase) => void
  onEdit: (lead: LeadBase) => void
  emptyMsg?: string
}

type SortDir = "asc" | "desc" | null
type SortKey = keyof LeadBase | ""

function SortIcon({ dir }: { dir: SortDir }) {
  if (!dir) return <span className="opacity-20 ml-1">↕</span>
  if (dir === "asc") return <ChevronUp size={10} className="inline ml-1 text-[#003f7d]" />
  return <ChevronDown size={10} className="inline ml-1 text-[#003f7d]" />
}

function tigaPVariant(tiga_p?: string) {
  if (tiga_p === "Pebisnis") return "pebisnis" as const
  if (tiga_p === "Prioritas") return "prioritas" as const
  if (tiga_p === "Payroll") return "payroll" as const
  return "secondary" as const
}

export default function LeadTable({
  data,
  tabType,
  onView,
  onEdit,
  emptyMsg = "Tidak ada data.",
}: LeadTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("")
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [page, setPage] = useState(1)
  const perPage = 15

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir("asc")
    } else if (sortDir === "asc") {
      setSortDir("desc")
    } else if (sortDir === "desc") {
      setSortKey("")
      setSortDir(null)
    } else {
      setSortDir("asc")
    }
    setPage(1)
  }

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data
    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey] ?? ""
      const bv = (b as Record<string, unknown>)[sortKey] ?? ""
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv), "id")
        : String(bv).localeCompare(String(av), "id")
    })
  }, [data, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / perPage)
  const paged = sorted.slice((page - 1) * perPage, page * perPage)

  const th = (label: string, key: SortKey) => (
    <TableHead
      className="cursor-pointer select-none hover:text-[#003f7d] whitespace-nowrap"
      onClick={() => toggleSort(key)}
    >
      {label}
      <SortIcon dir={sortKey === key ? sortDir : null} />
    </TableHead>
  )

  const parseWA = (kontak?: string) => {
    if (!kontak) return null
    const m = kontak.match(/(?:wame|wa\.me|whatsapp\.com)\/(\d+)/)
    return m ? m[1] : null
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {th("CIF", "cif" as SortKey)}
            {th("Nama Perusahaan", "nama_perusahaan")}
            <TableHead className="whitespace-nowrap">Kontak</TableHead>
            {th("3P", "tiga_p")}
            {th("Leads", "leads")}
            <TableHead className="text-right whitespace-nowrap">Potensi</TableHead>
            {th("Status FU", "status_fu")}
            <TableHead className="text-center whitespace-nowrap">Jml FU</TableHead>
            {th("Tgl FU", "terakhir_fu")}
            {th("Hasil FU", "hasil_fu")}
            <TableHead className="text-right whitespace-nowrap">Realisasi</TableHead>
            <TableHead className="whitespace-nowrap">Progress</TableHead>
            {tabType === "extensification" && (
              <TableHead className="whitespace-nowrap">No Rek</TableHead>
            )}
            <TableHead className="text-center whitespace-nowrap">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((item, idx) => {
            const hasilVar = hasilFUVariant(item.hasil_fu)
            const pct = calcProgress(
              Number(item.closing_tabungan) || 0,
              Number(item.potensi_nominal) || 1
            )
            const waNum = parseWA(item.kontak)
            const emailMatch = item.kontak?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)

            return (
              <TableRow
                key={item.id || idx}
                className="lead-row animate-fade-in-up"
                style={{ animationDelay: `${idx * 20}ms` }}
              >
                {/* CIF */}
                <TableCell className="font-mono text-[10px] text-slate-400 whitespace-nowrap">
                  {(item as Record<string, unknown>).cif as string || "—"}
                </TableCell>

                {/* Nama */}
                <TableCell className="max-w-[160px]">
                  <div
                    className="font-bold text-slate-800 text-xs truncate cursor-pointer hover:text-[#003f7d] transition-colors"
                    title={item.nama_perusahaan}
                    onClick={() => onView(item)}
                  >
                    {item.nama_perusahaan || "N/A"}
                  </div>
                  {item.alamat && (
                    <div className="text-[10px] text-slate-400 truncate italic mt-0.5" title={item.alamat}>
                      {item.alamat}
                    </div>
                  )}
                </TableCell>

                {/* Kontak */}
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {waNum && (
                      <a
                        href={`https://wa.me/${waNum}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-[#25D366] font-semibold hover:underline"
                      >
                        <Phone size={9} /> WA
                      </a>
                    )}
                    {emailMatch && (
                      <a
                        href={`mailto:${emailMatch[0]}`}
                        className="flex items-center gap-1 text-[10px] text-[#003f7d] font-semibold hover:underline"
                      >
                        <Mail size={9} /> Email
                      </a>
                    )}
                    {!waNum && !emailMatch && (
                      <span className="text-[10px] text-slate-300 italic">—</span>
                    )}
                  </div>
                </TableCell>

                {/* 3P */}
                <TableCell>
                  <Badge variant={tigaPVariant(item.tiga_p)} className="text-[9px]">
                    {item.tiga_p || "—"}
                  </Badge>
                </TableCell>

                {/* Leads */}
                <TableCell className="max-w-[120px]">
                  <span className="text-[10px] text-slate-600 font-medium leading-tight block truncate" title={item.leads}>
                    {item.leads || "—"}
                  </span>
                </TableCell>

                {/* Potensi */}
                <TableCell className="text-right font-mono font-bold text-[#003f7d] text-xs whitespace-nowrap">
                  {formatNominal(Number(item.potensi_nominal))}
                </TableCell>

                {/* Status FU */}
                <TableCell>
                  <Badge
                    variant={item.status_fu?.toLowerCase() === "sudah" ? "success" : "pending"}
                    className="text-[9px]"
                  >
                    {item.status_fu || "Belum"}
                  </Badge>
                </TableCell>

                {/* Jumlah FU */}
                <TableCell className="text-center text-xs font-bold text-slate-600">
                  {item.jumlah_fu || 0}×
                </TableCell>

                {/* Terakhir FU */}
                <TableCell className="text-[10px] text-slate-500 whitespace-nowrap">
                  {formatDate(item.terakhir_fu)}
                </TableCell>

                {/* Hasil FU */}
                <TableCell>
                  <Badge variant={hasilVar} className="text-[9px]">
                    {item.hasil_fu || "Pending"}
                  </Badge>
                </TableCell>

                {/* Realisasi */}
                <TableCell className="text-right font-mono font-bold text-[#00a651] text-xs whitespace-nowrap">
                  {item.closing_tabungan
                    ? formatNominal(Number(item.closing_tabungan))
                    : "—"}
                </TableCell>

                {/* Progress */}
                <TableCell className="min-w-[90px]">
                  <div className="flex items-center gap-1.5">
                    <Progress
                      value={pct}
                      className="h-1.5 flex-1"
                      barClassName={
                        pct >= 80
                          ? "bg-[#00a651]"
                          : pct >= 40
                          ? "bg-[#f5a623]"
                          : "bg-rose-500"
                      }
                    />
                    <span className="text-[9px] font-bold text-slate-400 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </TableCell>

                {/* No Rek (Ekstensifikasi only) */}
                {tabType === "extensification" && (
                  <TableCell className="font-mono text-[10px] text-slate-400">
                    {(item as Record<string, unknown>).no_rek as string || "—"}
                  </TableCell>
                )}

                {/* Actions */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(item)}
                      className="h-7 w-7 text-slate-400 hover:text-[#003f7d] hover:bg-[#e8f0f9]"
                      title="Lihat detail"
                    >
                      <Eye size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="h-7 w-7 text-slate-400 hover:text-[#f5a623] hover:bg-[#fef3dc]"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Empty state */}
      {paged.length === 0 && (
        <div className="py-20 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-slate-400 font-medium">{emptyMsg}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50">
          <span className="text-xs text-slate-400">
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, sorted.length)} dari{" "}
            {sorted.length} leads
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs"
            >
              ‹ Prev
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className={`text-xs w-8 ${p === page ? "bg-[#003f7d]" : ""}`}
                >
                  {p}
                </Button>
              )
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-xs"
            >
              Next ›
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
