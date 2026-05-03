"use client"

import type { ReactNode } from "react"
import { Search } from "lucide-react"
import type { BriefDynamicFilterDef } from "@/lib/briefs/briefFiltersConfig"
import type { FeedSortMode } from "@/lib/briefs/brief-feed-filters"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface CategoryChipItem {
  id: string
  label: string
  count: number
}

const BUDGET_PRESET_MIN: { value: string; label: string }[] = [
  { value: "any", label: "Без нижней границы" },
  { value: "0", label: "от 0 ₽" },
  { value: "5000", label: "от 5 000 ₽" },
  { value: "10000", label: "от 10 000 ₽" },
  { value: "25000", label: "от 25 000 ₽" },
  { value: "50000", label: "от 50 000 ₽" },
]

const BUDGET_PRESET_MAX: { value: string; label: string }[] = [
  { value: "any", label: "Без верхней границы" },
  { value: "10000", label: "до 10 000 ₽" },
  { value: "25000", label: "до 25 000 ₽" },
  { value: "50000", label: "до 50 000 ₽" },
  { value: "100000", label: "до 100 000 ₽" },
  { value: "500000", label: "до 500 000 ₽" },
]

export interface BriefsSearchRowProps {
  query: string
  onQueryChange: (q: string) => void
  /** Кнопка «Фильтры» и т.п. — обычно только на мобилке */
  endAction?: ReactNode
  className?: string
}

/** Полоска поиска на всю ширину (над сайдбаром и лентой) */
export function BriefsSearchRow({ query, onQueryChange, endAction, className }: BriefsSearchRowProps) {
  return (
    <div className={cn("flex items-stretch gap-2 sm:gap-3", className)}>
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="Поиск по описанию, заголовку и тегам из брифа…"
          className="h-11 border-border/80 bg-background/80 pl-10 pr-3 shadow-xs sm:h-10"
          autoComplete="off"
        />
      </div>
      {endAction ? <div className="flex shrink-0 items-stretch [&_button]:self-stretch">{endAction}</div> : null}
    </div>
  )
}

export interface BriefsFiltersPanelProps {
  categoryChips: CategoryChipItem[]
  category: string | "all"
  onCategoryChange: (id: string | "all") => void
  /** Селекты из briefFiltersConfig; при категории «Все» — пустой массив */
  dynamicFilterDefs: BriefDynamicFilterDef[]
  dynamicFilterValues: Record<string, string | undefined>
  onDynamicFilterChange: (filterId: string, value: string) => void
  budgetMinPreset: string
  budgetMaxPreset: string
  onBudgetMinPresetChange: (v: string) => void
  onBudgetMaxPresetChange: (v: string) => void
  sortMode: FeedSortMode
  onSortModeChange: (m: FeedSortMode) => void
  className?: string
}

/** Категории (табы) и селекты — без строки поиска */
export function BriefsFiltersPanel({
  categoryChips,
  category,
  onCategoryChange,
  dynamicFilterDefs,
  dynamicFilterValues,
  onDynamicFilterChange,
  budgetMinPreset,
  budgetMaxPreset,
  onBudgetMinPresetChange,
  onBudgetMaxPresetChange,
  sortMode,
  onSortModeChange,
  className,
}: BriefsFiltersPanelProps) {
  const totalInCategories = categoryChips.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <Label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">Категория</Label>
        <nav className="flex flex-col gap-0.5 rounded-lg border border-border/60 bg-muted/25 p-1" aria-label="Категории брифов">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            aria-pressed={category === "all"}
            className={cn(
              "flex w-full min-h-9 items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              category === "all"
                ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/80"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
          >
            <span className="min-w-0 truncate">Все</span>
            <Badge
              variant="secondary"
              className="h-5 shrink-0 border border-border/60 bg-muted/80 px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground"
            >
              {totalInCategories}
            </Badge>
          </button>
          {categoryChips.map(c => {
            const active = category === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onCategoryChange(c.id)}
                aria-pressed={active}
                className={cn(
                  "flex w-full min-h-9 items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  active
                    ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/80"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                )}
              >
                <span className="min-w-0 truncate">{c.label}</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 shrink-0 border px-1.5 text-[10px] font-medium tabular-nums",
                    active
                      ? "border-primary/25 bg-primary/10 text-foreground"
                      : "border-border/60 bg-muted/80 text-muted-foreground",
                  )}
                >
                  {c.count}
                </Badge>
              </button>
            )
          })}
        </nav>
      </div>

      {dynamicFilterDefs.length > 0 ? (
        <div className="space-y-4 border-t border-border/70 pt-4">
          {dynamicFilterDefs.map(def => {
            const selId = `brief-dyn-${def.filterId}`
            const value = dynamicFilterValues[def.filterId] ?? "all"
            return (
              <div key={def.filterId} className="space-y-2">
                <Label htmlFor={selId}>{def.label}</Label>
                <Select value={value} onValueChange={v => onDynamicFilterChange(def.filterId, v)}>
                  <SelectTrigger id={selId} className="w-full bg-background/80">
                    <SelectValue placeholder="Любой" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любой</SelectItem>
                    {def.options.map(o => (
                      <SelectItem key={o.valueId} value={o.valueId}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="grid gap-4 border-t border-border/70 pt-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-2">
          <Label htmlFor="brief-feed-bmin">Бюджет от</Label>
          <Select value={budgetMinPreset} onValueChange={onBudgetMinPresetChange}>
            <SelectTrigger id="brief-feed-bmin" className="w-full bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_PRESET_MIN.map(o => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brief-feed-bmax">Бюджет до</Label>
          <Select value={budgetMaxPreset} onValueChange={onBudgetMaxPresetChange}>
            <SelectTrigger id="brief-feed-bmax" className="w-full bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_PRESET_MAX.map(o => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="brief-feed-sort">Порядок</Label>
          <Select value={sortMode} onValueChange={v => onSortModeChange(v as FeedSortMode)}>
            <SelectTrigger id="brief-feed-sort" className="w-full bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Сначала новые</SelectItem>
              <SelectItem value="budget_desc">По бюджету: выше</SelectItem>
              <SelectItem value="budget_asc">По бюджету: ниже</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export interface BriefsFilterBarProps extends BriefsFiltersPanelProps, BriefsSearchRowProps {}

export function BriefsFilterBar({
  categoryChips,
  category,
  onCategoryChange,
  dynamicFilterDefs,
  dynamicFilterValues,
  onDynamicFilterChange,
  query,
  onQueryChange,
  budgetMinPreset,
  budgetMaxPreset,
  onBudgetMinPresetChange,
  onBudgetMaxPresetChange,
  sortMode,
  onSortModeChange,
}: BriefsFilterBarProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card/60 p-4 shadow-sm sm:p-5">
      <BriefsSearchRow query={query} onQueryChange={onQueryChange} />
      <BriefsFiltersPanel
        categoryChips={categoryChips}
        category={category}
        onCategoryChange={onCategoryChange}
        dynamicFilterDefs={dynamicFilterDefs}
        dynamicFilterValues={dynamicFilterValues}
        onDynamicFilterChange={onDynamicFilterChange}
        budgetMinPreset={budgetMinPreset}
        budgetMaxPreset={budgetMaxPreset}
        onBudgetMinPresetChange={onBudgetMinPresetChange}
        onBudgetMaxPresetChange={onBudgetMaxPresetChange}
        sortMode={sortMode}
        onSortModeChange={onSortModeChange}
      />
    </div>
  )
}
