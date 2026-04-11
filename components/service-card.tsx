"use client"

import Link from "next/link"
import { Clock, Star, TrendingUp } from "lucide-react"
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
  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-lg sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
            {service.popular && (
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
          href={`/artist/${service.master.id}`}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
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

        <Button className="w-full sm:w-auto">Записаться</Button>
      </div>
    </div>
  )
}
