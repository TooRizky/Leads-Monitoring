import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatNominal, calcProgress } from "@/lib/utils"
import type { LeadBase } from "@/types"

interface ProgressSectionProps {
  intensificationData: LeadBase[]
  extensificationData: LeadBase[]
}

function groupByLeads(data: LeadBase[]) {
  const map: Record<string, { count: number; potensi: number; closing: number; fu: number }> = {}
  for (const d of data) {
    const key = d.leads || "Lainnya"
    if (!map[key]) map[key] = { count: 0, potensi: 0, closing: 0, fu: 0 }
    map[key].count++
    map[key].potensi += Number(d.potensi_nominal) || 0
    map[key].closing += Number(d.closing_tabungan) || 0
    if (d.status_fu?.toLowerCase() === "sudah") map[key].fu++
  }
  return Object.entries(map)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.potensi - a.potensi)
}

function groupBy3P(data: LeadBase[]) {
  const map: Record<string, { count: number; potensi: number; closing: number }> = {}
  for (const d of data) {
    const key = d.tiga_p || "Lainnya"
    if (!map[key]) map[key] = { count: 0, potensi: 0, closing: 0 }
    map[key].count++
    map[key].potensi += Number(d.potensi_nominal) || 0
    map[key].closing += Number(d.closing_tabungan) || 0
  }
  return Object.entries(map)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.potensi - a.potensi)
}

const BAR_COLORS: Record<string, string> = {
  Everhigh:           "bg-[#003f7d]",
  "Value Chain K1":   "bg-[#005299]",
  "Leakage Tabungan": "bg-[#f5a623]",
  "Top Up Eksisting": "bg-violet-600",
  "Teknikal RDPU":    "bg-indigo-500",
  "RTW Cakra":        "bg-cyan-600",
  "Funding Debitur SME <30%": "bg-teal-600",
  "Uplift Merchant":  "bg-amber-500",
  Pebisnis:  "bg-[#003f7d]",
  Prioritas: "bg-[#f5a623]",
  Payroll:   "bg-indigo-600",
}

function getColor(key: string) {
  return BAR_COLORS[key] || "bg-slate-400"
}

export default function ProgressSection({ intensificationData, extensificationData }: ProgressSectionProps) {
  const allData = [...intensificationData, ...extensificationData]
  const byLeads = groupByLeads(allData)
  const by3P = groupBy3P(allData)
  const totalPotensiAll = allData.reduce((s, d) => s + (Number(d.potensi_nominal) || 0), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* BY LEADS TYPE */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Progress by Leads Type
            </p>
            <h3 className="font-bold text-slate-800 text-sm mt-0.5">Distribusi Potensi</h3>
          </div>
          <span className="text-[10px] font-bold text-[#003f7d] bg-[#e8f0f9] px-2.5 py-1 rounded-lg">
            {allData.length} leads
          </span>
        </div>
        <div className="space-y-4">
          {byLeads.slice(0, 8).map((item) => {
            const pct = calcProgress(item.potensi, totalPotensiAll)
            const fuPct = calcProgress(item.fu, item.count)
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-[10px] text-slate-400">{item.count} leads</span>
                    <span className="text-[10px] font-bold text-[#003f7d] w-16 text-right">
                      {formatNominal(item.potensi)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Progress
                    value={pct}
                    barClassName={getColor(item.name)}
                    className="h-2 flex-1"
                  />
                </div>
                {/* FU sub-bar */}
                <div className="mt-1 flex items-center gap-1.5">
                  <Progress
                    value={fuPct}
                    barClassName="bg-emerald-400"
                    className="h-1 flex-1 bg-slate-100"
                  />
                  <span className="text-[9px] text-emerald-600 font-semibold w-14 text-right">
                    {item.fu}/{item.count} FU ({fuPct}%)
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* BY 3P SEGMENT */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Progress by Segmen 3P
            </p>
            <h3 className="font-bold text-slate-800 text-sm mt-0.5">Komposisi Nasabah</h3>
          </div>
        </div>

        {/* Stacked bar */}
        <div className="h-6 rounded-xl overflow-hidden flex mb-5">
          {by3P.map((s) => {
            const w = calcProgress(s.potensi, totalPotensiAll)
            return (
              <div
                key={s.name}
                className={`${getColor(s.name)} h-full transition-all duration-700`}
                style={{ width: `${w}%` }}
                title={`${s.name}: ${formatNominal(s.potensi)}`}
              />
            )
          })}
        </div>

        <div className="space-y-4">
          {by3P.map((s) => {
            const pct = calcProgress(s.potensi, totalPotensiAll)
            const closingPct = calcProgress(s.closing, s.potensi)
            return (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-sm ${getColor(s.name)}`} />
                    <span className="text-xs font-semibold text-slate-700">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400">{s.count} leads</span>
                    <span className="text-[10px] font-bold text-[#003f7d] w-16 text-right">
                      {formatNominal(s.potensi)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{pct}%</span>
                  </div>
                </div>
                <Progress value={pct} barClassName={getColor(s.name)} className="h-2" />
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400">
                    Realisasi: {formatNominal(s.closing)}
                  </span>
                  <span className={`text-[9px] font-bold ${closingPct >= 50 ? "text-emerald-600" : "text-amber-600"}`}>
                    {closingPct}% closing
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
