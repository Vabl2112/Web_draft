import type { Brief } from "@/lib/briefs/types"

/** Системное значение, при котором бриф исключается из сортировки/фильтра по правилам ТЗ */
export const BRIEF_SYSTEM_OTHER = "other"

function isOtherString(v: unknown): boolean {
  return typeof v === "string" && v.trim().toLowerCase() === BRIEF_SYSTEM_OTHER
}

/** Категория «other» — не участвует в отсортированной выдаче по бюджету */
export function briefCategoryIsExcluded(b: Brief): boolean {
  return isOtherString(b.category) || b.category === BRIEF_SYSTEM_OTHER
}

/** Оба бюджета null/undefined — нет числового ключа для сортировки */
export function briefHasNoComparableBudget(b: Brief): boolean {
  return b.budgetMin == null && b.budgetMax == null
}

/**
 * Для сортировки по бюджету: строго исключаем брифы без числового бюджета и категорию other.
 * null и other никогда не приравниваются к числу.
 */
export function filterBriefsEligibleForBudgetSort(briefs: Brief[]): Brief[] {
  return briefs.filter(b => {
    if (briefCategoryIsExcluded(b)) return false
    if (briefHasNoComparableBudget(b)) return false
    return true
  })
}

function finiteNumber(n: number): boolean {
  return typeof n === "number" && Number.isFinite(n) && !Number.isNaN(n)
}

/** Одно число для сравнения: max из доступных границ вилки; только если есть хотя бы одно валидное число */
export function briefBudgetComparableMax(b: Brief): number | null {
  const candidates: number[] = []
  if (b.budgetMax != null && finiteNumber(b.budgetMax)) candidates.push(b.budgetMax)
  if (b.budgetMin != null && finiteNumber(b.budgetMin)) candidates.push(b.budgetMin)
  if (candidates.length === 0) return null
  return Math.max(...candidates)
}

/** Для сортировки «от меньшего»: min из доступных границ */
export function briefBudgetComparableMin(b: Brief): number | null {
  const candidates: number[] = []
  if (b.budgetMin != null && finiteNumber(b.budgetMin)) candidates.push(b.budgetMin)
  if (b.budgetMax != null && finiteNumber(b.budgetMax)) candidates.push(b.budgetMax)
  if (candidates.length === 0) return null
  return Math.min(...candidates)
}

export function sortBriefsByBudgetDescending(briefs: Brief[]): Brief[] {
  const base = filterBriefsEligibleForBudgetSort(briefs)
  return [...base].sort((a, b) => {
    const ka = briefBudgetComparableMax(a)
    const kb = briefBudgetComparableMax(b)
    if (ka == null || kb == null) return 0
    return kb - ka
  })
}

export function sortBriefsByBudgetAscending(briefs: Brief[]): Brief[] {
  const base = filterBriefsEligibleForBudgetSort(briefs)
  return [...base].sort((a, b) => {
    const ka = briefBudgetComparableMin(a)
    const kb = briefBudgetComparableMin(b)
    if (ka == null || kb == null) return 0
    return ka - kb
  })
}

export function filterBriefsByCategory(briefs: Brief[], category: string | "all"): Brief[] {
  if (category === "all") return briefs
  return briefs.filter(b => b.category === category)
}
