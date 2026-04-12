"use client"

import { useState, useEffect, useMemo } from "react"
import useSWR from "swr"
import { Search, X } from "lucide-react"
import { Header } from "@/components/header"
import { MasterCard } from "@/components/master-card"
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
import { mastersFiltersConfig } from "@/lib/filters-config"
import type { ActiveFilters, FiltersConfig } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MastersPage() {
  const { data, isLoading } = useSWR("/api/masters", fetcher)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
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
      // In production, this would be: const config = await fetchFiltersConfig("masters")
      await new Promise(resolve => setTimeout(resolve, 300))
      setFiltersConfig(mastersFiltersConfig)
      setIsFiltersLoading(false)
    }
    loadFilters()
  }, [])

  // Filter masters based on active filters
  const filteredMasters = useMemo(() => {
    if (!data?.masters) return []

    return data.masters
      .filter((master: { name: string; styles: string[]; specialty?: string }) => {
        // Search filter
        const matchesSearch = master.name.toLowerCase().includes(searchQuery.toLowerCase())
        
        // Category filter - map category to master's specialty/styles
        let matchesCategory = true
        if (activeFilters.category) {
          // This mapping would come from the backend in production
          const categoryMapping: Record<string, string[]> = {
            painting: ["Живопись", "Художник", "Иллюстратор"],
            tattoo: ["Реализм", "Графика", "Блэкворк", "Традишнл", "Акварель", "Минимализм", "Дотворк", "Геометрия"],
            sculpture: ["Скульптор", "3D"],
            photography: ["Фотограф", "Фотография"],
            design: ["Дизайнер", "Дизайн"],
          }
          const relevantStyles = categoryMapping[activeFilters.category] || []
          matchesCategory = master.styles?.some((style: string) => 
            relevantStyles.some(rs => style.toLowerCase().includes(rs.toLowerCase()))
          ) || false
        }

        // Sub-filters - example implementation
        let matchesSubFilters = true
        if (activeFilters.subFilters.style) {
          const selectedStyles = Array.isArray(activeFilters.subFilters.style) 
            ? activeFilters.subFilters.style 
            : [activeFilters.subFilters.style]
          
          // Map filter IDs to actual style names
          const styleMapping: Record<string, string> = {
            realism: "Реализм",
            traditional: "Традишнл",
            blackwork: "Блэкворк",
            dotwork: "Дотворк",
            watercolor: "Акварель",
            geometric: "Геометрия",
            minimalism: "Минимализм",
            impressionism: "Импрессионизм",
            abstract: "Абстракция",
          }
          
          matchesSubFilters = selectedStyles.some(styleId => {
            const styleName = styleMapping[styleId]
            return master.styles?.some((s: string) => 
              s.toLowerCase().includes(styleName?.toLowerCase() || styleId)
            )
          })
        }

        return matchesSearch && matchesCategory && matchesSubFilters
      })
      .sort((a: { rating: number; reviewsCount: number }, b: { rating: number; reviewsCount: number }) => {
        if (sortBy === "rating") return b.rating - a.rating
        if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount
        return 0
      })
  }, [data?.masters, searchQuery, activeFilters, sortBy])

  const clearAllFilters = () => {
    setSearchQuery("")
    setActiveFilters({ category: null, subFilters: {} })
  }

  const hasActiveFilters = activeFilters.category || Object.keys(activeFilters.subFilters).length > 0 || searchQuery

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Мастера</h1>
          <p className="mt-1 text-muted-foreground">
            Найдите лучших мастеров в вашем городе
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
                  placeholder="Поиск по имени..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Desktop Sort */}
                <div className="hidden sm:block">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">По рейтингу</SelectItem>
                      <SelectItem value="reviews">По отзывам</SelectItem>
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

            {/* Masters List */}
            <div className="flex flex-col gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))
              ) : filteredMasters?.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">Мастера не найдены</p>
                  {hasActiveFilters && (
                    <Button variant="link" onClick={clearAllFilters}>
                      Сбросить фильтры
                    </Button>
                  )}
                </div>
              ) : (
                filteredMasters?.map((master: { id: string; name: string; avatar: string; specialty: string; rating: number; reviewsCount: number; location: string; styles: string[]; verified: boolean; experience: string; worksCount: number }) => (
                  <MasterCard key={master.id} master={master} />
                ))
              )}
            </div>

            {/* Results Count */}
            {!isLoading && filteredMasters?.length > 0 && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Найдено {filteredMasters.length} мастеров
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
