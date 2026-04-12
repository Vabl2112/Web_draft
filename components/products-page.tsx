"use client"

import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Search, 
  SlidersHorizontal, 
  ShoppingCart, 
  Star, 
  Heart,
  Grid3X3,
  LayoutList,
  ChevronRight,
  X,
  Filter
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  image: string
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

interface Category {
  id: string
  name: string
}

function ProductCard({ product, viewMode }: { product: Product; viewMode: "grid" | "list" }) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleCardClick = () => {
    router.push(`/product/${product.id}`)
  }

  if (viewMode === "list") {
    return (
      <div 
        className="group flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-lg sm:gap-6 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image */}
        <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-40">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount && (
            <Badge className="absolute left-2 top-2 bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold text-foreground">
              {product.title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
            >
              <Heart className={cn("size-5", isLiked && "fill-destructive text-destructive")} />
            </Button>
          </div>
          
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewsCount})</span>
          </div>

          {/* Seller */}
          <Link
            href={`/master/${product.seller.id}`}
            className="mt-2 flex items-center gap-2 transition-opacity hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="size-5">
              <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
              <AvatarFallback>{product.seller.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{product.seller.name}</span>
          </Link>

          {/* Price and Action */}
          <div className="mt-auto flex items-end justify-between gap-4 pt-3">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">
                {product.price.toLocaleString("ru-RU")} &#8381;
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString("ru-RU")} &#8381;
                </span>
              )}
            </div>
            <Button 
              className="gap-2" 
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation()
                // Add to cart logic here
              }}
            >
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">В корзину</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount && (
          <Badge className="absolute left-3 top-3 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Badge variant="secondary" className="text-base">Нет в наличии</Badge>
          </div>
        )}
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          <Heart className={cn("size-4", isLiked && "fill-destructive text-destructive")} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-foreground">
          {product.title}
        </h3>
        
        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviewsCount})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            {product.price.toLocaleString("ru-RU")} &#8381;
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice.toLocaleString("ru-RU")} &#8381;
            </span>
          )}
        </div>

        {/* Seller */}
        <Link
          href={`/master/${product.seller.id}`}
          className="mt-3 flex items-center gap-2 transition-opacity hover:opacity-80"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="size-6">
            <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
            <AvatarFallback>{product.seller.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{product.seller.name}</span>
        </Link>

        {/* Action */}
        <Button 
          className="mt-4 w-full gap-2" 
          disabled={!product.inStock}
          onClick={(e) => {
            e.stopPropagation()
            // Add to cart logic here
          }}
        >
          <ShoppingCart className="size-4" />
          В корзину
        </Button>
      </div>
    </div>
  )
}

function CategoryCard({ category, isActive, onClick }: { 
  category: Category
  isActive: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
        isActive 
          ? "border-foreground bg-foreground text-background" 
          : "border-border bg-card text-foreground hover:border-foreground/30"
      )}
    >
      <span className="font-medium">{category.name}</span>
      <ChevronRight className={cn("size-4", isActive && "text-background")} />
    </button>
  )
}

export function ProductsPage() {
  const { data, isLoading } = useSWR("/api/products", fetcher)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceSort, setPriceSort] = useState("default")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const filteredProducts = data?.products
    ?.filter((product: Product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesStock = !showInStockOnly || product.inStock
      return matchesSearch && matchesCategory && matchesStock
    })
    ?.sort((a: Product, b: Product) => {
      if (priceSort === "low") return a.price - b.price
      if (priceSort === "high") return b.price - a.price
      if (priceSort === "rating") return b.rating - a.rating
      return 0
    })

  const activeFiltersCount = [
    selectedCategory !== "all",
    showInStockOnly,
    priceSort !== "default"
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedCategory("all")
    setShowInStockOnly(false)
    setPriceSort("default")
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Товары
          </h1>
          <p className="mt-1 text-muted-foreground">
            Качественные товары для ухода и стиля
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Категории
                </h3>
                <div className="flex flex-col gap-2">
                  {data?.categories?.map((cat: Category) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      isActive={selectedCategory === cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Наличие
                </h3>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="size-5 rounded border-border accent-foreground"
                  />
                  <span className="text-sm">Только в наличии</span>
                </label>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearFilters}
                >
                  <X className="mr-2 size-4" />
                  Сбросить фильтры
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Desktop Sort */}
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

                {/* View Mode Toggle - Desktop */}
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

                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative gap-2 lg:hidden">
                      <Filter className="size-4" />
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
                    
                    <div className="flex flex-col gap-6 overflow-y-auto pb-24">
                      {/* Categories */}
                      <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          Категории
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {data?.categories?.map((cat: Category) => (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.id)}
                              className={cn(
                                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                                selectedCategory === cat.id
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border text-foreground hover:border-foreground/30"
                              )}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort */}
                      <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          Сортировка
                        </h3>
                        <Select value={priceSort} onValueChange={setPriceSort}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите сортировку" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">По умолчанию</SelectItem>
                            <SelectItem value="low">Сначала дешевле</SelectItem>
                            <SelectItem value="high">Сначала дороже</SelectItem>
                            <SelectItem value="rating">По рейтингу</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Stock */}
                      <div>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          Наличие
                        </h3>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
                          <input
                            type="checkbox"
                            checked={showInStockOnly}
                            onChange={(e) => setShowInStockOnly(e.target.checked)}
                            className="size-5 rounded border-border accent-foreground"
                          />
                          <span>Только в наличии</span>
                        </label>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="absolute inset-x-0 bottom-0 border-t border-border bg-background p-4">
                      <SheetClose asChild>
                        <Button className="w-full" size="lg">
                          Применить фильтры
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters Pills - Mobile */}
            {(selectedCategory !== "all" || showInStockOnly) && (
              <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
                {selectedCategory !== "all" && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer gap-1 px-3 py-1"
                    onClick={() => setSelectedCategory("all")}
                  >
                    {data?.categories?.find((c: Category) => c.id === selectedCategory)?.name}
                    <X className="size-3" />
                  </Badge>
                )}
                {showInStockOnly && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer gap-1 px-3 py-1"
                    onClick={() => setShowInStockOnly(false)}
                  >
                    В наличии
                    <X className="size-3" />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {isLoading ? (
              <div className={cn(
                "grid gap-4",
                viewMode === "grid" 
                  ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton 
                    key={i} 
                    className={cn(
                      "rounded-2xl",
                      viewMode === "grid" ? "aspect-[3/4]" : "h-44"
                    )} 
                  />
                ))}
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Search className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Товары не найдены</h3>
                <p className="mt-1 text-muted-foreground">
                  Попробуйте изменить параметры поиска
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              <div className={cn(
                "grid gap-4",
                viewMode === "grid" 
                  ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}>
                {filteredProducts?.map((product: Product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Results Count */}
            {!isLoading && filteredProducts?.length > 0 && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                {filteredProducts.length === 1 
                  ? "Найден 1 товар" 
                  : `Найдено ${filteredProducts.length} товаров`
                }
              </p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
