import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (val: string) => void
}

const TabsContext = React.createContext<TabsContextValue>({ value: "", onValueChange: () => {} })

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (val: string) => void
}

function Tabs({ defaultValue = "", value, onValueChange, className, children, ...props }: TabsProps) {
  const [internalVal, setInternalVal] = React.useState(defaultValue)
  const active = value !== undefined ? value : internalVal
  const handleChange = (val: string) => {
    setInternalVal(val)
    onValueChange?.(val)
  }
  return (
    <TabsContext.Provider value={{ value: active, onValueChange: handleChange }}>
      <div className={cn("w-full", className)} {...props}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1",
        className
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { value: active, onValueChange } = React.useContext(TabsContext)
  const isActive = active === value
  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap",
        isActive
          ? "bg-white text-[#003f7d] shadow-sm font-bold"
          : "text-slate-500 hover:text-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { value: active } = React.useContext(TabsContext)
  if (active !== value) return null
  return <div className={cn("mt-0", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
