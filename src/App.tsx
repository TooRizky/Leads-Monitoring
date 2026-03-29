import { useEffect, useState, useMemo, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import DashboardHeader from "@/components/dashboardHeader"
import StatsCards from "@/components/statsCards"
import ProgressSection from "@/components/progressSection"
import LeadTable from "@/components/leadTable"
import FilterBar from "@/components/filterBar"
import PhoneBookPanel from "@/components/phoneBookPanel"
import LeadForm from "@/components/leadForm"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  LeadIntensifikasi,
  LeadEktensifikasi,
  FilterState,
  TabType,
  LeadBase,
} from "@/types"

const EMPTY_FILTERS: FilterState = {
  search: "",
  tigaP: "",
  leadsType: "",
  hasilFU: "",
}

function applyFilters(data: LeadBase[], filters: FilterState): LeadBase[] {
  return data.filter((item) => {
    const s = filters.search.toLowerCase()
    const itemRecord = item as Record<string, unknown>
    const matchSearch =
      !s ||
      item.nama_perusahaan?.toLowerCase().includes(s) ||
      item.kontak?.toLowerCase().includes(s) ||
      item.alamat?.toLowerCase().includes(s) ||
      (itemRecord.cif as string)?.toLowerCase().includes(s)

    const matchTigaP = !filters.tigaP || item.tiga_p === filters.tigaP
    const matchLeads = !filters.leadsType || item.leads === filters.leadsType
    const matchHasil =
      !filters.hasilFU ||
      item.hasil_fu?.toLowerCase().includes(filters.hasilFU.toLowerCase())

    return matchSearch && matchTigaP && matchLeads && matchHasil
  })
}

async function insertChangeLog(
  tableName: string,
  leadId: number,
  fieldName: string,
  oldValue: string | null,
  newValue: string | null,
  changedBy?: string
) {
  try {
    await supabase.from("lead_change_logs").insert([
      {
        table_name: tableName,
        lead_id: leadId,
        field_name: fieldName,
        old_value: oldValue || null,
        new_value: newValue || null,
        changed_by: changedBy || null,
      },
    ])
  } catch (err) {
    console.warn("Gagal menyimpan log perubahan:", err)
  }
}

export default function App() {
  const [intensData, setIntensData] = useState<LeadIntensifikasi[]>([])
  const [extData, setExtData] = useState<LeadEktensifikasi[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [activeTab, setActiveTab] = useState<TabType>("intensification")
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [statsFilter, setStatsFilter] = useState<"all" | "intensifikasi" | "ekstensifikasi">("all")
  const [viewLead, setViewLead] = useState<LeadBase | null>(null)
  const [editLead, setEditLead] = useState<LeadBase | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [intRes, extRes] = await Promise.all([
        supabase.from("leads_intensifikasi").select("*").range(0, 4999),
        supabase.from("leads_ekstensifikasi").select("*").range(0, 4999),
      ])
      if (intRes.data) setIntensData(intRes.data as LeadIntensifikasi[])
      if (extRes.data) setExtData(extRes.data as LeadEktensifikasi[])
    } catch (err) {
      console.error("Gagal memuat data:", err)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setIsRefreshing(false)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType)
    setFilters(EMPTY_FILTERS)
  }

  const currentData = activeTab === "intensification" ? intensData : extData
  const filteredData = useMemo(
    () => applyFilters(currentData, filters),
    [currentData, filters]
  )

  const handleView = (lead: LeadBase) => {
    setViewLead(lead)
    setIsPanelOpen(true)
  }

  const handleEdit = (lead: LeadBase) => {
    setEditLead(lead)
    setIsPanelOpen(false)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setEditLead(null)
    setIsFormOpen(true)
  }

  const handleSave = async (formData: Record<string, unknown>, oldPic?: string) => {
    const table =
      activeTab === "intensification" ? "leads_intensifikasi" : "leads_ekstensifikasi"

    if (editLead?.id) {
      const { error } = await supabase
        .from(table)
        .update(formData)
        .eq("id", editLead.id)
      if (error) throw error

      const newPic = (formData.pic as string) || ""
      const prevPic = oldPic || ""
      if (newPic !== prevPic) {
        await insertChangeLog(table, editLead.id, "pic", prevPic, newPic)
      }
    } else {
      const { data, error } = await supabase.from(table).insert([formData]).select()
      if (error) throw error

      if (data && data[0] && formData.pic) {
        await insertChangeLog(table, data[0].id, "pic", null, formData.pic as string)
      }
    }

    setIsFormOpen(false)
    setEditLead(null)
    await fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f5fb] flex items-center justify-center">
        <div className="text-center space-y-5">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#003f7d] flex items-center justify-center shadow-xl">
              <div
                className="w-8 h-8 border-[3px] border-[#f5a623] border-t-transparent rounded-full animate-spin"
              />
            </div>
          </div>
          <div>
            <p className="font-extrabold text-[#003f7d] text-sm tracking-tight">
              Memuat Data Leads
            </p>
            <p className="text-xs text-slate-400 mt-1">
              KCP Jakarta Grand Slipi Tower · Area Greenville
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f5fb] pb-10">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-8 space-y-6">
        <DashboardHeader
          intensificationData={intensData}
          extensificationData={extData}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <StatsCards
          intensificationData={intensData}
          extensificationData={extData}
          statsFilter={statsFilter}
          onStatsFilterChange={setStatsFilter}
        />

        <ProgressSection
          intensificationData={intensData}
          extensificationData={extData}
        />

        <Card className="overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  Monitoring Leads Nasabah
                </h2>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
                  Phone Book · Progress · Detail
                </p>
              </div>

              <Tabs
                defaultValue="intensification"
                value={activeTab}
                onValueChange={handleTabChange}
              >
                <TabsList className="bg-slate-100">
                  <TabsTrigger value="intensification">
                    <span className="w-2 h-2 rounded-full bg-[#003f7d] inline-block mr-1.5" />
                    Intensifikasi ({intensData.length})
                  </TabsTrigger>
                  <TabsTrigger value="extensification">
                    <span className="w-2 h-2 rounded-full bg-[#f5a623] inline-block mr-1.5" />
                    Ekstensifikasi ({extData.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="p-4 border-b border-slate-50">
            <FilterBar
              filters={filters}
              onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
              onClearFilters={() => setFilters(EMPTY_FILTERS)}
              onAddNew={handleAddNew}
              tabType={activeTab}
              resultCount={filteredData.length}
              totalCount={currentData.length}
            />
          </div>

          <LeadTable
            data={filteredData}
            tabType={activeTab}
            onView={handleView}
            onEdit={handleEdit}
            emptyMsg={
              filters.search || filters.tigaP || filters.leadsType || filters.hasilFU
                ? "Tidak ada leads yang sesuai filter."
                : "Belum ada data leads. Klik 'Tambah Nasabah' untuk memulai."
            }
          />
        </Card>
      </div>

      <PhoneBookPanel
        lead={viewLead}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onEdit={() => viewLead && handleEdit(viewLead)}
        tabType={activeTab}
      />

      <LeadForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditLead(null)
        }}
        onSave={handleSave}
        initialData={editLead}
        tabType={activeTab}
      />
    </div>
  )
}
