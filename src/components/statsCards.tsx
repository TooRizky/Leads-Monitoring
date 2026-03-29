import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatNominal, calcProgress, computeStats, cn } from "@/lib/utils"
import type { LeadIntensifikasi, LeadEktensifikasi } from "@/types"
import {
  Target,
  CheckCircle2,
  Users,
  PhoneCall,
  TrendingUp,
  Clock,
  XCircle,
  MinusCircle,
} from "lucide-react"

type StatsFilterType = "all" | "intensifikasi" | "ekstensifikasi"

interface StatsCardsProps {
  intensificationData: LeadIntensifikasi[]
  extensificationData: LeadEktensifikasi[]
  statsFilter: StatsFilterType
  onStatsFilterChange: (filter: StatsFilterType) => void
}

const FILTER_OPTIONS: {
  value: StatsFilterType
  label: string
  activeBg: string
  activeText: string
  dot: string[]
}[] = [
  {
    value: "all",
    label: "Semua",
    activeBg: "bg-[#003f7d]",
    activeText: "text-white",
    dot: ["#003f7d", "#f5a623"],
  },
  {
    value: "intensifikasi",
    label: "Intensifikasi",
    activeBg: "bg-[#003f7d]",
    activeText: "text-white",
    dot: ["#003f7d"],
  },
  {
    value: "ekstensifikasi",
    label: "Ekstensifikasi",
    activeBg: "bg-[#f5a623]",
    activeText: "text-white",
    dot: ["#f5a623"],
  },
]

export default function StatsCards({
  intensificationData,
  extensificationData,
  statsFilter,
  onStatsFilterChange,
}: StatsCardsProps) {
  const allLeads = [...intensificationData, ...extensificationData]
  const intStats = computeStats(intensificationData)
  const extStats = computeStats(extensificationData)
  const allStats = computeStats(allLeads)

  const activeStats =
    statsFilter === "intensifikasi"
      ? intStats
      : statsFilter === "ekstensifikasi"
      ? extStats
      : allStats

  const showBreakdown = statsFilter === "all"

  const fuPct = calcProgress(activeStats.totalFU, activeStats.totalLeads)
  const closingPct = calcProgress(activeStats.totalClosing, activeStats.totalLeads)
  const realisasiPct = calcProgress(activeStats.totalRealisasi, activeStats.totalPotensi)

  const cards = [
    {
      label: "Total Potensi",
      value: formatNominal(activeStats.totalPotensi),
      sub: showBreakdown
        ? `Int: ${formatNominal(intStats.totalPotensi)} · Eks: ${formatNominal(extStats.totalPotensi)}`
        : statsFilter === "intensifikasi"
        ? "Data Intensifikasi"
        : "Data Ekstensifikasi",
      icon: Target,
      accent: "#003f7d",
      accentLight: "#e8f0f9",
      progress: null as null | { value: number; bar: string },
    },
    {
      label: "Realisasi / Closing",
      value: formatNominal(activeStats.totalRealisasi),
      sub: `${realisasiPct}% dari potensi`,
      icon: CheckCircle2,
      accent: "#00a651",
      accentLight: "#e6f7ee",
      progress: { value: realisasiPct, bar: "bg-[#00a651]" },
      badge: realisasiPct >= 50 ? "ON TRACK" : "BEHIND",
      badgeOk: realisasiPct >= 50,
    },
    {
      label: "Total Leads",
      value: String(activeStats.totalLeads),
      sub: showBreakdown
        ? `Int: ${intStats.totalLeads} · Eks: ${extStats.totalLeads}`
        : statsFilter === "intensifikasi"
        ? "Data Intensifikasi"
        : "Data Ekstensifikasi",
      icon: Users,
      accent: "#f5a623",
      accentLight: "#fef3dc",
      progress: null as null | { value: number; bar: string },
    },
    {
      label: "Sudah Follow Up",
      value: String(activeStats.totalFU),
      sub: `${fuPct}% dari total leads`,
      icon: PhoneCall,
      accent: "#7c3aed",
      accentLight: "#f3eeff",
      progress: { value: fuPct, bar: "bg-violet-600" },
    },
    {
      label: "Closing",
      value: String(activeStats.totalClosing),
      sub: `${closingPct}% closing rate`,
      icon: TrendingUp,
      accent: "#00a651",
      accentLight: "#e6f7ee",
      progress: { value: closingPct, bar: "bg-[#00a651]" },
    },
    {
      label: "Need Follow Up",
      value: String(activeStats.totalNeedFU),
      sub: `Perlu action segera`,
      icon: Clock,
      accent: "#f5a623",
      accentLight: "#fef3dc",
      progress: null as null | { value: number; bar: string },
    },
    {
      label: "Belum FU",
      value: String(activeStats.totalBelumFU),
      sub: `Belum dikontak`,
      icon: Users,
      accent: "#64748b",
      accentLight: "#f1f5f9",
      progress: null as null | { value: number; bar: string },
    },
    {
      label: "Take Out",
      value: String(activeStats.totalTakeOut),
      sub: `Dikeluarkan dari pipeline`,
      icon: XCircle,
      accent: "#dc2626",
      accentLight: "#fef2f2",
      progress: null as null | { value: number; bar: string },
    },
    {
      label: "Tidak Berminat",
      value: String(activeStats.totalTidakBerminat),
      sub: `Nasabah menolak`,
      icon: MinusCircle,
      accent: "#9f1239",
      accentLight: "#fff1f2",
      progress: null as null | { value: number; bar: string },
    },
  ]

  const totalCount =
    statsFilter === "intensifikasi"
      ? intensificationData.length
      : statsFilter === "ekstensifikasi"
      ? extensificationData.length
      : allLeads.length

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
          Tampilkan:
        </span>

        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
          {FILTER_OPTIONS.map((opt) => {
            const isActive = statsFilter === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => onStatsFilterChange(opt.value)}
                className={[
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 tracking-wide",
                  isActive
                    ? `${opt.activeBg} ${opt.activeText} shadow-sm`
                    : "text-slate-500 hover:bg-slate-100",
                ].join(" ")}
              >
                <span className="inline-flex gap-0.5">
                  {opt.dot.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color, opacity: isActive ? 1 : 0.45 }}
                    />
                  ))}
                </span>
                {opt.label}
              </button>
            )
          })}
        </div>

        <span className="text-[10px] text-slate-400 font-medium">
          {totalCount.toLocaleString("id-ID")} leads
        </span>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon
          return (
            <Card
              key={i}
              className={cn("p-4 relative overflow-hidden animate-fade-in-up")}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 w-1 h-full rounded-l-2xl"
                style={{ background: c.accent }}
              />

              {/* Icon */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                style={{ background: c.accentLight }}
              >
                <Icon size={14} style={{ color: c.accent }} />
              </div>

              {/* Label */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 leading-tight">
                {c.label}
              </p>

              {/* Value */}
              <div className="flex items-end gap-1.5 mb-0.5 flex-wrap">
                <p className="text-xl font-extrabold tracking-tight" style={{ color: c.accent }}>
                  {c.value}
                </p>
                {(c as any).badge && (
                  <Badge
                    variant={(c as any).badgeOk ? "success" : "takeout"}
                    className="mb-0.5 text-[9px]"
                  >
                    {(c as any).badge}
                  </Badge>
                )}
              </div>

              {/* Sub */}
              <p className="text-[10px] text-slate-400 font-medium leading-tight">{c.sub}</p>

              {/* Progress */}
              {c.progress && (
                <div className="mt-2.5">
                  <Progress
                    value={c.progress.value}
                    barClassName={c.progress.bar}
                    className="h-1.5"
                  />
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
