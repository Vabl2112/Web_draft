"use client"

import { useState, useEffect, useMemo } from "react"
import useSWR from "swr"
import { Search } from "lucide-react"
import { Header } from "@/components/header"
import { ServiceCard } from "@/components/service-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SmartFiltersDesktop, SmartFiltersMobile, ActiveFiltersBadges } from "@/components/smart-filters"
import { servicesFiltersConfig } from "@/lib/filters-config"
import type { ActiveFilters, FiltersConfig } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Service {
  id: string
  title: string
  description: string
  priceFrom: number
  priceTo: number | null
  duration: string
  category: string
  images?: string[]
  master: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  popular: boolean
}

export function ServicesPage() {
  const { data, isLoading } = useSWR("/api/services", fetcher)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceSort, setPriceSort] = useState("default")
  const [filtersConfig, setFiltersConfig] = useState<FiltersConfig | null>(null)
  const [isFiltersLoading, setIsFiltersLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: null,
    subFilters: {},
  })

  // Simulate fetching filters config from API
  useEffect(() => {
    const loadFilters = async () => {
      setIsFiltersLoading(true)
      // In production: const config = await fetchFiltersConfig("services")
      await new Promise(resolve => setTimeout(resolve, 300))
      setFiltersConfig(servicesFiltersConfig)
      setIsFiltersLoading(false)
    }
    loadFilters()
  }, [])

  // Filter services based on active filters
  const filteredServices = useMemo(() => {
    if (!data?.services) return []

    return data.services
      .filter((service: Service) => {
        // Search filter
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
        
        // Category filter
        let matchesCategory = true
        if (activeFilters.category) {
          // Map filter category IDs to service categories
          const categoryMapping: Record<string, string[]> = {
            tattoo: ["tattoo", "тату"],
            piercing: ["piercing", "пирсинг"],
            permanent: ["permanent", "перманент"],
            "art-services": ["art", "художественные", "иллюстрация"],
          }
          const relevantCategories = categoryMapping[activeFilters.category] || []
          matchesCategory = relevantCategories.some(cat => 
            service.category.toLowerCase().includes(cat)
          )
        }

        // Sub-filters
        let matchesSubFilters = true
        
        // Price range filter
        if (activeFilters.subFilters["price-range"]) {
          const priceRange = activeFilters.subFilters["price-range"] as string
          const priceRanges: Record<string, [number, number]> = {
            "0-3000": [0, 3000],
            "3000-10000": [3000, 10000],
            "10000-30000": [10000, 30000],
            "30000+": [30000, Infinity],
          }
          if (priceRange !== "any" && priceRanges[priceRange]) {
            const [min, max] = priceRanges[priceRange]
            matchesSubFilters = service.priceFrom >= min && service.priceFrom <= max
          }
        }

        return matchesSearch && matchesCategory && matchesSubFilters
      })
      .sort((a: Service, b: Service) => {
        if (priceSort === "low") return a.priceFrom - b.priceFrom
        if (priceSort === "high") return b.priceFrom - a.priceFrom
        return 0
      })
  }, [data?.services, searchQuery, activeFilters, priceSort])

  const clearAllFilters = () => {
    setSearchQuery("")
    setActiveFilters({ category: null, subFilters: {} })
    setPriceSort("default")
  }

  const hasActiveFilters = activeFilters.category || Object.keys(activeFilters.subFilters).length > 0 || searchQuery

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Услуги</h1>
          <p className="mt-1 text-muted-foreground">
            Выберите услугу и запишитесь к мастеру
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <SmartFiltersDesktop
                config={filtersConfig}
                isLoading={isFiltersLoading}
                activeFilters={activeFilters}
                onFiltersChange={setActiveFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск услуги..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Desktop Sort */}
                <div className="hidden sm:block">
                  <Select value={priceSort} onValueChange={setPriceSort}>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Сортировка по цене" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">По умолчанию</SelectItem>
                      <SelectItem value="low">Сначала дешевле</SelectItem>
                      <SelectItem value="high">Сначала дороже</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Filters */}
                <div className="lg:hidden">
                  <SmartFiltersMobile
                    config={filtersConfig}
                    isLoading={isFiltersLoading}
                    activeFilters={activeFilters}
                    onFiltersChange={setActiveFilters}
                  />
                </div>
              </div>
            </div>

            {/* Active Filters Badges */}
            <div className="mb-4">
              <ActiveFiltersBadges
                config={filtersConfig}
                activeFilters={activeFilters}
                onFiltersChange={setActiveFilters}
              />
            </div>

            {/* Services Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))
              ) : filteredServices?.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-lg text-muted-foreground">Услуги не найдены</p>
                  {hasActiveFilters && (
                    <Button variant="link" onClick={clearAllFilters}>
                      Сбросить фильтры
                    </Button>
                  )}
                </div>
              ) : (
                filteredServices?.map((service: Service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              )}
            </div>

            {/* Results Count */}
            {!isLoading && filteredServices?.length > 0 && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Найдено {filteredServices.length} услуг
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
