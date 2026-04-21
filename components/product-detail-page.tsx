"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Star, 
  Heart,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Check,
  MessageCircle
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { EntityActionsDropdown } from "@/components/entity-share-menu"
import { cn } from "@/lib/utils"

interface ProductDetailPageProps {
  productId: string
}

interface Product {
  id: string
  title: string
  description: string
  fullDescription: string
  price: number
  originalPrice: number | null
  images: string[]
  category: string
  inStock: boolean
  stockCount: number
  rating: number
  reviewsCount: number
  ordersCount: number
  sku: string
  seller: {
    id: string
    name: string
    avatar: string
    title: string
    rating: number
    productsCount: number
  }
  sizes: string[] | null
  colors: { name: string; value: string }[] | null
  specifications: { label: string; value: string }[]
  reviews: {
    id: string
    author: string
    avatar: string
    rating: number
    date: string
    text: string
    helpful: number
  }[]
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<{ name: string; value: string } | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error("Товар не найден")
        }
        const data = await response.json()
        setProduct(data.product)
        if (data.product.colors?.length) {
          setSelectedColor(data.product.colors[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProduct()
  }, [productId])
  
  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const goToPrevImage = () => {
    if (!product) return
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const goToNextImage = () => {
    if (!product) return
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Button variant="ghost" className="mb-4 gap-2" onClick={() => router.push("/products")}>
            <ArrowLeft className="size-4" />
            Назад к товарам
          </Button>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="size-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Button variant="ghost" className="mb-4 gap-2" onClick={() => router.push("/products")}>
            <ArrowLeft className="size-4" />
            Назад к товарам
          </Button>
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-muted-foreground">{error || "Товар не найден"}</p>
            <Button className="mt-4" onClick={() => router.push("/products")}>
              Вернуться к товарам
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Breadcrumb / Back */}
        <Button 
          variant="ghost" 
          className="mb-4 gap-2"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="size-4" />
          Назад к товарам
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Images */}
          <div className="space-y-3">
            {/* Main Image */}
            <div 
              className="group relative aspect-square overflow-hidden rounded-2xl bg-muted cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            >
              <Image
                src={product.images[currentImageIndex]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              
              {/* Discount badge */}
              {discount && (
                <Badge className="absolute left-3 top-3 bg-destructive text-destructive-foreground text-sm px-3 py-1">
                  -{discount}%
                </Badge>
              )}
              
              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      goToPrevImage()
                    }}
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      goToNextImage()
                    }}
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </>
              )}
              
              {/* Actions */}
              <div className="absolute right-3 top-3 flex flex-row gap-2">
                <EntityActionsDropdown
                  sharePath={`/product/${productId}`}
                  shareTitle={product.title}
                  reportKind="товар"
                  icon="vertical"
                  triggerClassName="size-9 rounded-full bg-background/80 backdrop-blur-sm border-0 shadow-none"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-9 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLiked(!isLiked)
                  }}
                >
                  <Heart className={cn("size-4", isLiked && "fill-destructive text-destructive")} />
                </Button>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "relative shrink-0 size-20 overflow-hidden rounded-lg transition-all",
                      idx === currentImageIndex 
                        ? "ring-2 ring-primary ring-offset-2" 
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">
            {/* Category & Stock */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.inStock ? (
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                  <Check className="mr-1 size-3" />
                  В наличии ({product.stockCount} шт.)
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Нет в наличии
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold lg:text-3xl">{product.title}</h1>

            {/* Rating & Orders */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewsCount} отзывов)</span>
              </div>
              <div className="text-muted-foreground">
                <Package className="mr-1 inline-block size-4" />
                {product.ordersCount} заказов
              </div>
              <div className="text-muted-foreground">
                Артикул: {product.sku}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">
                {product.price.toLocaleString("ru-RU")} &#8381;
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString("ru-RU")} &#8381;
                </span>
              )}
            </div>

            <Separator />

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium">
                  Цвет: <span className="text-muted-foreground">{selectedColor?.name}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "size-10 rounded-full border-2 transition-all",
                        selectedColor?.name === color.name 
                          ? "border-primary ring-2 ring-primary ring-offset-2" 
                          : "border-border hover:border-foreground/50"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Размер</p>
                  <button className="text-sm text-primary hover:underline">
                    Таблица размеров
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-12 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                        selectedSize === size 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-border hover:border-foreground/50"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Доставка</p>
                  <p className="text-sm text-muted-foreground">
                    Бесплатно при заказе от 3000 руб. СДЭК, Почта России, курьером
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Возврат</p>
                  <p className="text-sm text-muted-foreground">
                    14 дней на возврат без объяснения причин
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Гарантия</p>
                  <p className="text-sm text-muted-foreground">
                    Качество принта гарантируем на 50+ стирок
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Продавец</p>
              
              <Link 
                href={`/master/${product.seller.id}`}
                className="flex items-center gap-4 transition-opacity hover:opacity-80"
              >
                <Avatar className="size-12">
                  <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                  <AvatarFallback>{product.seller.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{product.seller.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span>{product.seller.rating}</span>
                    <span>•</span>
                    <span>{product.seller.productsCount} товаров</span>
                  </div>
                </div>
              </Link>

              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <MessageCircle className="size-4" />
                  Написать
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/master/${product.seller.id}`}>
                    Все товары
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="specs">Характеристики</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы ({product.reviewsCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-4">{product.description}</p>
                <div className="whitespace-pre-line text-muted-foreground">
                  {product.fullDescription}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specs" className="mt-6">
              <div className="rounded-xl border border-border divide-y divide-border">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between p-4">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex items-center gap-6 p-6 rounded-xl border border-border">
                  <div className="text-center">
                    <div className="text-5xl font-bold">{product.rating}</div>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={cn(
                            "size-4",
                            star <= Math.round(product.rating) 
                              ? "fill-amber-400 text-amber-400" 
                              : "text-muted"
                          )} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {product.reviewsCount} отзывов
                    </div>
                  </div>
                  
                  <Separator orientation="vertical" className="h-20" />
                  
                  <div className="flex-1">
                    <Button>Написать отзыв</Button>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarImage src={review.avatar} alt={review.author} />
                            <AvatarFallback>{review.author.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.author}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {[1,2,3,4,5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={cn(
                                      "size-3",
                                      star <= review.rating 
                                        ? "fill-amber-400 text-amber-400" 
                                        : "text-muted"
                                    )} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="mt-3 text-muted-foreground">{review.text}</p>
                      
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-foreground">
                          Полезно ({review.helpful})
                        </button>
                        <button className="hover:text-foreground">Ответить</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setIsFullscreen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white hover:bg-white/20"
            onClick={() => setIsFullscreen(false)}
          >
            <span className="sr-only">Закрыть</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
          
          <div className="relative h-[90vh] w-[90vw]">
            <Image
              src={product.images[currentImageIndex]}
              alt={product.title}
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {product.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevImage()
                }}
              >
                <ChevronLeft className="size-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNextImage()
                }}
              >
                <ChevronRight className="size-6" />
              </Button>
              
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(idx)
                    }}
                    className={cn(
                      "size-2.5 rounded-full transition-all",
                      idx === currentImageIndex 
                        ? "bg-white w-6" 
                        : "bg-white/50 hover:bg-white/80"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      <Footer />
    </div>
  )
}
