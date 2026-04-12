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

export interface PortfolioItem {
  id: string
  images: string[] // Support multiple images per portfolio item
  title: string
  description?: string
  height: "small" | "medium" | "large"
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

export interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  text: string
}

export interface ArtistProfile {
  artist: Artist
  services: Service[]
  portfolio: PortfolioItem[]
  reviews: Review[]
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
  title: string
  author: string
  authorAvatar: string
  category: string
  subCategory: string
  height: "small" | "medium" | "large"
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
