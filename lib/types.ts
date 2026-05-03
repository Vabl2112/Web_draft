/** Какие вкладки профиля показывать посетителям (настраивает владелец-мастер). */
export interface SectionVisibility {
  portfolio: boolean
  services: boolean
  products: boolean
  calculator: boolean
  /** Вкладка «Статьи» на странице мастера */
  articles: boolean
}

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  portfolio: true,
  services: true,
  products: true,
  calculator: true,
  articles: true,
}

export interface Artist {
  id: string
  name: string
  title: string
  avatar: string
  rating: number
  reviewsCount: number
  location: string
  metro: string
  about: string
  tags: string[]
  sectionVisibility?: SectionVisibility
  socialLinks?: {
    vk?: string
    telegram?: string
    instagram?: string
    max?: string
    boosty?: string
    website?: string
  }
  badges: {
    icon: string
    label: string
  }[]
}

export interface Service {
  id: string
  icon: string
  title: string
  description: string
  price: string
  images?: string[] // Optional photos for services
}

/** Тип карточки на витрине: работа из портфолио или запись в ленте */
export type ShowcaseCardKind = "portfolio" | "record"

export interface PortfolioItem {
  id: string
  images: string[] // Support multiple images per portfolio item
  title: string
  description?: string
  height: "small" | "medium" | "large"
  /** Для витрины мастера: метка кирпичной сетки; без поля считается портфолио */
  showcaseKind?: ShowcaseCardKind
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  images: string[] // Support multiple images per product
  category: string
  inStock: boolean
  rating: number
  reviewsCount: number
  seller: {
    id: string
    name: string
    avatar: string
  }
}

/** Отзыв можно оставить только к услуге или товару мастера, не к профилю */
export type ReviewTargetType = "service" | "product"

export interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  text: string
  targetType: ReviewTargetType
  targetId: string
  /** Денормализованное название услуги или товара для отображения */
  targetTitle: string
}

export interface ArtistProfile {
  artist: Artist
  services: Service[]
  portfolio: PortfolioItem[]
  /** Сырые элементы с API; на клиенте фильтруются (null / other и т.д. отбрасываются) */
  reviews: unknown[]
}

export interface GalleryCategory {
  id: string
  name: string
  subFilters: GallerySubFilter[]
}

export interface GallerySubFilter {
  id: string
  name: string
}

export interface GalleryImage {
  id: string
  imageUrl: string
  /** Доп. кадры для свайпа на карточке витрины */
  images?: string[]
  title: string
  author: string
  authorAvatar: string
  /** Ссылка на профиль мастера с общей витрины */
  authorMasterId?: string
  category: string
  subCategory: string
  height: "small" | "medium" | "large"
  /** Витрина: тип публикации */
  showcaseKind?: ShowcaseCardKind
}

// Calculator types
export interface CalculatorParameter {
  id: string
  label: string
  type: "slider" | "radio" | "select" | "number"
  defaultValue: string | number
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  unit?: string
  marks?: { value: number; label: string }[]
}

export interface CalculatorConfig {
  formula: string
  parameters: CalculatorParameter[]
  currency: string
}

// Extended calculator config for master profile editor
export interface CalculatorVariable {
  id: string
  name: string // Variable name like 'a', 'b', 'c'
  label: string // Display label for users
  type: "slider" | "number" | "select" | "radio" | "checkbox"
  defaultValue: number
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: { value: number; label: string }[] // value = weight/numeric value for formula
  checkedValue?: number // For checkbox: value when checked
  uncheckedValue?: number // For checkbox: value when unchecked
}

export interface MasterCalculatorConfig {
  variables: CalculatorVariable[]
  formula: string
  currency: string
}

// Master profile configuration
export interface MasterProfileConfig {
  bio: string
  tags: string[]
  sections: {
    showPortfolio: boolean
    showServices: boolean
    showProducts: boolean
    showCalculator: boolean
    showReviews: boolean
  }
  calculators: MasterCalculatorConfig[] // Support multiple calculators
}

// Extended Artist Profile with products
export interface ExtendedArtistProfile {
  artist: Artist
  services: Service[]
  products: Product[]
  portfolio: PortfolioItem[]
  reviews: Review[]
  calculators: MasterCalculatorConfig[]
}

// Smart Cascading Filters
export interface FilterOption {
  id: string
  name: string
  count?: number
}

export interface SubFilter {
  id: string
  name: string
  type: "single" | "multiple" | "range" | "checkbox"
  options: FilterOption[]
}

export interface CategoryFilter {
  id: string
  name: string
  icon?: string
  subFilters: SubFilter[]
}

export interface FiltersConfig {
  categories: CategoryFilter[]
  commonFilters?: SubFilter[] // Filters available for all categories
}

export interface ActiveFilters {
  category: string | null
  subFilters: Record<string, string | string[] | { min: number; max: number }>
}

/** Тип позиции в объединённых списках каталога и профиля мастера */
export type OfferKind = "product" | "service"

/** Единая модель карточки «товар или услуга» для списков (детальные страницы остаются раздельными) */
export interface CatalogOfferItem {
  kind: OfferKind
  id: string
  title: string
  description: string
  category: string
  image: string
  images?: string[]
  href: string
  priceValue: number
  priceLabel: string
  originalPrice?: number | null
  inStock?: boolean
  rating?: number
  reviewsCount?: number
  duration?: string
  popular?: boolean
  seller: {
    id: string
    name: string
    avatar: string
  }
  shareTitle: string
  reportKind: "товар" | "услуга"
}
