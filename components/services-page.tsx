"use client"

import { useState } from "react"
import useSWR from "swr"
import { Search, SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/header"
import { ServiceCard } from "@/components/service-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ServicesPage() {
  const { data, isLoading } = useSWR("/api/services", fetcher)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceSort, setPriceSort] = useState("default")

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

  const filteredServices = data?.services
    ?.filter((service: Service) => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    ?.sort((a: Service, b: Service) => {
      if (priceSort === "low") return a.priceFrom - b.priceFrom
      if (priceSort === "high") return b.priceFrom - a.priceFrom
      return 0
    })

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

        {/* Categories - Desktop */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="hidden h-auto flex-wrap justify-start gap-1 bg-transparent p-0 sm:flex">
            {data?.categories?.map((cat: { id: string; name: string }) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="rounded-full border border-border px-4 py-2 data-[state=active]:border-foreground data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <SlidersHorizontal className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-4 pb-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Категория</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.categories?.map((cat: { id: string; name: string }) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Сортировка</label>
                    <Select value={priceSort} onValueChange={setPriceSort}>
                      <SelectTrigger>
                        <SelectValue placeholder="По цене" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">По умолчанию</SelectItem>
                        <SelectItem value="low">Сначала дешевле</SelectItem>
                        <SelectItem value="high">Сначала дороже</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
              <Button
                variant="link"
                onClick={() => { setSearchQuery(""); setSelectedCategory("all") }}
              >
                Сбросить фильтры
              </Button>
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
      </main>
    </div>
  )
}
