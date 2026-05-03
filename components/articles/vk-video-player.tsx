"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

const VK_VIDEO_EXT_HOST = "vk.com"

function isAllowedVkEmbedUrl(url: string): boolean {
  try {
    const u = new URL(url)
    if (u.protocol !== "https:") return false
    const host = u.hostname.toLowerCase()
    if (host !== "vk.com" && host !== "www.vk.com") return false
    return u.pathname.startsWith("/video_ext.php")
  } catch {
    return false
  }
}

export interface VKVideoPlayerProps {
  embedUrl: string
  title?: string
  className?: string
}

/**
 * Встраивание VK Video через iframe. Не хостим видео на своей стороне.
 * z-index низкий + isolation, чтобы не перекрывать выпадающие меню (header z-50+).
 */
export function VKVideoPlayer({ embedUrl, title = "VK Видео", className }: VKVideoPlayerProps) {
  const safeSrc = useMemo(() => {
    const trimmed = embedUrl.trim()
    return isAllowedVkEmbedUrl(trimmed) ? trimmed : null
  }, [embedUrl])

  if (!safeSrc) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground",
          className,
        )}
      >
        Видео недоступно (некорректная ссылка для встраивания)
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative isolate z-0 w-full overflow-hidden rounded-xl border border-border/50 bg-black/90 shadow-sm dark:border-border/60 dark:bg-black",
        className,
      )}
    >
      <div className="relative z-0 aspect-video w-full">
        <iframe
          src={safeSrc}
          title={title}
          className="absolute inset-0 z-0 h-full w-full rounded-xl border-0"
          style={{ border: "none" }}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  )
}
