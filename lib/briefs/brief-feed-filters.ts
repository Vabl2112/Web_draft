import type { Brief } from "@/lib/briefs/types"
import {
  BRIEF_DESCRIPTION_KEY,
  BRIEF_FILTER_PATH_KEY,
  BRIEF_TITLE_KEY,
  formatBriefFilterPathSummary,
  parseBriefFilterPath,
} from "@/lib/briefs/brief-scope-tree"
import { getListingFromBrief } from "@/lib/briefs/listing-snapshot"
import {
  briefBudgetComparableMax,
  briefBudgetComparableMin,
  filterBriefsByCategory,
  sortBriefsByBudgetAscending,
  sortBriefsByBudgetDescending,
} from "@/lib/briefs/sort-filter"

function briefDescription(b: Brief): string {
  const d = b.dynamicData
  const v = d[BRIEF_DESCRIPTION_KEY]
  if (typeof v === "string") return v.trim()
  const c = d.clientNotes
  if (typeof c === "string") return c.trim()
  const s = d.summary
  if (typeof s === "string") return s.trim()
  return ""
}

function briefTitleField(b: Brief): string {
  const t = b.dynamicData[BRIEF_TITLE_KEY]
  return typeof t === "string" ? t.trim() : ""
}

export function briefSearchHaystack(b: Brief): string {
  const path = parseBriefFilterPath(b.dynamicData[BRIEF_FILTER_PATH_KEY])
  const listing = getListingFromBrief(b)
  const parts = [
    briefTitleField(b),
    briefDescription(b),
    path ? formatBriefFilterPathSummary(path) : "",
    path ? path.steps.map(s => `${s.filterLabel} ${s.valueLabel}`).join(" ") : "",
    listing?.title ?? "",
    listing?.description ?? "",
    String(b.id),
  ]
  return parts.join(" ").toLowerCase()
}

export function filterBriefsBySearchQuery(briefs: Brief[], query: string): Brief[] {
  const q = query.trim().toLowerCase()
  if (!q) return briefs
  return briefs.filter(b => briefSearchHaystack(b).includes(q))
}

/** Шаги filterPath с filterId из набора (напр. style) */
export function filterBriefsByPathStepValue(
  briefs: Brief[],
  filterId: string | "all",
  valueId: string | "all",
): Brief[] {
  if (filterId === "all" || valueId === "all") return briefs
  return briefs.filter(b => {
    const path = parseBriefFilterPath(b.dynamicData[BRIEF_FILTER_PATH_KEY])
    if (!path) return false
    return path.steps.some(s => s.filterId === filterId && s.valueId === valueId)
  })
}

/** Агрегирует варианты для селекта по filterId (например style) из текущей ленты */
export function aggregateStepOptionsForFilterId(
  briefs: Brief[],
  filterId: string,
): { filterLabel: string; options: { valueId: string; valueLabel: string }[] } | null {
  const map = new Map<string, string>()
  let label = ""
  for (const b of briefs) {
    const path = parseBriefFilterPath(b.dynamicData[BRIEF_FILTER_PATH_KEY])
    if (!path) continue
    for (const s of path.steps) {
      if (s.filterId !== filterId) continue
      if (!label) label = s.filterLabel
      map.set(s.valueId, s.valueLabel)
    }
  }
  if (map.size === 0) return null
  const options = Array.from(map.entries())
    .map(([valueId, valueLabel]) => ({ valueId, valueLabel }))
    .sort((a, b) => a.valueLabel.localeCompare(b.valueLabel, "ru"))
  return { filterLabel: label || filterId, options }
}

function parseBudgetPreset(v: string): number | null {
  if (v === "any" || v === "") return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/** Пересечение вилки брифа с окном [min,max] (любая граница null = без ограничения). Бриф без чисел в бюджете не проходит, если задано хотя бы одно ограничение. */
export function filterBriefsByBudgetWindow(
  briefs: Brief[],
  minPreset: string,
  maxPreset: string,
): Brief[] {
  const minV = parseBudgetPreset(minPreset)
  const maxV = parseBudgetPreset(maxPreset)
  if (minV == null && maxV == null) return briefs

  let winLo = minV ?? 0
  let winHi = maxV ?? Number.POSITIVE_INFINITY
  if (winLo > winHi) [winLo, winHi] = [winHi, winLo]

  return briefs.filter(b => {
    const low = briefBudgetComparableMin(b)
    const high = briefBudgetComparableMax(b)
    if (low == null || high == null) return false
    return !(high < winLo || low > winHi)
  })
}

export type FeedSortMode = "date_desc" | "budget_desc" | "budget_asc"

export function applyFeedSort(briefs: Brief[], mode: FeedSortMode): Brief[] {
  if (mode === "budget_desc") return sortBriefsByBudgetDescending(briefs)
  if (mode === "budget_asc") return sortBriefsByBudgetAscending(briefs)
  return [...briefs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

/** Последовательное сужение по шагам filterPath (AND). */
export function filterBriefsByPathStepConstraints(
  briefs: Brief[],
  constraints: { filterId: string; valueId: string }[],
): Brief[] {
  let list = briefs
  for (const { filterId, valueId } of constraints) {
    list = filterBriefsByPathStepValue(list, filterId, valueId)
  }
  return list
}

/** Полный пайплайн ленты мастера */
export function applyMasterFeedPipeline(
  briefs: Brief[],
  opts: {
    category: string | "all"
    query: string
    /** Динамические селекты из briefFiltersConfig (только при выбранной категории ≠ «Все»). */
    pathStepFilters: { filterId: string; valueId: string }[]
    budgetMinPreset: string
    budgetMaxPreset: string
    sortMode: FeedSortMode
  },
): Brief[] {
  let list = filterBriefsByCategory(briefs, opts.category)
  list = filterBriefsBySearchQuery(list, opts.query)
  if (opts.pathStepFilters.length > 0) {
    list = filterBriefsByPathStepConstraints(list, opts.pathStepFilters)
  }
  const hasBudgetWindow =
    parseBudgetPreset(opts.budgetMinPreset) != null || parseBudgetPreset(opts.budgetMaxPreset) != null
  if (hasBudgetWindow) {
    list = filterBriefsByBudgetWindow(list, opts.budgetMinPreset, opts.budgetMaxPreset)
  }
  list = applyFeedSort(list, opts.sortMode)
  return list
}
