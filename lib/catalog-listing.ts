import type { ActiveFilters, CatalogOfferItem } from "@/lib/types"

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&q=80"

export type ApiCatalogProduct = {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  image: string
  /** Несколько кадров для карусели в каталоге */
  images?: string[]
  category: string
  inStock: boolean
  rating: number
  reviewsCount: number
  seller: { id: string; name: string; avatar: string }
}

export type ApiCatalogService = {
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

export function apiProductToCatalogOffer(p: ApiCatalogProduct): CatalogOfferItem {
  const gallery =
    p.images && p.images.length > 0 ? p.images : [p.image, `${p.image}${p.image.includes("?") ? "&" : "?"}w=401`]
  return {
    kind: "product",
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    image: p.image,
    images: gallery,
    href: `/product/${p.id}`,
    priceValue: p.price,
    priceLabel: `${p.price.toLocaleString("ru-RU")} ₽`,
    originalPrice: p.originalPrice,
    inStock: p.inStock,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    seller: p.seller,
    shareTitle: p.title,
    reportKind: "товар",
  }
}

export function apiServiceToCatalogOffer(s: ApiCatalogService): CatalogOfferItem {
  const img = s.images?.[0] ?? PLACEHOLDER_IMG
  const priceLabel =
    s.priceTo != null && s.priceTo !== s.priceFrom
      ? `${s.priceFrom.toLocaleString("ru-RU")} – ${s.priceTo.toLocaleString("ru-RU")} ₽`
      : s.priceFrom > 0
        ? `от ${s.priceFrom.toLocaleString("ru-RU")} ₽`
        : "Цена по запросу"

  const svcImages =
    s.images && s.images.length > 0 ? s.images : [img, `${img}${img.includes("?") ? "&" : "?"}w=401`]

  return {
    kind: "service",
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    image: img,
    images: svcImages,
    href: `/service/${s.id}`,
    priceValue: s.priceFrom,
    priceLabel,
    duration: s.duration,
    popular: s.popular,
    rating: s.master.rating,
    seller: {
      id: s.master.id,
      name: s.master.name,
      avatar: s.master.avatar,
    },
    shareTitle: s.title,
    reportKind: "услуга",
  }
}

export function catalogCategoryMatches(item: CatalogOfferItem, categoryId: string): boolean {
  if (item.kind === "service") {
    if (["care", "equipment", "jewelry", "merch"].includes(categoryId)) return false
    if (categoryId === "piercing") return item.category === "piercing"
    return item.category === categoryId
  }
  if (categoryId === "tattoo" || categoryId === "permanent" || categoryId === "removal" || categoryId === "consultation")
    return false
  if (categoryId === "piercing") return item.category === "jewelry"
  if (categoryId === "care") return item.category === "care"
  if (categoryId === "equipment") return item.category === "equipment"
  if (categoryId === "jewelry") return item.category === "jewelry"
  if (categoryId === "merch") return item.category === "merch" || item.category === "gift"
  return false
}

function serviceDurationBucket(
  duration: string,
): "short" | "medium" | "long" | "any" {
  const d = duration.toLowerCase()
  if (d.includes("день") || d.includes("дня") || d.includes("рукав") || d.includes("от 4")) return "long"
  if (/[2-9]\s*(-\s*)?[4-9]\s*час/.test(d) || d.includes("2-4 час") || d.includes("2-3 час")) return "medium"
  if (d.includes("час") && !d.includes("30 мин")) return "medium"
  if (d.includes("мин") || d.includes("30 мин") || d.includes("30-60")) return "short"
  return "any"
}

function matchesDurationFilter(item: CatalogOfferItem, filterVal: string): boolean {
  if (filterVal === "any" || !item.duration) return item.kind === "product" || filterVal === "any"
  const b = serviceDurationBucket(item.duration)
  if (filterVal === "short") return b === "short"
  if (filterVal === "medium") return b === "medium"
  if (filterVal === "long") return b === "long"
  return true
}

export function filterCatalogOffers(
  items: CatalogOfferItem[],
  searchQuery: string,
  activeFilters: ActiveFilters,
): CatalogOfferItem[] {
  const q = searchQuery.trim().toLowerCase()
  const kindPref = activeFilters.subFilters["listing-kind"] as string | undefined
  const priceRange = activeFilters.subFilters["price-range"] as string | undefined
  const availability = activeFilters.subFilters["availability"]
  const durationFilter = activeFilters.subFilters["duration"] as string | undefined

  const priceRanges: Record<string, [number, number]> = {
    "0-3000": [0, 3000],
    "3000-10000": [3000, 10000],
    "10000-25000": [10000, 25000],
    "25000+": [25000, Infinity],
  }

  return items.filter(item => {
    if (q) {
      const hay = `${item.title} ${item.description}`.toLowerCase()
      if (!hay.includes(q)) return false
    }

    if (kindPref === "product" && item.kind !== "product") return false
    if (kindPref === "service" && item.kind !== "service") return false

    if (activeFilters.category && !catalogCategoryMatches(item, activeFilters.category)) return false

    if (priceRange && priceRange !== "any" && priceRanges[priceRange]) {
      const [min, max] = priceRanges[priceRange]
      if (item.priceValue < min || item.priceValue > max) return false
    }

    if (availability) {
      const vals = Array.isArray(availability) ? availability : [availability]
      if (vals.includes("in-stock") && item.kind === "product" && !item.inStock) return false
    }

    if (durationFilter && durationFilter !== "any" && item.kind === "service") {
      if (!matchesDurationFilter(item, durationFilter)) return false
    }

    return true
  })
}

export function sortCatalogOffers(
  items: CatalogOfferItem[],
  priceSort: string,
): CatalogOfferItem[] {
  const copy = [...items]
  if (priceSort === "low") copy.sort((a, b) => a.priceValue - b.priceValue)
  else if (priceSort === "high") copy.sort((a, b) => b.priceValue - a.priceValue)
  else if (priceSort === "rating") copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  return copy
}

export function parseProfilePriceLabel(priceStr: string): number {
  const digits = priceStr.replace(/[^\d]/g, " ")
  const nums = digits.split(/\s+/).filter(Boolean).map(Number)
  if (nums.length === 0) return 0
  return Math.min(...nums)
}

/** Профиль мастера: товар из локальной модели Product */
export function profileProductToCatalogOffer(
  p: {
    id: string
    title: string
    description: string
    price: number
    originalPrice: number | null
    images: string[]
    category: string
    inStock: boolean
    rating: number
    reviewsCount: number
    seller: { id: string; name: string; avatar: string }
  },
  fallbackSeller: { id: string; name: string; avatar: string },
): CatalogOfferItem {
  const seller = p.seller?.id ? p.seller : fallbackSeller
  const img = p.images[0] ?? PLACEHOLDER_IMG
  return {
    kind: "product",
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    image: img,
    images: p.images,
    href: `/product/${p.id}`,
    priceValue: p.price,
    priceLabel: `${p.price.toLocaleString("ru-RU")} ₽`,
    originalPrice: p.originalPrice,
    inStock: p.inStock,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    seller,
    shareTitle: p.title,
    reportKind: "товар",
  }
}

/** Профиль мастера: услуга из lib/types Service */
export function profileServiceToCatalogOffer(
  s: {
    id: string
    title: string
    description: string
    price: string
    images?: string[]
  },
  master: { id: string; name: string; avatar: string },
): CatalogOfferItem {
  const img = s.images?.[0] ?? PLACEHOLDER_IMG
  return {
    kind: "service",
    id: s.id,
    title: s.title,
    description: s.description,
    category: "",
    image: img,
    images: s.images,
    href: `/service/${s.id}`,
    priceValue: parseProfilePriceLabel(s.price),
    priceLabel: s.price,
    seller: { id: master.id, name: master.name, avatar: master.avatar },
    shareTitle: s.title,
    reportKind: "услуга",
  }
}

