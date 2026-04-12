"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PhotoDetailModal, type PhotoDetail, type PhotoComment } from "@/components/photo-detail-modal"
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
import type { PortfolioItem } from "@/lib/types"

interface PortfolioMasonryProps {
  items: PortfolioItem[]
  artistName?: string
  artistAvatar?: string
  isOwner?: boolean
  onEdit?: (item: PortfolioItem) => void
  onDelete?: (id: string) => void
}

// Sample comments data for demo
const sampleComments: PhotoComment[] = [
  {
    id: "1",
    author: "Мария",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "Потрясающая работа!",
    timeAgo: "2 ч",
    likes: 8,
    isLiked: false,
  },
  {
    id: "2",
    author: "Дмитрий",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    text: "Очень круто! Хочу записаться",
    timeAgo: "1 д",
    likes: 3,
    isLiked: true,
  },
]

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
  artistName = "Мастер",
  artistAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
  isOwner,
  onEdit,
  onDelete
}: PortfolioMasonryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDetail | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)

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

  const handleImageClick = (item: PortfolioItem) => {
    const index = items.findIndex(i => i.id === item.id)
    const images = getImages(item)
    const currentIdx = currentImageIndices[item.id] || 0
    
    const photoDetail: PhotoDetail = {
      id: item.id,
      imageUrl: images[currentIdx] || images[0],
      title: item.title,
      description: item.description || `Работа "${item.title}" выполнена профессиональным мастером.`,
      author: artistName,
      authorAvatar: artistAvatar,
      likes: Math.floor(Math.random() * 300) + 30,
      isLiked: false,
      isSaved: false,
      comments: sampleComments,
      timeAgo: "1 неделю назад",
      tags: [],
    }
    setSelectedPhoto(photoDetail)
    setSelectedIndex(index)
  }

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

  const handleCarouselNav = (itemId: string, direction: "prev" | "next", e: React.MouseEvent) => {
    e.stopPropagation()
    const item = items.find(i => i.id === itemId)
    if (!item) return
    
    const images = getImages(item)
    const currentIdx = currentImageIndices[itemId] || 0
    
    let newIdx: number
    if (direction === "prev") {
      newIdx = currentIdx === 0 ? images.length - 1 : currentIdx - 1
    } else {
      newIdx = currentIdx === images.length - 1 ? 0 : currentIdx + 1
    }
    
    setCurrentImageIndices(prev => ({ ...prev, [itemId]: newIdx }))
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
              const currentIdx = currentImageIndices[item.id] || 0
              const currentImage = images[currentIdx] || images[0]
              const hasMultipleImages = images.length > 1
              
              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-xl ${getHeightClass(item.height)}`}
                >
                  <button
                    onClick={() => handleImageClick(item)}
                    className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <Image
                      src={currentImage}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </button>
                  
                  {/* Carousel navigation for multiple images */}
                  {hasMultipleImages && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 size-7 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 bg-background/80"
                        onClick={(e) => handleCarouselNav(item.id, "prev", e)}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 size-7 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 bg-background/80"
                        onClick={(e) => handleCarouselNav(item.id, "next", e)}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                      
                      {/* Dots indicator */}
                      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-1">
                        {images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`size-1.5 rounded-full transition-all ${
                              idx === currentIdx ? "bg-white w-3" : "bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="size-5 fill-white" />
                      <span className="font-medium">{Math.floor(Math.random() * 300) + 30}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <MessageCircle className="size-5 fill-white" />
                      <span className="font-medium">{Math.floor(Math.random() * 15) + 1}</span>
                    </div>
                  </div>
                  
                  {/* Title at bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-sm font-medium text-white">{item.title}</span>
                  </div>
                  
                  {/* Actions menu for owner */}
                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="absolute right-2 top-2 size-8 opacity-0 transition-opacity group-hover:opacity-100 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          setEditingItem(item)
                        }}>
                          <Edit2 className="mr-2 size-4" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => handleDeleteClick(item.id, e)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
            <AlertDialogTitle>Удалить работу?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Работа будет удалена из вашего портфолио.
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
