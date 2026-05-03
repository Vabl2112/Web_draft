import type { Review, ReviewTargetType } from "@/lib/types"

function isOtherish(v: unknown): boolean {
  if (v === null || v === undefined) return true
  if (typeof v === "string" && v.trim().toLowerCase() === "other") return true
  return false
}

function validNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0 && !isOtherish(v)
}

function validRating(v: unknown): v is number {
  if (typeof v !== "number" || !Number.isFinite(v)) return false
  if (v < 1 || v > 5) return false
  return true
}

function validTargetType(v: unknown): v is ReviewTargetType {
  return v === "service" || v === "product"
}

/**
 * Отзывы с API: узлы с null, пустыми полями или значением `other` полностью отбрасываются.
 * Не подставляем нули и не рендерим заглушки под битые записи.
 */
export function filterValidReviews(input: unknown[] | null | undefined): Review[] {
  if (!input?.length) return []

  const out: Review[] = []

  for (const raw of input) {
    if (raw === null || typeof raw !== "object") continue
    const r = raw as Record<string, unknown>

    if (!validNonEmptyString(r.id)) continue
    if (!validNonEmptyString(r.author)) continue
    if (!validNonEmptyString(r.avatar)) continue
    if (!validNonEmptyString(r.date)) continue
    if (!validNonEmptyString(r.text)) continue
    if (isOtherish(r.rating) || !validRating(r.rating)) continue
    if (isOtherish(r.targetType) || !validTargetType(r.targetType)) continue
    if (!validNonEmptyString(r.targetId)) continue
    if (!validNonEmptyString(r.targetTitle)) continue

    out.push({
      id: r.id.trim(),
      author: r.author.trim(),
      avatar: r.avatar.trim(),
      rating: r.rating,
      date: r.date.trim(),
      text: r.text.trim(),
      targetType: r.targetType,
      targetId: r.targetId.trim(),
      targetTitle: r.targetTitle.trim(),
    })
  }

  return out
}
