"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { authUserIdToBriefClientId } from "@/lib/briefs/auth-bridge"
import type { Brief } from "@/lib/briefs/types"
import { fetchOpenBriefsForFeed } from "@/lib/briefs/brief-api"
import { applyMasterFeedPipeline } from "@/lib/briefs/brief-feed-filters"
import type { FeedSortMode } from "@/lib/briefs/brief-feed-filters"
import { buildActivePathStepFilters, getBriefDynamicFilterDefs } from "@/lib/briefs/briefFiltersConfig"
import { getCategoriesWithCounts } from "@/lib/briefs/feed-categories"
import { sortBriefsByBudgetAscending, sortBriefsByBudgetDescending } from "@/lib/briefs/sort-filter"
import { BriefCard } from "@/components/briefs/brief-card"
import { BriefsFiltersPanel, BriefsSearchRow } from "@/components/briefs/briefs-filter-bar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function MasterBriefsView() {
  const { user } = useAuth()
  const myClientId = user ? authUserIdToBriefClientId(user.id) : -1
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false)

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string | "all">("all")
  const [dynamicFilterValues, setDynamicFilterValues] = useState<Record<string, string>>({})
  const [budgetMinPreset, setBudgetMinPreset] = useState("any")
  const [budgetMaxPreset, setBudgetMaxPreset] = useState("any")
  const [sortMode, setSortMode] = useState<FeedSortMode>("date_desc")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchOpenBriefsForFeed()
      setBriefs(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const categoryChips = useMemo(() => getCategoriesWithCounts(briefs), [briefs])

  const dynamicFilterDefs = useMemo(() => getBriefDynamicFilterDefs(category), [category])

  const handleCategoryChange = useCallback((id: string | "all") => {
    setCategory(id)
    setDynamicFilterValues({})
  }, [])

  useEffect(() => {
    if (category === "all") return
    if (!categoryChips.some(c => c.id === category)) handleCategoryChange("all")
  }, [category, categoryChips, handleCategoryChange])

  const pathStepFilters = useMemo(
    () => buildActivePathStepFilters(dynamicFilterDefs, dynamicFilterValues),
    [dynamicFilterDefs, dynamicFilterValues],
  )

  const pipelineOpts = useMemo(
    () => ({
      category,
      query,
      pathStepFilters,
      budgetMinPreset,
      budgetMaxPreset,
      sortMode,
    }),
    [category, query, pathStepFilters, budgetMinPreset, budgetMaxPreset, sortMode],
  )

  const visible = useMemo(() => applyMasterFeedPipeline(briefs, pipelineOpts), [briefs, pipelineOpts])

  const hiddenBySortCount = useMemo(() => {
    if (sortMode === "date_desc") return 0
    const preSort = applyMasterFeedPipeline(briefs, { ...pipelineOpts, sortMode: "date_desc" as const })
    let postSort = preSort
    if (sortMode === "budget_desc") postSort = sortBriefsByBudgetDescending(preSort)
    if (sortMode === "budget_asc") postSort = sortBriefsByBudgetAscending(preSort)
    return Math.max(0, preSort.length - postSort.length)
  }, [briefs, pipelineOpts, sortMode])

  const filtersPanelProps = {
    categoryChips,
    category,
    onCategoryChange: handleCategoryChange,
    dynamicFilterDefs,
    dynamicFilterValues,
    onDynamicFilterChange: (filterId: string, value: string) => {
      setDynamicFilterValues(prev => ({ ...prev, [filterId]: value }))
    },
    budgetMinPreset,
    budgetMaxPreset,
    onBudgetMinPresetChange: setBudgetMinPreset,
    onBudgetMaxPresetChange: setBudgetMaxPreset,
    sortMode,
    onSortModeChange: setSortMode,
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Лента брифов</h2>
        <p className="text-sm text-muted-foreground">
          Поиск сверху; на большом экране фильтры слева (липкие). Дополнительные поля зависят от категории. Сортировка по
          бюджету скрывает позиции без сравнимого бюджета и категорию <code className="text-xs">other</code>.
        </p>
      </div>

      <div className="sticky top-16 z-40 rounded-2xl border border-border bg-card/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/90 sm:p-5">
        <BriefsSearchRow
          query={query}
          onQueryChange={setQuery}
          endAction={
            <Button
              type="button"
              variant="outline"
              size="default"
              className="h-11 shrink-0 gap-2 sm:h-10 lg:hidden"
              onClick={() => setFiltersSheetOpen(true)}
            >
              <SlidersHorizontal className="size-4 shrink-0" aria-hidden />
              Фильтры
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <aside className="hidden lg:sticky lg:top-32 lg:z-10 lg:block lg:max-h-[calc(100dvh-9rem)] lg:self-start lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-y-contain">
          <div className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm sm:p-5">
            <BriefsFiltersPanel {...filtersPanelProps} />
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <Sheet open={filtersSheetOpen} onOpenChange={setFiltersSheetOpen}>
            <SheetContent
              side="bottom"
              className="max-h-[88dvh] gap-0 overflow-hidden rounded-t-2xl border-t p-0 lg:hidden"
            >
              <SheetHeader className="border-b border-border/80 px-4 pb-3 pt-5 text-left">
                <SheetTitle>Фильтры</SheetTitle>
                <SheetDescription className="text-left">
                  Категория, уточнения по брифу, бюджет и порядок списка
                </SheetDescription>
              </SheetHeader>
              <div className="overflow-y-auto overscroll-contain px-4 py-4">
                <BriefsFiltersPanel {...filtersPanelProps} />
                <div className="mt-6">
                  <Button type="button" className="w-full" onClick={() => setFiltersSheetOpen(false)}>
                    Показать результаты
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {sortMode !== "date_desc" && hiddenBySortCount > 0 && (
            <p className="text-xs text-muted-foreground">
              По выбранному порядку «по бюджету» не показываются {hiddenBySortCount}{" "}
              {hiddenBySortCount === 1 ? "бриф" : hiddenBySortCount < 5 ? "брифа" : "брифов"} (нет сравнимого бюджета
              или категория other).
            </p>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">Загрузка…</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {briefs.length === 0
                ? "Пока нет открытых брифов."
                : "Ничего не подошло — измените поиск, категорию или фильтры."}
            </p>
          ) : (
            <div className="columns-1 gap-4 lg:columns-2">
              {visible.map(b => (
                <div key={b.id} className="mb-4 break-inside-avoid">
                  <BriefCard
                    brief={b}
                    variant="feed"
                    showProposeCta={b.clientId !== myClientId}
                    onProposeConcept={br => {
                      toast.message("Черновик отклика", {
                        description: `Концепт для брифа #${br.id} — дальше подключится API.`,
                      })
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
