"use client"

import { useCallback, useState } from "react"
import { Heart, MoreVertical, Edit2, Trash2 } from "lucide-react"
import { ImageCarousel } from "@/components/image-carousel"
import { Button } from "@/components/ui/button"
import { PhotoDetailModal, type PhotoDetail } from "@/components/photo-detail-modal"
import { PortfolioItemEditor } from "@/components/portfolio-item-editor"
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
import { EntityShareMenuItems } from "@/components/entity-share-menu"
import { useSingleOrDoubleTap } from "@/hooks/use-single-or-double-tap"
import type { PortfolioItem } from "@/lib/types"
import { normalizeShowcaseKind, ShowcaseKindBadge } from "@/components/showcase-kind-badge"
import { cn } from "@/lib/utils"

interface PortfolioMasonryProps {
  items: PortfolioItem[]
  /** Для ссылок «поделиться» на профиль мастера */
  masterId: string
  artistName?: string
  artistAvatar?: string
  isOwner?: boolean
  onEdit?: (item: PortfolioItem) => void
  onDelete?: (id: string) => void
}

// Helper to get images array (backwards compatible)
function getImages(item: PortfolioItem): string[] {
  // Support both old imageUrl and new images array
  if (item.images && item.images.length > 0) {
    return item.images
  }
  // Fallback for old data format
  if ((item as any).imageUrl) {
    return [(item as any).imageUrl]
  }
  return []
}

export function PortfolioMasonry({
  items,
  masterId,
  artistName = "Мастер",
  artistAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
  isOwner,
  onEdit,
  onDelete,
}: PortfolioMasonryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDetail | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [slideByItem, setSlideByItem] = useState<Record<string, number>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({})
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete?.(itemToDelete)
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const getHeightClass = (height: PortfolioItem["height"]) => {
    switch (height) {
      case "small":
        return "h-48 sm:h-56"
      case "medium":
        return "h-64 sm:h-72"
      case "large":
        return "h-80 sm:h-96"
      default:
        return "h-64"
    }
  }

  // Split items into columns for masonry effect
  const columns = [[], [], [], []] as PortfolioItem[][]
  items.forEach((item, index) => {
    columns[index % 4].push(item)
  })

  const handleImageClick = useCallback(
    (item: PortfolioItem) => {
      const index = items.findIndex(i => i.id === item.id)
      const images = getImages(item)
      const currentIdx = slideByItem[item.id] ?? 0

      const photoDetail: PhotoDetail = {
        id: item.id,
        imageUrl: images[currentIdx] || images[0],
        images,
        title: item.title,
        description: item.description || `Работа "${item.title}" выполнена профессиональным мастером.`,
        author: artistName,
        authorAvatar: artistAvatar,
        likes:
          30 +
          (item.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 270),
        isLiked: likedIds[item.id] ?? false,
        isSaved: false,
        comments: [],
        timeAgo: "1 неделю назад",
        tags: [],
      }
      setSelectedPhoto(photoDetail)
      setSelectedIndex(index)
    },
    [artistAvatar, artistName, items, likedIds, slideByItem],
  )

  const onPortfolioImageTap = useSingleOrDoubleTap<PortfolioItem>(
    handleImageClick,
    item => setLikedIds(prev => ({ ...prev, [item.id]: !prev[item.id] })),
    i => i.id,
  )

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      handleImageClick(items[selectedIndex - 1])
    }
  }

  const handleNext = () => {
    if (selectedIndex < items.length - 1) {
      handleImageClick(items[selectedIndex + 1])
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Работ пока нет</p>
        {isOwner && (
          <p className="mt-1 text-sm text-muted-foreground">
            Добавьте первую работу, нажав кнопку выше
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3">
            {column.map((item) => {
              const images = getImages(item)
              const cardKind = normalizeShowcaseKind(item.showcaseKind)

              return (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-xl ${getHeightClass(item.height)}`}
                >
                  <div className="absolute left-2 top-2 z-[15]">
                    <ShowcaseKindBadge kind={cardKind} />
                  </div>
                  <div className="relative z-0 h-full w-full min-h-0">
                    <ImageCarousel
                      images={images}
                      alt={item.title}
                      fillContainer
                      aspectRatio="auto"
                      className="rounded-xl"
                      showDots={images.length > 1}
                      onSlideChange={i => setSlideByItem(prev => ({ ...prev, [item.id]: i }))}
                      onImageClick={() => onPortfolioImageTap(item)}
                    />
                  </div>

                  <div className="absolute right-3 top-3 z-30 flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className={cn(
                        "size-9 rounded-xl border border-border/70 bg-background/95 shadow-sm",
                        likedIds[item.id] && "border-destructive/30",
                      )}
                      aria-pressed={!!likedIds[item.id]}
                      aria-label={likedIds[item.id] ? "Снять лайк" : "Нравится"}
                      onClick={e => {
                        e.stopPropagation()
                        setLikedIds(prev => ({ ...prev, [item.id]: !prev[item.id] }))
                      }}
                    >
                      <Heart
                        className={cn(
                          "size-4",
                          likedIds[item.id] ? "fill-destructive text-destructive" : "text-foreground",
                        )}
                      />
                    </Button>
                    {isOwner ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="size-9 rounded-xl border border-border/70 bg-background/95 shadow-sm"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation()
                              setEditingItem(item)
                            }}
                          >
                            <Edit2 className="mr-2 size-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={e => handleDeleteClick(item.id, e)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Удалить
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <EntityShareMenuItems
                            sharePath={`/master/${masterId}`}
                            shareTitle={`${item.title} — ${artistName}`}
                            reportKind="публикация на витрине"
                            showReport={false}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <PhotoDetailModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => {
          setSelectedPhoto(null)
          setSelectedIndex(-1)
        }}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={selectedIndex > 0}
        hasNext={selectedIndex < items.length - 1}
        hideAuthorHeader
        showcaseMinimal
        onLike={id =>
          setLikedIds(prev => ({
            ...prev,
            [id]: !prev[id],
          }))
        }
      />

      {/* Edit dialog */}
      {editingItem && (
        <PortfolioItemEditor
          mode="edit"
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          initialData={{
            id: editingItem.id,
            title: editingItem.title,
            description: editingItem.description,
            images: getImages(editingItem).map((url, i) => ({ id: String(i), url }))
          }}
          onSave={(data) => {
            onEdit?.({ 
              ...editingItem,
              title: data.title,
              description: data.description,
              images: data.images.map(img => img.url)
            })
            setEditingItem(null)
          }}
        />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить с витрины?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Карточка будет удалена с витрины.
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
    </>
  )
}
