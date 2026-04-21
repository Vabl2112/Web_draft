"use client"

import { toast } from "sonner"

/** Абсолютный URL для копирования/шаринга (клиент). */
export function getEntityShareUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
  if (typeof window === "undefined") return path
  return `${window.location.origin}${path}`
}

export async function copyEntityLink(pathOrUrl: string): Promise<void> {
  const url = getEntityShareUrl(pathOrUrl)
  try {
    await navigator.clipboard.writeText(url)
    toast.success("Ссылка скопирована")
  } catch {
    toast.error("Не удалось скопировать ссылку")
  }
}

export async function shareEntityLink(pathOrUrl: string, title?: string): Promise<void> {
  const url = getEntityShareUrl(pathOrUrl)
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: title ?? document.title,
        url,
      })
      return
    } catch (e) {
      if ((e as Error).name === "AbortError") return
    }
  }
  await copyEntityLink(pathOrUrl)
}

export function reportEntity(kind?: string): void {
  toast.info(
    "Жалоба будет рассмотрена модератором. Спасибо за обратную связь." +
      (kind ? ` (${kind})` : "")
  )
}
