"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { CarouselApi } from "@/components/ui/carousel"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

export interface ImageCarouselProps {
  images: string[]
  alt?: string
  aspectRatio?: "square" | "video" | "portrait" | "fourThree" | "auto"
  /** Заполнить высоту родителя (карточки витрины masonry) */
  fillContainer?: boolean
  showControls?: boolean
  showDots?: boolean
  className?: string
  imageClassName?: string
  /** Свободный свайп между снимками; false — по одному кадру с щелчком */
  dragFree?: boolean
  onImageClick?: (index: number) => void
  /** Управляемый слайд (миниатюры на странице товара) */
  selectedIndex?: number
  onSlideChange?: (index: number) => void
}

function aspectClass(ratio: ImageCarouselProps["aspectRatio"], fill: boolean) {
  if (fill) return "h-full min-h-0 w-full"
  switch (ratio) {
    case "square":
      return "aspect-square"
    case "video":
      return "aspect-video"
    case "portrait":
      return "aspect-[3/4]"
    case "fourThree":
      return "aspect-[4/3]"
    default:
      return "aspect-auto min-h-[120px]"
  }
}

export function ImageCarousel({
  images,
  alt = "Image",
  aspectRatio = "square",
  fillContainer = false,
  showControls = true,
  showDots = true,
  className,
  imageClassName,
  dragFree = false,
  onImageClick,
  selectedIndex: controlledIndex,
  onSlideChange,
}: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const controlled = controlledIndex !== undefined

  const onSlideChangeRef = useRef(onSlideChange)
  onSlideChangeRef.current = onSlideChange

  const onImageClickRef = useRef(onImageClick)
  onImageClickRef.current = onImageClick

  const lastEmittedIndex = useRef<number | null>(null)
  /** Синхронизация scrollTo(selectedIndex) с Embla — не дублировать onSlideChange родителю */
  const isProgrammaticScroll = useRef(false)
  const programmaticScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    lastEmittedIndex.current = null
  }, [images])

  const syncFromApi = useCallback(() => {
    if (!api) return
    const i = api.selectedScrollSnap()
    setSelected(prev => (prev === i ? prev : i))

    if (isProgrammaticScroll.current) {
      lastEmittedIndex.current = i
      isProgrammaticScroll.current = false
      if (programmaticScrollTimer.current !== null) {
        clearTimeout(programmaticScrollTimer.current)
        programmaticScrollTimer.current = null
      }
      return
    }

    if (lastEmittedIndex.current === i) return
    lastEmittedIndex.current = i
    onSlideChangeRef.current?.(i)
  }, [api])

  useEffect(() => {
    if (!api) return
    syncFromApi()
    api.on("select", syncFromApi)
    api.on("reInit", syncFromApi)
    return () => {
      api.off("select", syncFromApi)
      api.off("reInit", syncFromApi)
    }
  }, [api, syncFromApi])

  useEffect(() => {
    if (!api || !onImageClickRef.current) return
    const onStatic = () => onImageClickRef.current?.(api.selectedScrollSnap())
    api.on("staticClick", onStatic)
    return () => {
      api.off("staticClick", onStatic)
    }
  }, [api])

  useEffect(() => {
    if (!api || !controlled || controlledIndex === undefined) return
    if (api.selectedScrollSnap() === controlledIndex) return
    isProgrammaticScroll.current = true
    if (programmaticScrollTimer.current !== null) {
      clearTimeout(programmaticScrollTimer.current)
    }
    api.scrollTo(controlledIndex)
    programmaticScrollTimer.current = setTimeout(() => {
      isProgrammaticScroll.current = false
      programmaticScrollTimer.current = null
    }, 200)
    return () => {
      if (programmaticScrollTimer.current !== null) {
        clearTimeout(programmaticScrollTimer.current)
        programmaticScrollTimer.current = null
      }
    }
  }, [api, controlled, controlledIndex])

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted text-muted-foreground",
          aspectClass(aspectRatio, fillContainer),
          className,
        )}
      >
        <span className="text-sm">Нет фото</span>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-lg",
          aspectClass(aspectRatio, fillContainer),
          className,
        )}
        onClick={() => onImageClickRef.current?.(0)}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onImageClickRef.current?.(0)
          }
        }}
        role={onImageClick ? "button" : undefined}
        tabIndex={onImageClick ? 0 : undefined}
      >
        <Image
          src={images[0]}
          alt={alt}
          fill
          className={cn("object-cover", imageClassName)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          draggable={false}
        />
      </div>
    )
  }

  /** Как в ленте (FeedPostCard): без touch-pan-x на обёртках — иначе жесты часто не доходят до Embla */
  return (
    <div
      className={cn("group relative w-full overflow-hidden bg-muted", fillContainer && "h-full min-h-0", className)}
      onPointerDown={e => e.stopPropagation()}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false, dragFree }}
        className={cn("w-full", fillContainer && "h-full min-h-0")}
      >
        <CarouselContent className={cn("-ml-0", fillContainer && "h-full")}>
          {images.map((src, i) => (
            <CarouselItem key={`${src}-${i}`} className={cn("basis-full pl-0", fillContainer && "h-full min-h-0")}>
              <div
                className={cn(
                  "relative w-full select-none",
                  fillContainer ? "h-full min-h-0" : aspectClass(aspectRatio, false),
                )}
              >
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className={cn("object-cover", imageClassName)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i === 0}
                  draggable={false}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {showControls ? (
          <>
            <CarouselPrevious
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 z-10 size-8 -translate-y-1/2 rounded-full border-0 bg-background/80 opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background/90 group-hover:opacity-100"
              onClick={e => e.stopPropagation()}
            />
            <CarouselNext
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 z-10 size-8 -translate-y-1/2 rounded-full border-0 bg-background/80 opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background/90 group-hover:opacity-100"
              onClick={e => e.stopPropagation()}
            />
          </>
        ) : null}

        {showDots ? (
          <div
            className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1"
            aria-hidden
          >
            {images.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "size-1.5 rounded-full bg-white/90 shadow transition-opacity",
                  index === selected ? "opacity-100" : "opacity-35",
                )}
              />
            ))}
          </div>
        ) : null}
      </Carousel>
    </div>
  )
}
