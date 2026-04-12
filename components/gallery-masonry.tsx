"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhotoDetailModal, type PhotoDetail, type PhotoComment } from "@/components/photo-detail-modal"
import type { GalleryImage } from "@/lib/types"

interface GalleryMasonryProps {
  images: GalleryImage[]
}

// Sample comments data for demo
const sampleComments: PhotoComment[] = [
  {
    id: "1",
    author: "Мария",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "Потрясающая работа! Очень красиво",
    timeAgo: "2 ч",
    likes: 12,
    isLiked: false,
  },
  {
    id: "2",
    author: "Дмитрий",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    text: "Впечатляет! Сколько времени заняла эта работа?",
    timeAgo: "5 ч",
    likes: 5,
    isLiked: true,
  },
  {
    id: "3",
    author: "Анна",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "Хочу такую же! Как записаться?",
    timeAgo: "1 д",
    likes: 3,
    isLiked: false,
  },
]

export function GalleryMasonry({ images }: GalleryMasonryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDetail | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set())

  const toggleLike = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(imageId)) {
        newSet.delete(imageId)
      } else {
        newSet.add(imageId)
      }
      return newSet
    })
  }
  
  const getHeightClass = (height: "small" | "medium" | "large") => {
    switch (height) {
      case "small":
        return "h-48 md:h-56"
      case "medium":
        return "h-64 md:h-72"
      case "large":
        return "h-80 md:h-96"
      default:
        return "h-64"
    }
  }

  // Distribute images across columns for masonry effect
  const columns = [[], [], [], []] as GalleryImage[][]
  images.forEach((image, index) => {
    columns[index % 4].push(image)
  })

  const handleImageClick = (image: GalleryImage, flatIndex: number) => {
    const photoDetail: PhotoDetail = {
      id: image.id,
      imageUrl: image.imageUrl,
      title: image.title,
      description: `Работа в стиле ${image.subCategory}. Выполнена профессиональным мастером с использованием качественных материалов.`,
      author: image.author,
      authorAvatar: image.authorAvatar,
      likes: Math.floor(Math.random() * 500) + 50,
      isLiked: likedImages.has(image.id),
      isSaved: false,
      comments: sampleComments,
      timeAgo: "3 дня назад",
      tags: [image.category, image.subCategory].filter(Boolean),
    }
    setSelectedPhoto(photoDetail)
    setSelectedIndex(flatIndex)
  }

  const handleModalLike = (photoId: string) => {
    setLikedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(photoId)) {
        newSet.delete(photoId)
      } else {
        newSet.add(photoId)
      }
      return newSet
    })
  }

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const prevImage = images[selectedIndex - 1]
      handleImageClick(prevImage, selectedIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedIndex < images.length - 1) {
      const nextImage = images[selectedIndex + 1]
      handleImageClick(nextImage, selectedIndex + 1)
    }
  }

  // Create a flat index map for navigation
  let flatIndex = 0

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {column.map((image) => {
              const currentFlatIndex = flatIndex++
              return (
                <div
                  key={image.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleImageClick(image, images.findIndex(img => img.id === image.id))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleImageClick(image, images.findIndex(img => img.id === image.id))
                    }
                  }}
                  className={`group relative cursor-pointer overflow-hidden rounded-xl ${getHeightClass(image.height)} focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Like button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(
                      "absolute right-3 top-3 z-10 transition-all duration-200",
                      likedImages.has(image.id) 
                        ? "opacity-100" 
                        : "opacity-0 group-hover:opacity-100"
                    )}
                    onClick={(e) => toggleLike(image.id, e)}
                  >
                    <Heart 
                      className={cn(
                        "size-4 transition-all duration-200", 
                        likedImages.has(image.id) && "fill-destructive text-destructive scale-110"
                      )} 
                    />
                  </Button>
                  
                  {/* Hover overlay with stats */}
                  <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="size-6 fill-white" />
                      <span className="font-semibold">{Math.floor(Math.random() * 500) + 50}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <MessageCircle className="size-6 fill-white" />
                      <span className="font-semibold">{Math.floor(Math.random() * 20) + 1}</span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8 border-2 border-white">
                        <AvatarImage src={image.authorAvatar} />
                        <AvatarFallback className="text-xs">
                          {image.author.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">
                        {image.author}
                      </span>
                    </div>
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
        onLike={handleModalLike}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={selectedIndex > 0}
        hasNext={selectedIndex < images.length - 1}
      />
    </>
  )
}
