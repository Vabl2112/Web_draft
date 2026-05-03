"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { GalleryFilters } from "@/components/gallery-filters"
import { GalleryMasonry } from "@/components/gallery-masonry"
import { ShowcaseKindSwitch, type ShowcaseKindFilter } from "@/components/showcase-kind-switch"
import { Skeleton } from "@/components/ui/skeleton"
import { normalizeShowcaseKind } from "@/components/showcase-kind-badge"
import type { GalleryCategory, GalleryImage } from "@/lib/types"

interface GalleryResponse {
  categories: GalleryCategory[]
  currentCategory: GalleryCategory
  images: GalleryImage[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("painting")
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null)
  const [showcaseKind, setShowcaseKind] = useState<ShowcaseKindFilter>("all")

  const apiUrl = `/api/gallery?category=${activeCategory}${activeSubFilter ? `&subCategory=${activeSubFilter}` : ""}`

  const { data, isLoading } = useSWR<GalleryResponse>(apiUrl, fetcher, {
    keepPreviousData: true,
  })

  const filteredImages = useMemo(() => {
    if (!data?.images?.length) return []
    if (showcaseKind === "all") return data.images
    return data.images.filter(img => normalizeShowcaseKind(img.showcaseKind) === showcaseKind)
  }, [data?.images, showcaseKind])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Витрина</h1>
          <p className="max-w-2xl text-muted-foreground">
            Работы портфолио и записи авторов — одна кирпичная сетка, как в ленте. Фильтруйте сверху по типу
            публикации.
          </p>
        </div>

        <div className="mb-6">
          <ShowcaseKindSwitch value={showcaseKind} onChange={setShowcaseKind} stretch className="max-w-xl" />
        </div>

        <div className="mb-8">
          {data ? (
            <GalleryFilters
              categories={data.categories}
              activeCategory={activeCategory}
              activeSubFilter={activeSubFilter}
              onCategoryChange={setActiveCategory}
              onSubFilterChange={setActiveSubFilter}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-9 w-20 rounded-full" />
                ))}
              </div>
            </div>
          )}
        </div>

        {isLoading && !data ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map(col => (
              <div key={col} className="flex flex-col gap-4">
                {[1, 2, 3].map(row => {
                  const skeletonHeightsPx = [232, 268, 304, 248, 288, 320, 216, 296, 256, 272, 240, 312]
                  const idx = (col - 1) * 3 + (row - 1)
                  return (
                    <Skeleton
                      key={row}
                      className="rounded-xl"
                      style={{ height: `${skeletonHeightsPx[idx % skeletonHeightsPx.length]}px` }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        ) : filteredImages.length > 0 ? (
          <GalleryMasonry images={filteredImages} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground">
              Нет публикаций выбранного типа для текущего фильтра
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
