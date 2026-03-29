import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps {
  value?: number
  className?: string
  barClassName?: string
  animated?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, barClassName, value = 0, animated = true }, ref) => {
    const pct = Math.min(Math.max(value, 0), 100)
    return (
      <div
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            animated && "progress-bar-fill",
            barClassName || "bg-[#003f7d]"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
