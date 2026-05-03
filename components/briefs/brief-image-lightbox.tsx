"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

export interface BriefImageLightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: string[]
  /** Индекс при открытии */
  initialIndex?: number
}

export function BriefImageLightbox({ open, onOpenChange, images, initialIndex = 0 }: BriefImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    if (!open) return
    const safe = Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1))
    setIndex(safe)
  }, [open, initialIndex, images.length])

  const n = images.length
  const src = n > 0 ? images[index] : null

  const goPrev = useCallback(() => {
    setIndex(i => (i <= 0 ? n - 1 : i - 1))
  }, [n])

  const goNext = useCallback(() => {
    setIndex(i => (i >= n - 1 ? 0 : i + 1))
  }, [n])

  useEffect(() => {
    if (!open || n <= 1) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, n, goPrev, goNext])

  if (n === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden border-zinc-800 bg-zinc-950 p-0 shadow-2xl sm:max-w-4xl"
        overlayClassName="bg-black/85"
      >
        <DialogTitle className="sr-only">
          Фото {index + 1} из {n}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Стрелки по бокам или клавиши влево и вправо переключают снимки
        </DialogDescription>

        <div className="flex h-11 shrink-0 items-center justify-end border-b border-white/10 bg-black/40 px-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={() => onOpenChange(false)}
            aria-label="Закрыть"
          >
            <X className="size-5 shrink-0" aria-hidden />
          </Button>
        </div>

        <div className="relative aspect-[4/3] w-full max-h-[min(78vh,calc(92vh-2.75rem))] bg-zinc-950 sm:aspect-[16/10]">
          {src ? (
            <Image
              src={src}
              alt={`Вложение ${index + 1} из ${n}`}
              fill
              className="object-contain p-3 sm:p-6"
              sizes="(max-width: 768px) 100vw, 896px"
              unoptimized={src.startsWith("data:")}
              priority
            />
          ) : null}

          {n > 1 ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border border-border bg-background/95 shadow-md sm:left-4"
                onClick={e => {
                  e.stopPropagation()
                  goPrev()
                }}
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="size-5 shrink-0" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border border-border bg-background/95 shadow-md sm:right-4"
                onClick={e => {
                  e.stopPropagation()
                  goNext()
                }}
                aria-label="Следующее фото"
              >
                <ChevronRight className="size-5 shrink-0" aria-hidden />
              </Button>
            </>
          ) : null}

          <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-xs font-medium tabular-nums text-white/90">
            {index + 1} / {n}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
