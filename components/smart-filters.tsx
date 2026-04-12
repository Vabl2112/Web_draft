"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, ChevronRight, X, Check, SlidersHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { FiltersConfig, CategoryFilter, SubFilter, ActiveFilters } from "@/lib/types"

interface SmartFiltersProps {
  config: FiltersConfig | null
  isLoading?: boolean
  activeFilters: ActiveFilters
  onFiltersChange: (filters: ActiveFilters) => void
  className?: string
}

// Desktop Sidebar Filters
export function SmartFiltersDesktop({
  config,
  isLoading,
  activeFilters,
  onFiltersChange,
  className,
}: SmartFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["categories"]))

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = activeFilters.category === categoryId ? null : categoryId
    onFiltersChange({
      category: newCategory,
      subFilters: newCategory ? {} : activeFilters.subFilters, // Reset sub-filters when changing category
    })
    
    // Auto-expand the category's sub-filters section
    if (newCategory) {
      setExpandedSections(prev => new Set([...prev, "subfilters"]))
    }
  }

  const handleSubFilterChange = (filterId: string, value: string, isMultiple: boolean) => {
    const current = activeFilters.subFilters[filterId]
    let newValue: string | string[]

    if (isMultiple) {
      const currentArray = Array.isArray(current) ? current : current ? [current as string] : []
      if (currentArray.includes(value)) {
        newValue = currentArray.filter(v => v !== value)
      } else {
        newValue = [...currentArray, value]
      }
      // Remove empty arrays
      if ((newValue as string[]).length === 0) {
        const { [filterId]: _, ...rest } = activeFilters.subFilters
        onFiltersChange({ ...activeFilters, subFilters: rest })
        return
      }
    } else {
      newValue = current === value ? "" : value
      if (!newValue) {
        const { [filterId]: _, ...rest } = activeFilters.subFilters
        onFiltersChange({ ...activeFilters, subFilters: rest })
        return
      }
    }

    onFiltersChange({
      ...activeFilters,
      subFilters: { ...activeFilters.subFilters, [filterId]: newValue },
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({ category: null, subFilters: {} })
  }

  const getActiveFiltersCount = () => {
    let count = activeFilters.category ? 1 : 0
    Object.values(activeFilters.subFilters).forEach(value => {
      if (Array.isArray(value)) {
        count += value.length
      } else if (value) {
        count += 1
      }
    })
    return count
  }

  const activeCategory = config?.categories.find(c => c.id === activeFilters.category)
  const activeFiltersCount = getActiveFiltersCount()

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!config) return null

  return (
    <div className={cn("space-y-6", className)}>
      {/* Categories Section */}
      <Collapsible
        open={expandedSections.has("categories")}
        onOpenChange={() => toggleSection("categories")}
      >
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between py-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Категории
            </h3>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                expandedSections.has("categories") && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {config.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                activeFilters.category === category.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              )}
            >
              <span className="font-medium">{category.name}</span>
              <ChevronRight
                className={cn(
                  "size-4",
                  activeFilters.category === category.id && "text-background"
                )}
              />
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Category-specific Sub-filters */}
      {activeCategory && activeCategory.subFilters.length > 0 && (
        <Collapsible
          open={expandedSections.has("subfilters")}
          onOpenChange={() => toggleSection("subfilters")}
        >
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between py-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {activeCategory.name}: фильтры
              </h3>
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform",
                  expandedSections.has("subfilters") && "rotate-180"
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            {activeCategory.subFilters.map((subFilter) => (
              <SubFilterSection
                key={subFilter.id}
                filter={subFilter}
                activeValues={activeFilters.subFilters[subFilter.id]}
                onChange={(value) =>
                  handleSubFilterChange(subFilter.id, value, subFilter.type === "multiple" || subFilter.type === "checkbox")
                }
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Common Filters */}
      {config.commonFilters && config.commonFilters.length > 0 && (
        <Collapsible
          open={expandedSections.has("common")}
          onOpenChange={() => toggleSection("common")}
        >
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between py-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Дополнительно
              </h3>
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform",
                  expandedSections.has("common") && "rotate-180"
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            {config.commonFilters.map((filter) => (
              <SubFilterSection
                key={filter.id}
                filter={filter}
                activeValues={activeFilters.subFilters[filter.id]}
                onChange={(value) =>
                  handleSubFilterChange(filter.id, value, filter.type === "multiple" || filter.type === "checkbox")
                }
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearAllFilters}>
          <X className="mr-2 size-4" />
          Сбросить фильтры ({activeFiltersCount})
        </Button>
      )}
    </div>
  )
}

// Sub-filter section component
function SubFilterSection({
  filter,
  activeValues,
  onChange,
}: {
  filter: SubFilter
  activeValues: string | string[] | { min: number; max: number } | undefined
  onChange: (value: string) => void
}) {
  const isMultiple = filter.type === "multiple" || filter.type === "checkbox"
  const activeArray = Array.isArray(activeValues) ? activeValues : activeValues ? [activeValues as string] : []

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground">{filter.name}</h4>
      <div className="flex flex-wrap gap-2">
        {filter.options.map((option) => {
          const isActive = isMultiple
            ? activeArray.includes(option.id)
            : activeValues === option.id

          if (filter.type === "checkbox") {
            return (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 transition-colors hover:border-foreground/30"
              >
                <Checkbox
                  checked={isActive}
                  onCheckedChange={() => onChange(option.id)}
                />
                <span className="text-sm">{option.name}</span>
                {option.count !== undefined && (
                  <span className="text-xs text-muted-foreground">({option.count})</span>
                )}
              </label>
            )
          }

          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-all",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground/30"
              )}
            >
              {isActive && isMultiple && <Check className="size-3" />}
              {option.name}
              {option.count !== undefined && !isActive && (
                <span className="text-xs opacity-60">({option.count})</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Mobile Filters Sheet
export function SmartFiltersMobile({
  config,
  isLoading,
  activeFilters,
  onFiltersChange,
}: SmartFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ActiveFilters>(activeFilters)
  const [isOpen, setIsOpen] = useState(false)

  // Sync local filters when activeFilters change from outside
  useEffect(() => {
    setLocalFilters(activeFilters)
  }, [activeFilters])

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = localFilters.category === categoryId ? null : categoryId
    setLocalFilters({
      category: newCategory,
      subFilters: newCategory ? {} : localFilters.subFilters,
    })
  }

  const handleSubFilterChange = (filterId: string, value: string, isMultiple: boolean) => {
    const current = localFilters.subFilters[filterId]
    let newValue: string | string[]

    if (isMultiple) {
      const currentArray = Array.isArray(current) ? current : current ? [current as string] : []
      if (currentArray.includes(value)) {
        newValue = currentArray.filter(v => v !== value)
      } else {
        newValue = [...currentArray, value]
      }
      if ((newValue as string[]).length === 0) {
        const { [filterId]: _, ...rest } = localFilters.subFilters
        setLocalFilters({ ...localFilters, subFilters: rest })
        return
      }
    } else {
      newValue = current === value ? "" : value
      if (!newValue) {
        const { [filterId]: _, ...rest } = localFilters.subFilters
        setLocalFilters({ ...localFilters, subFilters: rest })
        return
      }
    }

    setLocalFilters({
      ...localFilters,
      subFilters: { ...localFilters.subFilters, [filterId]: newValue },
    })
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    setIsOpen(false)
  }

  const clearFilters = () => {
    const emptyFilters = { category: null, subFilters: {} }
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const getActiveFiltersCount = () => {
    let count = activeFilters.category ? 1 : 0
    Object.values(activeFilters.subFilters).forEach(value => {
      if (Array.isArray(value)) {
        count += value.length
      } else if (value) {
        count += 1
      }
    })
    return count
  }

  const activeCategory = config?.categories.find(c => c.id === localFilters.category)
  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline">Фильтры</span>
          {activeFiltersCount > 0 && (
            <Badge className="absolute -right-2 -top-2 size-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Фильтры</SheetTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={clearFilters}
              >
                Сбросить
              </Button>
            )}
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-24" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
              ))}
            </div>
          </div>
        ) : config ? (
          <ScrollArea className="h-[calc(85vh-180px)] pr-4">
            <div className="space-y-6 pb-4">
              {/* Categories */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Категории
                </h3>
                <div className="flex flex-wrap gap-2">
                  {config.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                        localFilters.category === category.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:border-foreground/30"
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category-specific Sub-filters */}
              {activeCategory && activeCategory.subFilters.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {activeCategory.name}
                  </h3>
                  {activeCategory.subFilters.map((subFilter) => (
                    <SubFilterSection
                      key={subFilter.id}
                      filter={subFilter}
                      activeValues={localFilters.subFilters[subFilter.id]}
                      onChange={(value) =>
                        handleSubFilterChange(
                          subFilter.id,
                          value,
                          subFilter.type === "multiple" || subFilter.type === "checkbox"
                        )
                      }
                    />
                  ))}
                </div>
              )}

              {/* Common Filters */}
              {config.commonFilters && config.commonFilters.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Дополнительно
                  </h3>
                  {config.commonFilters.map((filter) => (
                    <SubFilterSection
                      key={filter.id}
                      filter={filter}
                      activeValues={localFilters.subFilters[filter.id]}
                      onChange={(value) =>
                        handleSubFilterChange(
                          filter.id,
                          value,
                          filter.type === "multiple" || filter.type === "checkbox"
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        ) : null}

        {/* Apply Button */}
        <div className="absolute inset-x-0 bottom-0 border-t border-border bg-background p-4">
          <Button className="w-full" size="lg" onClick={applyFilters}>
            Применить фильтры
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Active filters badges display
export function ActiveFiltersBadges({
  config,
  activeFilters,
  onFiltersChange,
}: {
  config: FiltersConfig | null
  activeFilters: ActiveFilters
  onFiltersChange: (filters: ActiveFilters) => void
}) {
  if (!config) return null

  const badges: { key: string; label: string; onRemove: () => void }[] = []

  // Category badge
  if (activeFilters.category) {
    const category = config.categories.find(c => c.id === activeFilters.category)
    if (category) {
      badges.push({
        key: `category-${category.id}`,
        label: category.name,
        onRemove: () => onFiltersChange({ ...activeFilters, category: null, subFilters: {} }),
      })
    }
  }

  // Sub-filter badges
  const activeCategory = config.categories.find(c => c.id === activeFilters.category)
  const allFilters = [...(activeCategory?.subFilters || []), ...(config.commonFilters || [])]

  Object.entries(activeFilters.subFilters).forEach(([filterId, value]) => {
    const filter = allFilters.find(f => f.id === filterId)
    if (!filter) return

    const values = Array.isArray(value) ? value : [value as string]
    values.forEach(v => {
      const option = filter.options.find(o => o.id === v)
      if (option) {
        badges.push({
          key: `${filterId}-${v}`,
          label: `${filter.name}: ${option.name}`,
          onRemove: () => {
            if (Array.isArray(value)) {
              const newValue = value.filter(x => x !== v)
              if (newValue.length === 0) {
                const { [filterId]: _, ...rest } = activeFilters.subFilters
                onFiltersChange({ ...activeFilters, subFilters: rest })
              } else {
                onFiltersChange({
                  ...activeFilters,
                  subFilters: { ...activeFilters.subFilters, [filterId]: newValue },
                })
              }
            } else {
              const { [filterId]: _, ...rest } = activeFilters.subFilters
              onFiltersChange({ ...activeFilters, subFilters: rest })
            }
          },
        })
      }
    })
  })

  if (badges.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(badge => (
        <Badge
          key={badge.key}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {badge.label}
          <button
            onClick={badge.onRemove}
            className="ml-1 rounded-full p-0.5 hover:bg-foreground/10"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {badges.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-muted-foreground"
          onClick={() => onFiltersChange({ category: null, subFilters: {} })}
        >
          Сбросить все
        </Button>
      )}
    </div>
  )
}
