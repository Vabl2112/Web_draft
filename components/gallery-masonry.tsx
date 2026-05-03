"use client"

import { useCallback, useRef, useState } from "react"
import { PhotoDetailModal, type PhotoDetail, type PhotoComment } from "@/components/photo-detail-modal"
import { ShowcaseVitrinaCard } from "@/components/showcase-vitrina-card"
import { useSingleOrDoubleTap } from "@/hooks/use-single-or-double-tap"
import type { GalleryImage } from "@/lib/types"

interface GalleryMasonryProps {
  images: GalleryImage[]
  /** Глобальная витрина: имя мастера только на lg+ и по hover карточки */
  isGlobalFeed?: boolean
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

function gallerySlides(img: GalleryImage): string[] {
  if (img.images?.length) return img.images
  return [img.imageUrl]
}

export function GalleryMasonry({ images, isGlobalFeed = true }: GalleryMasonryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDetail | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set())
  const [likeBursts, setLikeBursts] = useState<{ key: number; imageId: string }[]>([])
  const burstSeq = useRef(0)

  const removeBurst = useCallback((burstKey: number) => {
    setLikeBursts(prev => prev.filter(b => b.key !== burstKey))
  }, [])

  const pushBurst = useCallback((imageId: string) => {
    const key = ++burstSeq.current
    setLikeBursts(prev => [...prev, { key, imageId }])
  }, [])

  /** Двойной тап через хук уже переключил лайк — игнорируем следующий браузерный dblclick */
  const skipNativeDblClickRef = useRef(false)

  const toggleLikeWithBurst = useCallback(
    (imageId: string) => {
      setLikedImages(prev => {
        const next = new Set(prev)
        if (next.has(imageId)) next.delete(imageId)
        else next.add(imageId)
        return next
      })
      pushBurst(imageId)
    },
    [pushBurst],
  )

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

  const columns = [[], [], [], []] as GalleryImage[][]
  images.forEach((image, index) => {
    columns[index % 4].push(image)
  })

  const handleImageClick = useCallback(
    (image: GalleryImage, flatIndex: number) => {
      const slides = gallerySlides(image)
      const photoDetail: PhotoDetail = {
        id: image.id,
        imageUrl: slides[0],
        images: slides,
        title: image.title,
        description: `Работа в стиле ${image.subCategory}. Выполнена профессиональным мастером с использованием качественных материалов.`,
        author: image.author,
        authorAvatar: image.authorAvatar,
        likes: 50 + (image.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 450),
        isLiked: likedImages.has(image.id),
        isSaved: false,
        comments: sampleComments,
        timeAgo: "3 дня назад",
        tags: [image.category, image.subCategory].filter(Boolean),
      }
      setSelectedPhoto(photoDetail)
      setSelectedIndex(flatIndex)
    },
    [likedImages],
  )

  type GalleryTapPayload = { image: GalleryImage; flatIndex: number }

  const onGalleryImageTap = useSingleOrDoubleTap<GalleryTapPayload>(
    ({ image, flatIndex }) => handleImageClick(image, flatIndex),
    ({ image }) => {
      setLikedImages(prev => {
        const next = new Set(prev)
        if (next.has(image.id)) next.delete(image.id)
        else next.add(image.id)
        return next
      })
      pushBurst(image.id)
    },
    p => p.image.id,
  )

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

  let flatIndex = 0

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {column.map(image => {
              const currentFlatIndex = flatIndex++
              const burstsForCard = likeBursts.filter(b => b.imageId === image.id).map(b => b.key)
              return (
                <ShowcaseVitrinaCard
                  key={image.id}
                  image={image}
                  heightClass={getHeightClass(image.height)}
                  isGlobalFeed={isGlobalFeed}
                  burstKeys={burstsForCard}
                  onBurstComplete={removeBurst}
                  onImageTap={() => onGalleryImageTap({ image, flatIndex: currentFlatIndex })}
                  onPhotoDoubleClick={e => {
                    if (skipNativeDblClickRef.current) return
                    e.preventDefault()
                    e.stopPropagation()
                    toggleLikeWithBurst(image.id)
                  }}
                  onKeyOpen={() => handleImageClick(image, currentFlatIndex)}
                />
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
