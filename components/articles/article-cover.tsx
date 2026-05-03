"use client"

import Image from "next/image"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DenormalizedArticle } from "@/lib/articles/schema"

function coverSrc(article: DenormalizedArticle): string | null {
  const s = article.coverImage?.trim()
  return s || null
}

function coverAlt(article: DenormalizedArticle): string {
  return (article.coverImageAlt?.trim() || article.title).trim()
}

/** Hero под заголовком статьи */
export function ArticleHeroCover({
  article,
  className,
  priority = true,
}: {
  article: DenormalizedArticle
  className?: string
  priority?: boolean
}) {
  const src = coverSrc(article)
  if (!src) return null

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-muted shadow-inner",
        "aspect-[21/9] max-h-[min(40vh,320px)] min-h-[140px] sm:min-h-[180px]",
        className,
      )}
    >
      <Image
        src={src}
        alt={coverAlt(article)}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 768px"
        priority={priority}
      />
    </div>
  )
}

/** Превью в списках: 16:9, фиксированная ширина */
export function ArticleListCoverThumb({
  article,
  className,
}: {
  article: DenormalizedArticle
  className?: string
}) {
  const src = coverSrc(article)
  const box =
    "relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border sm:w-32"

  if (!src) {
    return (
      <div className={cn(box, "flex items-center justify-center", className)} aria-hidden>
        <FileText className="size-7 text-muted-foreground/60 sm:size-8" />
      </div>
    )
  }

  return (
    <div className={cn(box, className)}>
      <Image src={src} alt="" fill className="object-cover" sizes="128px" />
    </div>
  )
}

/** Верх карточки во вкладке мастера: ширина ряда, 16:9 */
export function ArticleCardCoverBanner({
  article,
  className,
}: {
  article: DenormalizedArticle
  className?: string
}) {
  const src = coverSrc(article)

  if (!src) {
    return (
      <div
        className={cn(
          "relative flex aspect-[16/9] w-full items-center justify-center bg-muted",
          className,
        )}
        aria-hidden
      >
        <FileText className="size-10 text-muted-foreground/50 sm:size-12" />
      </div>
    )
  }

  return (
    <div className={cn("relative aspect-[16/9] w-full bg-muted", className)}>
      <Image src={src} alt="" fill className="object-cover" sizes="(max-width:640px) 100vw, 50vw" />
    </div>
  )
}
