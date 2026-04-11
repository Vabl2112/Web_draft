"use client"

import { cn } from "@/lib/utils"
import type { GalleryCategory, GallerySubFilter } from "@/lib/types"

interface GalleryFiltersProps {
  categories: GalleryCategory[]
  activeCategory: string
  activeSubFilter: string | null
  onCategoryChange: (categoryId: string) => void
  onSubFilterChange: (subFilterId: string | null) => void
}

export function GalleryFilters({
  categories,
  activeCategory,
  activeSubFilter,
  onCategoryChange,
  onSubFilterChange,
}: GalleryFiltersProps) {
  const currentCategory = categories.find((c) => c.id === activeCategory)
  const subFilters = currentCategory?.subFilters || []

  return (
    <div className="space-y-4">
      {/* Main category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              onCategoryChange(category.id)
              onSubFilterChange(null)
            }}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
              activeCategory === category.id
                ? "bg-foreground text-background"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Sub-filters for selected category */}
      {subFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSubFilterChange(null)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeSubFilter === null
                ? "bg-amber-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Все
          </button>
          {subFilters.map((filter: GallerySubFilter) => (
            <button
              key={filter.id}
              onClick={() => onSubFilterChange(filter.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeSubFilter === filter.id
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {filter.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
