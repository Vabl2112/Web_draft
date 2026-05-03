"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ImageCarouselProps {
  images: string[]
  alt?: string
  aspectRatio?: "square" | "video" | "portrait" | "fourThree" | "auto"
  /** Заполнить высоту родителя (карточки витрины masonry) */
  fillContainer?: boolean
  /** Стрелки влево/вправо: до md скрыты (свайп); с md — при наведении на карусель. false — не показывать (полноэкран и т.п.) */
  showControls?: boolean
  showDots?: boolean
  className?: string
  imageClassName?: string
  /** Свободный свайп между снимками (игнорируется: используется snap по одному кадру) */
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

const SCROLL_EDGE_EPS = 4

function readSnapIndex(el: HTMLDivElement, count: number) {
  const w = el.clientWidth
  if (w <= 0) return 0
  return Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / w)))
}

function readScrollEdges(el: HTMLDivElement) {
  const maxScroll = el.scrollWidth - el.clientWidth
  if (maxScroll <= SCROLL_EDGE_EPS) {
    return { canPrev: false, canNext: false }
  }
  return {
    canPrev: el.scrollLeft > SCROLL_EDGE_EPS,
    canNext: el.scrollLeft < maxScroll - SCROLL_EDGE_EPS,
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
  dragFree: _dragFree = false,
  onImageClick,
  selectedIndex: controlledIndex,
  onSlideChange,
}: ImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(0)
  const controlled = controlledIndex !== undefined

  const onSlideChangeRef = useRef(onSlideChange)
  onSlideChangeRef.current = onSlideChange

  const onImageClickRef = useRef(onImageClick)
  onImageClickRef.current = onImageClick

  const lastEmittedIndex = useRef<number | null>(null)
  const isProgrammaticScroll = useRef(false)
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pointerStartRef = useRef<{ x: number; y: number; scroll: number } | null>(null)

  /** Кнопки без disabled — по фактическому scrollLeft (иначе «серая» стрелка при smooth scroll) */
  const [scrollEdges, setScrollEdges] = useState({ canPrev: false, canNext: true })

  const updateScrollEdges = useCallback(() => {
    const el = scrollRef.current
    if (!el || images.length <= 1) return
    const { canPrev, canNext } = readScrollEdges(el)
    setScrollEdges(prev => (prev.canPrev === canPrev && prev.canNext === canNext ? prev : { canPrev, canNext }))
  }, [images.length])

  useEffect(() => {
    lastEmittedIndex.current = null
  }, [images])

  const emitIndex = useCallback(
    (i: number) => {
      setSelected(prev => (prev === i ? prev : i))
      if (isProgrammaticScroll.current) {
        lastEmittedIndex.current = i
        return
      }
      if (lastEmittedIndex.current === i) return
      lastEmittedIndex.current = i
      onSlideChangeRef.current?.(i)
    },
    [],
  )

  const settleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollEdges()
    const i = readSnapIndex(el, images.length)
    emitIndex(i)
  }, [emitIndex, images.length, updateScrollEdges])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScrollEnd = () => settleScroll()

    const onScroll = () => {
      updateScrollEdges()
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
      settleTimerRef.current = setTimeout(() => {
        settleTimerRef.current = null
        settleScroll()
      }, 64)
    }

    el.addEventListener("scrollend", onScrollEnd)
    el.addEventListener("scroll", onScroll, { passive: true })
    settleScroll()

    return () => {
      el.removeEventListener("scrollend", onScrollEnd)
      el.removeEventListener("scroll", onScroll)
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
    }
  }, [images.length, settleScroll, updateScrollEdges])

  useLayoutEffect(() => {
    updateScrollEdges()
  }, [images.length, updateScrollEdges])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => settleScroll())
    ro.observe(el)
    return () => ro.disconnect()
  }, [settleScroll, images.length])

  useEffect(() => {
    if (!controlled || controlledIndex === undefined) return
    const el = scrollRef.current
    if (!el) return
    const w = el.clientWidth
    if (w <= 0) return
    const target = controlledIndex * w
    if (Math.abs(el.scrollLeft - target) < 2) return
    isProgrammaticScroll.current = true
    el.scrollTo({ left: target, behavior: "auto" })
    const id = requestAnimationFrame(() => {
      isProgrammaticScroll.current = false
      settleScroll()
    })
    return () => cancelAnimationFrame(id)
  }, [controlled, controlledIndex, images.length, settleScroll])

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    const { canPrev, canNext } = readScrollEdges(el)
    if (dir === -1 && !canPrev) return
    if (dir === 1 && !canNext) return
    const w = el.clientWidth
    if (w <= 0) return
    el.scrollBy({ left: dir * w, behavior: "smooth" })
    requestAnimationFrame(() => updateScrollEdges())
  }, [updateScrollEdges])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scroll: scrollRef.current?.scrollLeft ?? 0,
    }
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const start = pointerStartRef.current
      pointerStartRef.current = null
      if (!start || !onImageClickRef.current) return
      const el = scrollRef.current
      if (!el) return
      const dx = Math.abs(e.clientX - start.x)
      const dy = Math.abs(e.clientY - start.y)
      const ds = Math.abs(el.scrollLeft - start.scroll)
      if (dx > 14 || dy > 14 || ds > 12) return
      const i = readSnapIndex(el, images.length)
      onImageClickRef.current(i)
    },
    [images.length],
  )

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

  return (
    <div
      className={cn(
        "group/carousel relative z-0 w-full rounded-lg bg-muted",
        fillContainer && "h-full min-h-0",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden rounded-lg", fillContainer && "h-full min-h-0")}>
        <div
          ref={scrollRef}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className={cn(
            "flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            "touch-pan-x select-none",
            fillContainer ? "h-full min-h-0" : "",
          )}
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={cn(
                "relative min-h-0 w-full shrink-0 snap-start snap-always",
                "basis-full [min-width:100%]",
                fillContainer ? "h-full self-stretch" : "",
              )}
            >
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
            </div>
          ))}
        </div>

        {showControls && images.length > 1 ? (
          <>
            {scrollEdges.canPrev ? (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className={cn(
                  "absolute left-2 top-1/2 z-[15] size-9 -translate-y-1/2 rounded-full border-0 bg-background/90 shadow-md backdrop-blur-sm",
                  "hidden md:inline-flex",
                  "pointer-events-auto opacity-0 transition-opacity duration-200",
                "group-hover/carousel:opacity-100 group-focus-within/carousel:opacity-100",
                "hover:bg-background/95 focus-visible:opacity-100",
              )}
              aria-label="Предыдущее фото"
                onClick={e => {
                  e.stopPropagation()
                  scrollByDir(-1)
                }}
              >
                <ChevronLeft className="size-4" />
              </Button>
            ) : null}
            {scrollEdges.canNext ? (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className={cn(
                  "absolute right-2 top-1/2 z-[15] size-9 -translate-y-1/2 rounded-full border-0 bg-background/90 shadow-md backdrop-blur-sm",
                  "hidden md:inline-flex",
                  "pointer-events-auto opacity-0 transition-opacity duration-200",
                "group-hover/carousel:opacity-100 group-focus-within/carousel:opacity-100",
                "hover:bg-background/95 focus-visible:opacity-100",
              )}
              aria-label="Следующее фото"
                onClick={e => {
                  e.stopPropagation()
                  scrollByDir(1)
                }}
              >
                <ChevronRight className="size-4" />
              </Button>
            ) : null}
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
      </div>
    </div>
  )
}
