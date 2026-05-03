"use client"

import { Images, NotebookPen, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ShowcaseCardKind } from "@/lib/types"

const ARIA: Record<ShowcaseCardKind, string> = {
  portfolio: "Портфолио: работа",
  record: "Запись",
}

const STYLE: Record<ShowcaseCardKind, string> = {
  portfolio: "bg-background/92 text-slate-700 ring-border/80 dark:text-slate-200",
  record: "bg-background/92 text-violet-700 ring-border/80 dark:text-violet-200",
}

const ICON: Record<ShowcaseCardKind, LucideIcon> = {
  portfolio: Images,
  record: NotebookPen,
}

/** Нормализация устаревших значений с API */
export function normalizeShowcaseKind(
  raw: string | null | undefined,
): ShowcaseCardKind {
  if (raw === "record" || raw === "post" || raw === "news") return "record"
  return "portfolio"
}

export function ShowcaseKindBadge({
  kind,
  className,
}: {
  kind: ShowcaseCardKind
  className?: string
}) {
  const Icon = ICON[kind]

  return (
    <span
      role="img"
      aria-label={ARIA[kind]}
      title={ARIA[kind]}
      className={cn(
        "pointer-events-none inline-flex size-8 items-center justify-center rounded-lg ring-1 shadow-sm backdrop-blur-[2px]",
        STYLE[kind],
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
    </span>
  )
}
