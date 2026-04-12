"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Heart, 
  Star, 
  MapPin, 
  Trash2,
  Grid3X3,
  List,
  Search,
  Filter
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

const favoriteArtists = [
  {
    id: "1",
    name: "Мария Иванова",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    specialization: "Минимализм, Геометрия",
    location: "Москва",
    rating: 4.9,
    reviewsCount: 156,
    addedDate: "8 апреля 2024",
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    specialization: "Реализм, Портреты",
    location: "Москва",
    rating: 4.8,
    reviewsCount: 203,
    addedDate: "5 апреля 2024",
  },
  {
    id: "3",
    name: "Анна Петрова",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    specialization: "Акварель, Цветы",
    location: "Санкт-Петербург",
    rating: 4.7,
    reviewsCount: 89,
    addedDate: "1 апреля 2024",
  },
  {
    id: "4",
    name: "Игорь Новиков",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    specialization: "Трэш-полька, Blackwork",
    location: "Москва",
    rating: 4.9,
    reviewsCount: 178,
    addedDate: "28 марта 2024",
  },
]

const favoriteWorks = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=500&fit=crop",
    artistName: "Мария Иванова",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    title: "Геометрический узор",
    addedDate: "10 апреля 2024",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1590246814883-57764a58d1a3?w=400&h=400&fit=crop",
    artistName: "Дмитрий Козлов",
    artistAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    title: "Портрет льва",
    addedDate: "8 апреля 2024",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&h=600&fit=crop",
    artistName: "Анна Петрова",
    artistAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    title: "Цветочная композиция",
    addedDate: "5 апреля 2024",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=450&fit=crop",
    artistName: "Игорь Новиков",
    artistAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    title: "Трэш-полька",
    addedDate: "3 апреля 2024",
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&h=500&fit=crop",
    artistName: "Мария Иванова",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    title: "Минималистичные линии",
    addedDate: "1 апреля 2024",
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
    artistName: "Дмитрий Козлов",
    artistAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    title: "Японский дракон",
    addedDate: "28 марта 2024",
  },
]

const favoriteProducts = [
  {
    id: "1",
    title: "Крем для заживления татуировки",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    price: 1200,
    originalPrice: 1500,
    inStock: true,
    addedDate: "7 апреля 2024",
  },
  {
    id: "2",
    title: "Футболка EGG Studio",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    price: 2500,
    originalPrice: null,
    inStock: true,
    addedDate: "4 апреля 2024",
  },
  {
    id: "3",
    title: "Набор для ухода Premium",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop",
    price: 3500,
    originalPrice: 4200,
    inStock: false,
    addedDate: "1 апреля 2024",
  },
]

export function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("artists")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [artists, setArtists] = useState(favoriteArtists)
  const [works, setWorks] = useState(favoriteWorks)
  const [products, setProducts] = useState(favoriteProducts)

  const removeArtist = (id: string) => {
    setArtists(artists.filter(a => a.id !== id))
  }

  const removeWork = (id: string) => {
    setWorks(works.filter(w => w.id !== id))
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Избранное</h1>
              <p className="mt-1 text-muted-foreground">
                {artists.length + works.length + products.length} элементов
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="hidden gap-1 sm:flex">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="size-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="artists" className="gap-2">
                Мастера
                <Badge variant="secondary" className="ml-1">{artists.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="works" className="gap-2">
                Работы
                <Badge variant="secondary" className="ml-1">{works.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                Товары
                <Badge variant="secondary" className="ml-1">{products.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Artists Tab */}
            <TabsContent value="artists" className="mt-6">
              {artists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Heart className="size-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Нет избранных мастеров</h3>
                  <p className="mt-2 text-muted-foreground">
                    Добавляйте мастеров в избранное, чтобы быстро находить их
                  </p>
                  <Link href="/masters">
                    <Button className="mt-4">Найти мастеров</Button>
                  </Link>
                </div>
              ) : (
                <div className={cn(
                  "grid gap-4",
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                )}>
                  {artists.map((artist) => (
                    <Card key={artist.id} className="group overflow-hidden">
                      <CardContent className={cn(
                        "p-4",
                        viewMode === "list" && "flex items-center gap-4"
                      )}>
                        <Link href={`/master/${artist.id}`} className={cn(
                          "flex gap-4",
                          viewMode === "grid" && "flex-col items-center text-center"
                        )}>
                          <Avatar className={cn(
                            "ring-2 ring-background shadow-md",
                            viewMode === "grid" ? "size-20" : "size-14"
                          )}>
                            <AvatarImage src={artist.avatar} alt={artist.name} />
                            <AvatarFallback>{artist.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className={viewMode === "list" ? "flex-1" : ""}>
                            <h3 className="font-semibold">{artist.name}</h3>
                            <p className="text-sm text-muted-foreground">{artist.specialization}</p>
                            <div className="mt-1 flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-0.5">
                                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                <span>{artist.rating}</span>
                              </div>
                              <span className="text-muted-foreground">({artist.reviewsCount})</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="size-3.5" />
                              {artist.location}
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => removeArtist(artist.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Works Tab */}
            <TabsContent value="works" className="mt-6">
              {works.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Heart className="size-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Нет избранных работ</h3>
                  <p className="mt-2 text-muted-foreground">
                    Сохраняйте понравившиеся работы для вдохновения
                  </p>
                  <Link href="/gallery">
                    <Button className="mt-4">Смотреть галерею</Button>
                  </Link>
                </div>
              ) : (
                <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
                  {works.map((work) => (
                    <div key={work.id} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl">
                      <div className="relative aspect-auto">
                        <Image
                          src={work.imageUrl}
                          alt={work.title}
                          width={400}
                          height={500}
                          className="w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6 ring-2 ring-white">
                              <AvatarImage src={work.artistAvatar} alt={work.artistName} />
                              <AvatarFallback>{work.artistName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{work.artistName}</span>
                          </div>
                          <p className="mt-1 text-sm">{work.title}</p>
                        </div>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => removeWork(work.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-6">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Heart className="size-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Нет избранных товаров</h3>
                  <p className="mt-2 text-muted-foreground">
                    Добавляйте товары в избранное для быстрого доступа
                  </p>
                  <Link href="/products">
                    <Button className="mt-4">Смотреть товары</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <Card key={product.id} className="group overflow-hidden">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                            <Badge variant="secondary">Нет в наличии</Badge>
                          </div>
                        )}
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => removeProduct(product.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{product.title}</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-lg font-bold">
                            {product.price.toLocaleString("ru-RU")} &#8381;
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.originalPrice.toLocaleString("ru-RU")} &#8381;
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
