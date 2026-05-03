"use client"

import Link from "next/link"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CalculatorArticleWidgetProps {
  artistId: string
  title?: string
  hint?: string
  className?: string
}

/**
 * Встраиваемый виджет: переход к странице мастера с калькулятором (смысловой хаб статьи + услуга).
 */
export function CalculatorArticleWidget({
  artistId,
  title = "Калькулятор услуг",
  hint = "Оцените стоимость по параметрам мастера на отдельной странице.",
  className,
}: CalculatorArticleWidgetProps) {
  if (!artistId?.trim()) return null

  return (
    <aside
      className={cn(
        "my-6 rounded-2xl border border-border/70 bg-muted/30 p-5 shadow-sm dark:bg-muted/20",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-foreground/5 ring-1 ring-border">
            <Calculator className="size-5 text-foreground/80" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
          </div>
        </div>
        <Button asChild className="shrink-0 sm:self-center">
          <Link href={`/master/${artistId.trim()}`}>Открыть калькулятор</Link>
        </Button>
      </div>
    </aside>
  )
}
