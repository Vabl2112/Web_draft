/** Роль в домене брифов (Unified Account: один аккаунт, разные права в разделе) */
export type BriefsUserRole = "user" | "master"

/** Пользователь в мок-хранилище брифов */
export interface BriefsUser {
  id: number
  role: BriefsUserRole
  name: string
  avatar: string
}

export type BriefStatus = "open" | "in_progress"

export type BriefListingKind = "product" | "service"

/** Снимок позиции из витрины «Товары / услуги» — хранится в dynamicData.listing */
export interface BriefListingSnapshot {
  kind: BriefListingKind
  id: string
  title: string
  description: string
  category: string
  image?: string | null
  price?: number | null
  priceFrom?: number | null
  priceTo?: number | null
  originalPrice?: number | null
  duration?: string | null
  inStock?: boolean | null
  rating?: number | null
  reviewsCount?: number | null
  seller?: { id: string; name: string; avatar: string } | null
  master?: { id: string; name: string; avatar: string; rating?: number } | null
}

export interface Brief {
  id: number
  clientId: number
  category: string
  budgetMin: number | null
  budgetMax: number | null
  status: BriefStatus
  /** Аналог JSONB: ответы динамических шагов + произвольные поля */
  dynamicData: Record<string, unknown>
  createdAt: string
}

export type MasterFeedSort = "none" | "budget_desc" | "budget_asc"
