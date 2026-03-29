import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive" | "mandiri-yellow"
  size?: "sm" | "md" | "lg" | "icon"
}

const variantStyles: Record<string, string> = {
  default:
    "bg-[#003f7d] text-white hover:bg-[#002d5c] shadow-sm shadow-[#003f7d]/20",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-600",
  outline:
    "border border-[#003f7d] text-[#003f7d] bg-transparent hover:bg-[#003f7d]/5",
  destructive:
    "bg-rose-600 text-white hover:bg-rose-700",
  "mandiri-yellow":
    "bg-[#f5a623] text-white hover:bg-[#e8961e] shadow-sm shadow-[#f5a623]/30",
}

const sizeStyles: Record<string, string> = {
  sm:   "h-8 px-3 text-xs gap-1.5",
  md:   "h-10 px-4 text-sm gap-2",
  lg:   "h-11 px-6 text-sm gap-2",
  icon: "h-9 w-9 p-0",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button }
