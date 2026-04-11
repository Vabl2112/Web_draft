"use client"

import { Pencil, Clock, RefreshCw, Star, Heart, Check, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/image-carousel"
import { ServiceEditor } from "@/components/service-editor"
import type { Service } from "@/lib/types"

interface ServicesCardProps {
  services: Service[]
  isOwner?: boolean
  onEdit?: (service: Service) => void
  onDelete?: (id: string) => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  pencil: Pencil,
  clock: Clock,
  refresh: RefreshCw,
  star: Star,
  heart: Heart,
  check: Check,
}

export function ServicesCard({ services, isOwner, onEdit, onDelete }: ServicesCardProps) {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">Услуг пока нет</p>
          {isOwner && (
            <p className="mt-1 text-sm text-muted-foreground">
              Добавьте первую услугу, нажав кнопку выше
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon] || Pencil
          const hasImages = service.images && service.images.length > 0
          
          return (
            <div 
              key={service.id} 
              className="group relative flex flex-col gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-start"
            >
              {/* Image carousel if available */}
              {hasImages && (
                <div className="w-full shrink-0 sm:w-32">
                  <ImageCarousel
                    images={service.images!}
                    alt={service.title}
                    aspectRatio="square"
                    showControls={true}
                    showDots={service.images!.length > 1}
                  />
                </div>
              )}
              
              {/* Service info */}
              <div className="flex flex-1 items-start gap-3">
                {!hasImages && (
                  <div className="shrink-0 rounded-lg bg-muted p-2">
                    <IconComponent className="size-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{service.title}</p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
                <p className="shrink-0 whitespace-nowrap font-semibold text-foreground">
                  {service.price}
                </p>
              </div>
              
              {/* Edit/Delete buttons for owner */}
              {isOwner && (
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <ServiceEditor
                    mode="edit"
                    initialData={{
                      ...service,
                      images: service.images?.map((url, i) => ({ id: String(i), url })) || []
                    }}
                    onSave={(data) => onEdit?.({ 
                      ...service, 
                      ...data, 
                      images: data.images?.map(img => img.url)
                    })}
                    trigger={
                      <Button variant="ghost" size="icon" className="size-7">
                        <Edit2 className="size-3.5" />
                      </Button>
                    }
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-7 text-destructive"
                    onClick={() => onDelete?.(service.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
