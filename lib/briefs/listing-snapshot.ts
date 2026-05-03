import type { Brief, BriefListingKind, BriefListingSnapshot } from "@/lib/briefs/types"

export const BRIEF_LISTING_KEY = "listing" as const

/** Ответы /api/products — элемент массива products */
export interface MarketplaceProductRow {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  image: string
  category: string
  inStock: boolean
  rating: number
  reviewsCount: number
  seller: { id: string; name: string; avatar: string }
}

/** Ответы /api/services — элемент массива services */
export interface MarketplaceServiceRow {
  id: string
  title: string
  description: string
  priceFrom: number
  priceTo: number | null
  duration: string
  category: string
  images?: string[]
  master: { id: string; name: string; avatar: string; rating: number }
  popular: boolean
}

export function snapshotFromProduct(p: MarketplaceProductRow): BriefListingSnapshot {
  return {
    kind: "product",
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    image: p.image,
    price: p.price,
    priceFrom: null,
    priceTo: null,
    originalPrice: p.originalPrice,
    duration: null,
    inStock: p.inStock,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    seller: p.seller,
    master: null,
  }
}

export function snapshotFromService(s: MarketplaceServiceRow): BriefListingSnapshot {
  return {
    kind: "service",
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    image: s.images?.[0] ?? null,
    price: null,
    priceFrom: s.priceFrom,
    priceTo: s.priceTo,
    originalPrice: null,
    duration: s.duration,
    inStock: null,
    rating: s.master.rating,
    reviewsCount: null,
    seller: null,
    master: { id: s.master.id, name: s.master.name, avatar: s.master.avatar, rating: s.master.rating },
  }
}

export function getListingFromBrief(brief: Brief): BriefListingSnapshot | null {
  const raw = brief.dynamicData[BRIEF_LISTING_KEY]
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  if (o.kind !== "product" && o.kind !== "service") return null
  return raw as BriefListingSnapshot
}

export function formatListingPrice(s: BriefListingSnapshot): string {
  if (s.kind === "product" && s.price != null) {
    let t = `${s.price.toLocaleString("ru-RU")} ₽`
    if (s.originalPrice != null && s.originalPrice > s.price) {
      t += ` · было ${s.originalPrice.toLocaleString("ru-RU")} ₽`
    }
    return t
  }
  if (s.priceFrom != null) {
    if (s.priceTo != null) return `${s.priceFrom.toLocaleString("ru-RU")} — ${s.priceTo.toLocaleString("ru-RU")} ₽`
    return `от ${s.priceFrom.toLocaleString("ru-RU")} ₽`
  }
  return "Цена по запросу"
}
