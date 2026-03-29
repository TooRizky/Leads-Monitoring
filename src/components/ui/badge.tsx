import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "closing"
  | "needfu"
  | "takeout"
  | "tidakberminat"
  | "pending"
  | "pebisnis"
  | "prioritas"
  | "payroll"
  | "outline"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default:       "bg-[#003f7d]/10 text-[#003f7d] border-[#003f7d]/20",
  secondary:     "bg-slate-100 text-slate-600 border-slate-200",
  success:       "bg-emerald-50 text-emerald-700 border-emerald-200",
  closing:       "bg-emerald-50 text-emerald-700 border-emerald-200",
  needfu:        "bg-amber-50 text-amber-700 border-amber-200",
  takeout:       "bg-rose-50 text-rose-600 border-rose-200",
  tidakberminat: "bg-pink-50 text-pink-700 border-pink-200",
  pending:       "bg-slate-50 text-slate-500 border-slate-200",
  pebisnis:      "bg-[#003f7d]/10 text-[#003f7d] border-[#003f7d]/20",
  prioritas:     "bg-[#f5a623]/10 text-[#c47d0e] border-[#f5a623]/30",
  payroll:       "bg-indigo-50 text-indigo-700 border-indigo-200",
  outline:       "bg-transparent border-current text-current",
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
