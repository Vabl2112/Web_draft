"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Clock, RefreshCw, Star, Heart, Check, MoreVertical, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/image-carousel"
import { ServiceEditor } from "@/components/service-editor"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EntityActionsDropdown, EntityShareMenuItems } from "@/components/entity-share-menu"
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
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      onDelete?.(serviceToDelete)
    }
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }

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
              className="group relative flex cursor-pointer flex-col gap-4 rounded-lg border border-border p-4 pb-4 pl-4 pr-14 pt-12 transition-colors hover:bg-muted/50 sm:flex-row sm:items-stretch sm:pt-4"
              onClick={() => router.push(`/service/${service.id}`)}
            >
              <div
                className="absolute right-2 top-2 z-20 sm:right-3 sm:top-3"
                onClick={e => e.stopPropagation()}
              >
                {isOwner ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="size-9 shrink-0 rounded-md border border-border/70 shadow-sm"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                      <DropdownMenuItem onClick={() => setEditingService(service)}>
                        <Edit2 className="mr-2 size-4" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClick(service.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Удалить
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <EntityShareMenuItems
                        sharePath={`/service/${service.id}`}
                        shareTitle={service.title}
                        reportKind="услуга"
                        showReport={false}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <EntityActionsDropdown
                    sharePath={`/service/${service.id}`}
                    shareTitle={service.title}
                    reportKind="услуга"
                    icon="vertical"
                    align="end"
                    triggerClassName="size-9 rounded-md border border-border/70 bg-background shadow-sm"
                  />
                )}
              </div>

              {hasImages && (
                <div className="w-full shrink-0 sm:w-32" onClick={e => e.stopPropagation()}>
                  <ImageCarousel
                    images={service.images!}
                    alt={service.title}
                    aspectRatio="square"
                    showControls={true}
                    showDots={service.images!.length > 1}
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-3 lg:gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  {!hasImages && (
                    <div className="shrink-0 rounded-lg bg-muted p-2">
                      <IconComponent className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{service.title}</p>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 items-center justify-center px-1 sm:min-w-[7rem] sm:max-w-[12rem] sm:flex-none sm:px-3">
                  <p className="text-center text-base font-semibold tabular-nums leading-tight text-foreground">
                    {service.price}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit dialog */}
      <ServiceEditor
        mode="edit"
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
        initialData={editingService ? {
          ...editingService,
          images: editingService.images?.map((url, i) => ({ id: String(i), url })) || []
        } : undefined}
        onSave={(data) => {
          if (editingService) {
            onEdit?.({ 
              ...editingService, 
              ...data, 
              images: data.images?.map(img => img.url)
            })
          }
          setEditingService(null)
        }}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить услугу?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Услуга будет удалена из вашего профиля.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
