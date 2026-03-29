import { Button } from "@/components/ui/button"
import { Search, X, Plus, SlidersHorizontal } from "lucide-react"
import { TIGA_P_OPTIONS, LEADS_TYPE_INTENSIFIKASI, LEADS_TYPE_EKSTENSIFIKASI, HASIL_FU_OPTIONS } from "@/lib/utils"
import type { FilterState } from "@/types"

interface FilterBarProps {
  filters: FilterState
  onFilterChange: (f: Partial<FilterState>) => void
  onClearFilters: () => void
  onAddNew: () => void
  tabType: "intensification" | "extensification"
  resultCount: number
  totalCount: number
}

export default function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  onAddNew,
  tabType,
  resultCount,
  totalCount,
}: FilterBarProps) {
  const hasFilter =
    filters.search || filters.tigaP || filters.leadsType || filters.hasilFU
  const leadsOptions =
    tabType === "intensification" ? LEADS_TYPE_INTENSIFIKASI : LEADS_TYPE_EKSTENSIFIKASI

  const selCls =
    "px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-[#003f7d]/20 focus:border-[#003f7d] outline-none cursor-pointer appearance-none transition-all"

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col gap-3">
        {/* Row 1: Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
              size={14}
            />
            <input
              type="text"
              placeholder="Cari nama perusahaan / nasabah..."
              className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#003f7d]/20 focus:border-[#003f7d] outline-none transition-all placeholder:text-slate-300"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Add Button */}
          <Button
            onClick={onAddNew}
            className="bg-[#003f7d] hover:bg-[#002d5c] text-white text-xs font-bold gap-2 px-5 shrink-0"
          >
            <Plus size={14} strokeWidth={3} />
            TAMBAH NASABAH
          </Button>
        </div>

        {/* Row 2: Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <SlidersHorizontal size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Filter:</span>
          </div>

          {/* 3P Filter */}
          <select
            className={selCls}
            value={filters.tigaP}
            onChange={(e) => onFilterChange({ tigaP: e.target.value })}
          >
            <option value="">Semua 3P</option>
            {TIGA_P_OPTIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          {/* Leads Type Filter */}
          <select
            className={selCls}
            value={filters.leadsType}
            onChange={(e) => onFilterChange({ leadsType: e.target.value })}
          >
            <option value="">Semua Leads Type</option>
            {leadsOptions.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          {/* Hasil FU Filter */}
          <select
            className={selCls}
            value={filters.hasilFU}
            onChange={(e) => onFilterChange({ hasilFU: e.target.value })}
          >
            <option value="">Semua Hasil FU</option>
            {HASIL_FU_OPTIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasFilter && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors px-2.5 py-1.5 bg-rose-50 rounded-lg"
            >
              <X size={10} />
              RESET
            </button>
          )}

          {/* Result count */}
          <div className="ml-auto text-[10px] text-slate-400 font-medium">
            Menampilkan{" "}
            <span className="font-bold text-[#003f7d]">{resultCount}</span>{" "}
            dari {totalCount} leads
          </div>
        </div>
      </div>
    </div>
  )
}
