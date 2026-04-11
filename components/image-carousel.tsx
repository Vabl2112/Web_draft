"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageCarouselProps {
  images: string[]
  alt?: string
  aspectRatio?: "square" | "video" | "portrait" | "auto"
  showControls?: boolean
  showDots?: boolean
  className?: string
  imageClassName?: string
  onImageClick?: (index: number) => void
}

export function ImageCarousel({
  images,
  alt = "Image",
  aspectRatio = "square",
  showControls = true,
  showDots = true,
  className,
  imageClassName,
  onImageClick,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const goToSlide = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(index)
  }, [])

  if (!images || images.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted rounded-lg",
        aspectRatio === "square" && "aspect-square",
        aspectRatio === "video" && "aspect-video",
        aspectRatio === "portrait" && "aspect-[3/4]",
        className
      )}>
        <span className="text-muted-foreground text-sm">No images</span>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div 
        className={cn(
          "relative overflow-hidden rounded-lg",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "video" && "aspect-video",
          aspectRatio === "portrait" && "aspect-[3/4]",
          className
        )}
        onClick={() => onImageClick?.(0)}
      >
        <Image
          src={images[0]}
          alt={alt}
          fill
          className={cn("object-cover", imageClassName)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-lg",
        aspectRatio === "square" && "aspect-square",
        aspectRatio === "video" && "aspect-video",
        aspectRatio === "portrait" && "aspect-[3/4]",
        className
      )}
    >
      {/* Main Image */}
      <div 
        className="relative h-full w-full cursor-pointer"
        onClick={() => onImageClick?.(currentIndex)}
      >
        <Image
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          fill
          className={cn("object-cover transition-opacity duration-300", imageClassName)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Navigation Arrows */}
      {showControls && images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 size-8 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={goToPrevious}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous image</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 size-8 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={goToNext}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Next image</span>
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              className={cn(
                "size-2 rounded-full transition-all",
                index === currentIndex 
                  ? "bg-white w-4" 
                  : "bg-white/60 hover:bg-white/80"
              )}
            >
              <span className="sr-only">Go to image {index + 1}</span>
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute right-2 top-2 rounded-full bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  )
}
