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
}

export interface PortfolioItem {
  id: string
  imageUrl: string
  title: string
  height: "small" | "medium" | "large"
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
  type: "slider" | "radio" | "select"
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
