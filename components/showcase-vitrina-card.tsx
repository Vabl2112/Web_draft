"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { ImageCarousel } from "@/components/image-carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { GalleryImage } from "@/lib/types"
import { normalizeShowcaseKind, ShowcaseKindBadge } from "@/components/showcase-kind-badge"

function gallerySlides(img: GalleryImage): string[] {
  if (img.images?.length) return img.images
  return [img.imageUrl]
}

function LikeBurstFx({
  burstKey,
  onComplete,
}: {
  burstKey: number
  onComplete: (key: number) => void
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[40] flex items-center justify-center"
      aria-hidden
    >
      <div
        className="showcase-like-burst flex items-center justify-center will-change-transform"
        onAnimationEnd={() => onComplete(burstKey)}
      >
        <Heart
          strokeWidth={1.25}
          className="size-[4.5rem] fill-white/35 text-white/90 [filter:drop-shadow(0_2px_12px_rgb(0_0_0_/0.45))]"
        />
      </div>
    </div>
  )
}

export interface ShowcaseVitrinaCardProps {
  image: GalleryImage
  /** Tailwind height classes for the media area */
  heightClass: string
  /**
   * true — глобальная витрина: автор в оверлее на фото, по hover карточки.
   * false — нижняя серая полоса с автором (локальный режим).
   */
  isGlobalFeed: boolean
  /** Активные одноразовые анимации лайка для этой карточки */
  burstKeys: number[]
  onBurstComplete: (burstKey: number) => void
  onImageTap: () => void
  /** Нативный dblclick по фото (десктоп); лайк обрабатывает родитель с дедупликацией от двойного тапа */
  onPhotoDoubleClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onKeyOpen: () => void
}

export function ShowcaseVitrinaCard({
  image,
  heightClass,
  isGlobalFeed,
  burstKeys,
  onBurstComplete,
  onImageTap,
  onPhotoDoubleClick,
  onKeyOpen,
}: ShowcaseVitrinaCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        isGlobalFeed ? "group/showcase relative" : "group/card flex flex-col",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Открыть: ${image.title}. Двойной тап или двойной клик по фото — лайк`}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onKeyOpen()
          }
        }}
        className={cn(
          "relative min-h-0 w-full shrink-0 cursor-pointer overflow-hidden",
          heightClass,
        )}
      >
        <div className="absolute left-2 top-2 z-[15]">
          <ShowcaseKindBadge kind={normalizeShowcaseKind(image.showcaseKind)} />
        </div>
        <div className="relative h-full w-full min-h-0" onDoubleClick={onPhotoDoubleClick}>
          <ImageCarousel
            images={gallerySlides(image)}
            alt={image.title}
            fillContainer
            aspectRatio="auto"
            className={isGlobalFeed ? "rounded-xl" : "rounded-none rounded-t-xl"}
            onImageClick={onImageTap}
          />
        </div>

        {isGlobalFeed ? (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[38%] opacity-0 transition-opacity duration-300 ease-out group-hover/showcase:opacity-100"
              style={{
                background: "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 z-10 flex w-full translate-y-2.5 items-end gap-3 p-4 opacity-0 transition-all duration-300 ease-out group-hover/showcase:pointer-events-auto group-hover/showcase:translate-y-0 group-hover/showcase:opacity-100"
            >
              <Avatar className="size-10 shrink-0 border-2 border-white/35 bg-black/25 shadow-md ring-1 ring-black/20">
                <AvatarImage src={image.authorAvatar} alt="" />
                <AvatarFallback className="bg-white/15 text-sm font-semibold text-white">
                  {image.author.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[10px] font-medium uppercase tracking-wide text-white/75">Автор</p>
                {image.authorMasterId ? (
                  <Link
                    href={`/master/${image.authorMasterId}`}
                    className="block truncate text-sm font-semibold text-white underline-offset-2 hover:text-white hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    {image.author}
                  </Link>
                ) : (
                  <p className="truncate text-sm font-semibold text-white">{image.author}</p>
                )}
              </div>
            </div>
          </>
        ) : null}

        {burstKeys.map(k => (
          <LikeBurstFx key={k} burstKey={k} onComplete={onBurstComplete} />
        ))}
      </div>

      {!isGlobalFeed ? (
        <div
          className="flex min-h-[3rem] shrink-0 items-center gap-2 border-t border-border bg-muted/50 px-2.5 py-2 dark:bg-muted/25"
          onClick={e => e.stopPropagation()}
          onKeyDown={e => e.stopPropagation()}
        >
          <Avatar className="size-8 shrink-0 border border-border/60 bg-background">
            <AvatarImage src={image.authorAvatar} alt="" />
            <AvatarFallback className="text-[10px] font-semibold">{image.author.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Автор</p>
            {image.authorMasterId ? (
              <Link
                href={`/master/${image.authorMasterId}`}
                className="truncate text-sm font-semibold text-foreground underline-offset-2 hover:underline"
              >
                {image.author}
              </Link>
            ) : (
              <p className="truncate text-sm font-semibold text-foreground">{image.author}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
