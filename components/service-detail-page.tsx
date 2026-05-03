"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, Star, Heart, MessageCircle } from "lucide-react"
import { ImageCarousel } from "@/components/image-carousel"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { EntityActionsDropdown } from "@/components/entity-share-menu"
import { cn } from "@/lib/utils"

interface ServiceDetailPageProps {
  serviceId: string
}

// Mock data - in real app this would come from API
const mockService = {
  id: "1",
  title: "Художественная татуировка",
  description: "Создание уникальных художественных татуировок в различных стилях. Работаю с эскизами клиентов или разрабатываю индивидуальный дизайн с нуля. Гарантирую качественное исполнение и бережное отношение к коже.",
  fullDescription: `Художественная татуировка — это не просто рисунок на теле, это произведение искусства, которое останется с вами навсегда. 

Я специализируюсь на различных стилях:
• Реализм — портреты, животные, природа
• Графика — геометрические узоры, дотворк
• Нео-традишнл — яркие цвета, чёткие контуры
• Минимализм — тонкие линии, простые формы

Процесс работы:
1. Консультация и обсуждение идеи
2. Разработка эскиза (бесплатные правки)
3. Согласование финального варианта
4. Нанесение татуировки
5. Инструктаж по уходу

Использую только качественные материалы и одноразовые расходники. Соблюдаю все санитарные нормы.`,
  priceFrom: 5000,
  priceTo: 25000,
  duration: "2-6 часов",
  category: "Татуировки",
  images: [
    "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1590246814883-57c511e53fb7?w=800&h=600&fit=crop"
  ],
  master: {
    id: "1",
    name: "Алексей Волков",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    title: "Тату-мастер",
    rating: 4.9,
    reviewsCount: 127,
    location: "Москва",
    metro: "м. Арбатская"
  },
  popular: true,
  reviewsCount: 45,
  completedCount: 234
}

function formatPrice(from: number, to: number | null): string {
  if (from === 0 && to === 0) return "Бесплатно"
  if (from === 0) return `до ${to?.toLocaleString("ru-RU")} руб.`
  if (!to) return `от ${from.toLocaleString("ru-RU")} руб.`
  return `${from.toLocaleString("ru-RU")} - ${to.toLocaleString("ru-RU")} руб.`
}

export function ServiceDetailPage({ serviceId }: ServiceDetailPageProps) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // In real app, fetch service data by serviceId
  const service = mockService

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-4 gap-2"
          onClick={() => router.push("/products?kind=service")}
        >
          <ArrowLeft className="size-4" />
          Назад к услугам
        </Button>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column - Images */}
          <div className="lg:col-span-3">
            {/* Main Image Carousel */}
            {service.images.length > 0 ? (
              <div className="space-y-3">
                <div className="group relative">
                  <ImageCarousel
                    images={service.images}
                    alt={service.title}
                    aspectRatio="fourThree"
                    className="cursor-pointer rounded-2xl bg-muted"
                    selectedIndex={currentImageIndex}
                    onSlideChange={setCurrentImageIndex}
                    onImageClick={() => setIsFullscreen(true)}
                  />
                  <div className="pointer-events-none absolute left-3 top-3 z-20 flex gap-2">
                    <span className="pointer-events-auto">
                      <EntityActionsDropdown
                        menuLead={{
                          title: service.master.name,
                          avatarUrl: service.master.avatar,
                          hint: "Мастер",
                        }}
                        sharePath={`/service/${serviceId}`}
                        shareTitle={service.title}
                        reportKind="услуга"
                        icon="vertical"
                        triggerClassName="size-9 rounded-full bg-background/80 backdrop-blur-sm border-0 shadow-none"
                      />
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="pointer-events-auto size-9 rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={e => {
                        e.stopPropagation()
                        setIsLiked(!isLiked)
                      }}
                    >
                      <Heart className={cn("size-4", isLiked && "fill-destructive text-destructive")} />
                    </Button>
                  </div>
                </div>

                {/* Thumbnails */}
                {service.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {service.images.map((img, idx) => (
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
                          alt={`${service.title} ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-muted">
                <span className="text-muted-foreground">Нет изображений</span>
              </div>
            )}

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Описание</h2>
              <div className="mt-4 whitespace-pre-line text-muted-foreground">
                {service.fullDescription}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Actions */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Main Info Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                {/* Category & Popular badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{service.category}</Badge>
                  {service.popular && (
                    <Badge className="bg-amber-100 text-amber-700">Популярно</Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="mt-4 text-2xl font-bold">{service.title}</h1>

                {/* Stats */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{service.master.rating}</span>
                    <span>({service.reviewsCount} отзывов)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>{service.completedCount} выполнено</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">Стоимость</p>
                  <p className="text-3xl font-bold text-foreground">
                    {formatPrice(service.priceFrom, service.priceTo)}
                  </p>
                </div>

                {/* Duration */}
                <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4" />
                  <span>Длительность: {service.duration}</span>
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    <MessageCircle className="size-4" />
                    Написать мастеру
                  </Button>
                </div>
              </div>

              {/* Master Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-medium text-muted-foreground">Мастер</p>
                
                <Link 
                  href={`/master/${service.master.id}`}
                  className="mt-4 flex items-center gap-4 transition-opacity hover:opacity-80"
                >
                  <Avatar className="size-16">
                    <AvatarImage src={service.master.avatar} alt={service.master.name} />
                    <AvatarFallback>{service.master.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{service.master.name}</p>
                    <p className="text-sm text-muted-foreground">{service.master.title}</p>
                    <div className="mt-1 flex items-center gap-1 text-sm">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{service.master.rating}</span>
                      <span className="text-muted-foreground">
                        ({service.master.reviewsCount})
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>{service.master.location}, {service.master.metro}</span>
                </div>

                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  asChild
                >
                  <Link href={`/master/${service.master.id}`}>
                    Профиль мастера
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setIsFullscreen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-[60] text-white hover:bg-white/20"
            onClick={() => setIsFullscreen(false)}
          >
            <span className="sr-only">Закрыть</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>

          <div
            className="relative z-[55] h-[90vh] w-[min(96vw,1200px)] px-2"
            onClick={e => e.stopPropagation()}
          >
            <ImageCarousel
              images={service.images}
              alt={service.title}
              fillContainer
              aspectRatio="auto"
              className="rounded-lg"
              imageClassName="object-contain"
              showControls={false}
              selectedIndex={currentImageIndex}
              onSlideChange={setCurrentImageIndex}
            />
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
