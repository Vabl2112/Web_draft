"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Grid3X3, LayoutList, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
import { catalogFiltersConfig } from "@/lib/filters-config"
import { CatalogOfferCard } from "@/components/catalog-offer-card"
import { ListingKindSwitch, type ListingKindValue } from "@/components/listing-kind-switch"
import { cn } from "@/lib/utils"
import type { ActiveFilters, FiltersConfig } from "@/lib/types"
import {
  apiProductToCatalogOffer,
  apiServiceToCatalogOffer,
  filterCatalogOffers,
  sortCatalogOffers,
  type ApiCatalogProduct,
  type ApiCatalogService,
} from "@/lib/catalog-listing"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export type CatalogPagePreset = "all" | "services"

export interface CatalogPageProps {
  /** Предзаполнение фильтра «Только услуги» для маршрута /services */
  preset?: CatalogPagePreset
}

export function CatalogPage({ preset = "all" }: CatalogPageProps) {
  const searchParams = useSearchParams()
  const { data: productsPayload, isLoading: productsLoading } = useSWR<{ products: ApiCatalogProduct[] }>(
    "/api/products",
    fetcher,
  )
  const { data: servicesPayload, isLoading: servicesLoading } = useSWR<{ services: ApiCatalogService[] }>(
    "/api/services",
    fetcher,
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [priceSort, setPriceSort] = useState("default")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersConfig, setFiltersConfig] = useState<FiltersConfig | null>(null)
  const [isFiltersLoading, setIsFiltersLoading] = useState(true)
  const [listingKind, setListingKind] = useState<ListingKindValue>(() =>
    preset === "services" ? "service" : "all",
  )
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: null,
    subFilters: {},
  })

  useEffect(() => {
    const loadFilters = async () => {
      setIsFiltersLoading(true)
      await new Promise(r => setTimeout(r, 300))
      setFiltersConfig(catalogFiltersConfig)
      setIsFiltersLoading(false)
    }
    loadFilters()
  }, [])

  useEffect(() => {
    const k = searchParams.get("kind")
    if (k === "product" || k === "service") setListingKind(k)
  }, [searchParams])

  const items = useMemo(() => {
    const out: ReturnType<typeof apiProductToCatalogOffer>[] = []
    if (productsPayload?.products) {
      out.push(...productsPayload.products.map(apiProductToCatalogOffer))
    }
    if (servicesPayload?.services) {
      out.push(...servicesPayload.services.map(apiServiceToCatalogOffer))
    }
    return out
  }, [productsPayload, servicesPayload])

  const filtersForQuery = useMemo((): ActiveFilters => {
    const sub = { ...activeFilters.subFilters }
    if (listingKind === "all") delete sub["listing-kind"]
    else sub["listing-kind"] = listingKind
    return { ...activeFilters, subFilters: sub }
  }, [activeFilters, listingKind])

  const filtered = useMemo(() => {
    const f = filterCatalogOffers(items, searchQuery, filtersForQuery)
    return sortCatalogOffers(f, priceSort)
  }, [items, searchQuery, filtersForQuery, priceSort])

  const isLoading = productsLoading || servicesLoading

  const clearAllFilters = () => {
    setSearchQuery("")
    setListingKind("all")
    setActiveFilters({ category: null, subFilters: {} })
    setPriceSort("default")
  }

  const hasActiveFilters =
    listingKind !== "all" ||
    Boolean(activeFilters.category) ||
    Object.keys(activeFilters.subFilters).some(id => {
      const v = activeFilters.subFilters[id]
      if (Array.isArray(v)) return v.length > 0
      return Boolean(v)
    }) ||
    Boolean(searchQuery)

  const resultsLabel = (n: number) => {
    if (n === 0) return "Ничего не найдено"
    if (n === 1) return "Найдено 1 предложение"
    if (n >= 2 && n <= 4) return `Найдено ${n} предложения`
    return `Найдено ${n} предложений`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Товары и услуги
          </h1>
          <p className="mt-1 text-muted-foreground">
            Каталог предложений мастеров: изделия, материалы и записи в одном разделе
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
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

          <div className="flex-1">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию и описанию..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:block">
                  <Select value={priceSort} onValueChange={setPriceSort}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">По умолчанию</SelectItem>
                      <SelectItem value="low">Сначала дешевле</SelectItem>
                      <SelectItem value="high">Сначала дороже</SelectItem>
                      <SelectItem value="rating">По рейтингу</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="hidden items-center rounded-lg border border-border p-1 sm:flex">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="size-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="size-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="size-8"
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="size-4" />
                  </Button>
                </div>

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

            <ListingKindSwitch
              value={listingKind}
              onChange={setListingKind}
              stretch
              className="mb-4 w-full"
            />

            <div className="mb-4">
              <ActiveFiltersBadges
                config={filtersConfig}
                activeFilters={activeFilters}
                onFiltersChange={setActiveFilters}
              />
            </div>

            {isLoading ? (
              <div
                className={cn(
                  "grid gap-4",
                  viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1",
                )}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={cn("rounded-2xl", viewMode === "grid" ? "aspect-[3/4]" : "h-44")}
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Search className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Предложения не найдены</h3>
                <p className="mt-1 text-muted-foreground">Попробуйте изменить параметры поиска или фильтры</p>
                {hasActiveFilters ? (
                  <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                    Сбросить фильтры
                  </Button>
                ) : null}
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-4",
                  viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1",
                )}
              >
                {filtered.map(item => (
                  <CatalogOfferCard key={`${item.kind}-${item.id}`} item={item} viewMode={viewMode} />
                ))}
              </div>
            )}

            {!isLoading && filtered.length > 0 ? (
              <p className="mt-8 text-center text-sm text-muted-foreground">{resultsLabel(filtered.length)}</p>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
