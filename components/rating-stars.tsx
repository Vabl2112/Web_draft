"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

/** Звёзды 1–5 с учётом дробной части рейтинга (например 4.9 → четыре полные и одна на 90%). */
export function RatingStars({
  rating,
  max = 5,
  className,
  starClassName,
  label,
}: {
  rating: number
  max?: number
  className?: string
  starClassName?: string
  /** Подпись для a11y, по умолчанию из rating */
  label?: string
}) {
  const clamped = Math.min(max, Math.max(0, rating))
  const aria = label ?? `Рейтинг ${clamped} из ${max}`

  return (
    <div
      className={cn("flex items-center", className)}
      role="img"
      aria-label={aria}
    >
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.min(1, Math.max(0, clamped - i))
        return (
          <span key={i} className="relative inline-flex size-[1.05rem] shrink-0 sm:size-4">
            <Star
              className={cn(
                "absolute inset-0 size-[1.05rem] sm:size-4",
                "fill-muted/30 text-muted-foreground/40",
                starClassName
              )}
              aria-hidden
            />
            {fill > 0 ? (
              <span
                className="absolute left-0 top-0 h-full overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className="size-[1.05rem] fill-amber-500 text-amber-500 sm:size-4"
                  aria-hidden
                />
              </span>
            ) : null}
          </span>
        )
      })}
    </div>
  )
}
