import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCcw, FileDown, MapPin, TrendingUp } from "lucide-react"
import * as XLSX from "xlsx"
import type { LeadIntensifikasi, LeadEktensifikasi } from "@/types"

interface HeaderProps {
  intensificationData?: LeadIntensifikasi[]
  extensificationData?: LeadEktensifikasi[]
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function DashboardHeader({
  intensificationData = [],
  extensificationData = [],
  onRefresh,
  isRefreshing = false,
}: HeaderProps) {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
      setDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const handleExport = () => {
    const wb = XLSX.utils.book_new()
    const ws1 = XLSX.utils.json_to_sheet(intensificationData)
    XLSX.utils.book_append_sheet(wb, ws1, "Intensifikasi")
    const ws2 = XLSX.utils.json_to_sheet(extensificationData)
    XLSX.utils.book_append_sheet(wb, ws2, "Ekstensifikasi")
    XLSX.writeFile(wb, `Leads_KCP_GrandSlipiTower_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#003f7d]/10">
      {/* LEFT: Branding */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#003f7d] flex items-center justify-center shadow-lg shadow-[#003f7d]/25">
          <TrendingUp size={22} className="text-[#f5a623]" strokeWidth={2.5} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#003f7d]">
              Leads Monitoring
            </h1>
            <Badge variant="default" className="hidden md:inline-flex text-[9px] mt-0.5">
              2026
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin size={11} className="text-[#003f7d]" />
            <p className="text-[11px] font-medium tracking-wide">
              KCP Jakarta Grand Slipi Tower
              <span className="mx-1.5 text-slate-300">·</span>
              Area Greenville 16521
            </p>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{date}</p>
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="border border-slate-200 text-slate-500 hover:text-[#003f7d] hover:border-[#003f7d]/30"
          title="Refresh data"
        >
          <RefreshCcw size={15} className={isRefreshing ? "animate-spin" : ""} />
        </Button>

        {/* Export Button */}
        <Button
          variant="secondary"
          size="md"
          onClick={handleExport}
          className="bg-[#00a651] hover:bg-[#008f45] text-white shadow-sm shadow-[#00a651]/20 text-xs"
        >
          <FileDown size={14} />
          <span className="hidden sm:inline font-bold">EXPORT XLSX</span>
        </Button>

        {/* Live Clock */}
        <div className="flex flex-col items-end gap-1 px-4 py-2.5 bg-white rounded-2xl border border-[#003f7d]/10 shadow-sm min-w-[120px]">
          <Badge
            variant="success"
            className="flex gap-1 items-center text-[9px] px-1.5 py-0.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE SYNC
          </Badge>
          <span className="text-[13px] font-bold font-mono text-[#003f7d] leading-none tracking-tight">
            {time}
            <span className="text-[9px] font-normal text-slate-400 ml-1">WIB</span>
          </span>
        </div>
      </div>
    </div>
  )
}
