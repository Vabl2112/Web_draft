"use client"

import { useState } from "react"
import useSWR from "swr"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Header } from "@/components/header"
import { MasterCard } from "@/components/master-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const styleFilters = [
  "Все стили",
  "Реализм",
  "Графика",
  "Блэкворк",
  "Традишнл",
  "Акварель",
  "Минимализм",
  "Дотворк",
  "Геометрия",
]

export function MastersPage() {
  const { data, isLoading } = useSWR("/api/masters", fetcher)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("Все стили")
  const [sortBy, setSortBy] = useState("rating")

  const filteredMasters = data?.masters?.filter((master: { name: string; styles: string[] }) => {
    const matchesSearch = master.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStyle = selectedStyle === "Все стили" || master.styles.includes(selectedStyle)
    return matchesSearch && matchesStyle
  })?.sort((a: { rating: number; reviewsCount: number }, b: { rating: number; reviewsCount: number }) => {
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount
    return 0
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Мастера</h1>
          <p className="mt-1 text-muted-foreground">
            Найдите лучших тату-мастеров в вашем городе
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Filters */}
            <div className="hidden gap-2 sm:flex">
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
                    <label className="mb-2 block text-sm font-medium">Сортировка</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Сортировка" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">По рейтингу</SelectItem>
                        <SelectItem value="reviews">По отзывам</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Стиль</label>
                    <div className="flex flex-wrap gap-2">
                      {styleFilters.map((style) => (
                        <Badge
                          key={style}
                          variant={selectedStyle === style ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedStyle(style)}
                        >
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Style Tags - Desktop */}
        <div className="mb-6 hidden flex-wrap gap-2 sm:flex">
          {styleFilters.map((style) => (
            <Badge
              key={style}
              variant={selectedStyle === style ? "default" : "outline"}
              className="cursor-pointer transition-colors hover:bg-primary/90"
              onClick={() => setSelectedStyle(style)}
            >
              {style}
              {selectedStyle === style && style !== "Все стили" && (
                <X className="ml-1 size-3" onClick={(e) => { e.stopPropagation(); setSelectedStyle("Все стили") }} />
              )}
            </Badge>
          ))}
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
              <Button
                variant="link"
                onClick={() => { setSearchQuery(""); setSelectedStyle("Все стили") }}
              >
                Сбросить фильтры
              </Button>
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
      </main>
    </div>
  )
}
