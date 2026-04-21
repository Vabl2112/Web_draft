"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Clock, Star, TrendingUp, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { EntityActionsDropdown } from "@/components/entity-share-menu"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  service: {
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
}

function formatPrice(from: number, to: number | null): string {
  if (from === 0 && to === 0) return "Бесплатно"
  if (from === 0) return `до ${to?.toLocaleString("ru-RU")} руб.`
  if (!to) return `от ${from.toLocaleString("ru-RU")} руб.`
  return `${from.toLocaleString("ru-RU")} - ${to.toLocaleString("ru-RU")} руб.`
}

export function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const images = service.images || []
  const hasImages = images.length > 0

  const handleCardClick = () => {
    router.push(`/service/${service.id}`)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div 
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      {hasImages && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={images[currentImageIndex]}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage(e)
                }}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage(e)
                }}
              >
                <ChevronRight className="size-4" />
              </Button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`size-1.5 rounded-full transition-colors ${
                      idx === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(idx)
                    }}
                  />
                ))}
              </div>
            </>
          )}
          {service.popular && (
            <Badge className="absolute left-3 top-3 gap-1 bg-amber-100 text-amber-700">
              <TrendingUp className="size-3" />
              Популярно
            </Badge>
          )}
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <EntityActionsDropdown
              sharePath={`/service/${service.id}`}
              shareTitle={service.title}
              reportKind="услуга"
              icon="vertical"
              triggerClassName="bg-background/90 shadow-sm"
            />
            <Button
              variant="secondary"
              size="icon"
              className="size-8 bg-background/90 shadow-sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
            >
              <Heart className={cn("size-4", isLiked && "fill-destructive text-destructive")} />
            </Button>
          </div>
        </div>
      )}

      <div className="relative flex flex-1 flex-col p-4 sm:p-6">
        {!hasImages && (
          <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
            <EntityActionsDropdown
              sharePath={`/service/${service.id}`}
              shareTitle={service.title}
              reportKind="услуга"
              icon="vertical"
              triggerClassName="bg-background/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            />
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
              {!hasImages && service.popular && (
                <Badge className="gap-1 bg-amber-100 text-amber-700">
                  <TrendingUp className="size-3" />
                  Популярно
                </Badge>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {service.description}
            </p>

            {/* Duration */}
            <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>{service.duration}</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-left sm:text-right">
            <p className="text-xl font-bold text-foreground">
              {formatPrice(service.priceFrom, service.priceTo)}
            </p>
          </div>
        </div>

        {/* Master & Action */}
        <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Link 
            href={`/master/${service.master.id}`}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="size-10">
              <AvatarImage src={service.master.avatar} alt={service.master.name} />
              <AvatarFallback>{service.master.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{service.master.name}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>{service.master.rating}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
