import type { Brief } from "@/lib/briefs/types"
import { BRIEF_CATEGORY_LABELS } from "@/lib/briefs/market-categories"

/** Категории, которые реально встречаются в переданном списке брифов, с количеством — для умного фильтра ленты */
export function getCategoriesWithCounts(briefs: Brief[]): { id: string; label: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const b of briefs) {
    counts.set(b.category, (counts.get(b.category) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([id, count]) => ({
      id,
      label: BRIEF_CATEGORY_LABELS[id] ?? id,
      count,
    }))
    .sort((a, b) => b.count - a.count)
}
