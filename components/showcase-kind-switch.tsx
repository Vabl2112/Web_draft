"use client"

import { LayoutGrid, Images, NotebookPen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ShowcaseCardKind } from "@/lib/types"

export type ShowcaseKindFilter = "all" | ShowcaseCardKind

interface ShowcaseKindSwitchProps {
  value: ShowcaseKindFilter
  onChange: (v: ShowcaseKindFilter) => void
  stretch?: boolean
  className?: string
}

export function ShowcaseKindSwitch({
  value,
  onChange,
  stretch,
  className,
}: ShowcaseKindSwitchProps) {
  const item = (
    v: ShowcaseKindFilter,
    label: string,
    Icon: typeof LayoutGrid,
    aria: string,
  ) => (
    <Button
      key={v}
      type="button"
      variant={value === v ? "secondary" : "ghost"}
      size="sm"
      aria-label={aria}
      title={aria}
      className={cn(
        "h-9 gap-2 rounded-lg px-2 text-sm font-medium sm:px-3",
        stretch
          ? "min-w-0 flex-1 basis-0"
          : "flex-1 sm:flex-initial sm:min-w-[6.5rem]",
        value === v && "bg-background shadow-sm ring-1 ring-border",
      )}
      onClick={() => onChange(v)}
    >
      <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
      <span className="truncate">{label}</span>
    </Button>
  )

  return (
    <div
      role="group"
      aria-label="Тип публикаций витрины"
      className={cn(
        "flex w-full flex-wrap gap-1 rounded-xl border border-border/80 bg-muted/50 p-1 dark:bg-muted/30",
        stretch ? "max-w-none" : "max-w-2xl",
        className,
      )}
    >
      {item("all", "Все", LayoutGrid, "Показать все типы публикаций")}
      {item("portfolio", "Портфолио", Images, "Только работы портфолио")}
      {item("record", "Записи", NotebookPen, "Только записи в ленте")}
    </div>
  )
}
