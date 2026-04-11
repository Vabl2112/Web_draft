"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle } from "lucide-react"
import { PhotoDetailModal, type PhotoDetail, type PhotoComment } from "@/components/photo-detail-modal"
import type { PortfolioItem } from "@/lib/types"

interface PortfolioMasonryProps {
  items: PortfolioItem[]
  artistName?: string
  artistAvatar?: string
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

export function PortfolioMasonry({ 
  items, 
  artistName = "Мастер",
  artistAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
}: PortfolioMasonryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDetail | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

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
    const photoDetail: PhotoDetail = {
      id: item.id,
      imageUrl: item.imageUrl,
      title: item.title,
      description: `Работа "${item.title}" выполнена профессиональным мастером.`,
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

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3">
            {column.map((item) => (
              <button
                key={item.id}
                onClick={() => handleImageClick(item)}
                className={`group relative overflow-hidden rounded-xl ${getHeightClass(item.height)} focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-1 text-white">
                    <Heart className="size-5 fill-white" />
                    <span className="font-medium">{Math.floor(Math.random() * 300) + 30}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <MessageCircle className="size-5 fill-white" />
                    <span className="font-medium">{Math.floor(Math.random() * 15) + 1}</span>
                  </div>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm font-medium text-white">{item.title}</span>
                </div>
              </button>
            ))}
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
    </>
  )
}
