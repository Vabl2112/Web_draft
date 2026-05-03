"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { authUserIdToBriefClientId } from "@/lib/briefs/auth-bridge"
import { fetchBriefById } from "@/lib/briefs/brief-api"
import type { Brief } from "@/lib/briefs/types"
import { BRIEF_CATEGORY_LABELS } from "@/lib/briefs/market-categories"
import {
  BRIEF_ATTACHMENT_IMAGES_KEY,
  BRIEF_DESCRIPTION_KEY,
  BRIEF_FILTER_PATH_KEY,
  formatBriefFilterPathSummary,
  parseBriefAttachmentImages,
  parseBriefFilterPath,
} from "@/lib/briefs/brief-scope-tree"
import { getListingFromBrief } from "@/lib/briefs/listing-snapshot"
import { BriefImageLightbox } from "@/components/briefs/brief-image-lightbox"
import { BriefListingBlock } from "@/components/briefs/brief-listing-block"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function formatBudget(min: number | null, max: number | null): string {
  if (min == null && max == null) return "Не указан"
  if (min != null && max != null) return `${min.toLocaleString("ru-RU")} — ${max.toLocaleString("ru-RU")} ₽`
  if (min != null) return `от ${min.toLocaleString("ru-RU")} ₽`
  return `до ${max!.toLocaleString("ru-RU")} ₽`
}

function briefDescriptionText(b: Brief): string {
  const d = b.dynamicData
  const v = d[BRIEF_DESCRIPTION_KEY]
  if (typeof v === "string" && v.trim()) return v.trim()
  const legacy = d.clientNotes
  if (typeof legacy === "string" && legacy.trim()) return legacy.trim()
  const s = d.summary
  if (typeof s === "string" && s.trim()) return s.trim()
  return ""
}

export function BriefDetailPage({ briefId }: { briefId: number }) {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [brief, setBrief] = useState<Brief | null | undefined>(undefined)
  const [loadError, setLoadError] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setBrief(undefined)
      setLoadError(false)
      try {
        const b = await fetchBriefById(briefId)
        if (!cancelled) setBrief(b)
      } catch {
        if (!cancelled) {
          setLoadError(true)
          setBrief(null)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [briefId])

  if (authLoading || brief === undefined) {
    return (
      <div className="flex justify-center py-24 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" aria-hidden />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <p className="text-muted-foreground">Войдите, чтобы просматривать брифы.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Войти</Link>
        </Button>
      </div>
    )
  }

  if (loadError || brief === null) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-12 text-center">
        <h1 className="text-xl font-semibold">Бриф не найден</h1>
        <Button asChild variant="outline">
          <Link href="/briefs">К брифам</Link>
        </Button>
      </div>
    )
  }

  const myClientId = authUserIdToBriefClientId(user.id)
  const isOwner = brief.clientId === myClientId
  const isMaster = user.role === "master"
  const canView = isOwner || isMaster

  if (!canView) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-12 text-center">
        <h1 className="text-xl font-semibold">Нет доступа</h1>
        <p className="text-sm text-muted-foreground">Этот бриф доступен только автору и мастерам платформы.</p>
        <Button asChild variant="outline">
          <Link href="/briefs">К брифам</Link>
        </Button>
      </div>
    )
  }

  const listing = getListingFromBrief(brief)
  const filterPath = parseBriefFilterPath(brief.dynamicData[BRIEF_FILTER_PATH_KEY])
  const catLabel = BRIEF_CATEGORY_LABELS[brief.category] ?? brief.category
  const deadline = brief.dynamicData.deadline
  const description = briefDescriptionText(brief)
  const attachmentImages = parseBriefAttachmentImages(brief.dynamicData[BRIEF_ATTACHMENT_IMAGES_KEY])

  const titleLine =
    listing?.title ??
    (filterPath ? filterPath.areaLabel : null) ??
    `Бриф #${brief.id}`

  const subtitle =
    filterPath && !listing ? (
      <p className="mt-1 text-sm text-muted-foreground">{formatBriefFilterPathSummary(filterPath)}</p>
    ) : null

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Button variant="ghost" size="sm" className="gap-2 px-0 text-muted-foreground hover:text-foreground" asChild>
        <Link href="/briefs">
          <ArrowLeft className="size-4" />
          Назад
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="border border-amber-500/30 bg-amber-500/15 text-amber-100">
              {catLabel}
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-200">
              {brief.status === "open" ? "Открыт" : "В работе"}
            </Badge>
            {filterPath?.stoppedAtOther && (
              <Badge variant="outline" className="border-amber-500/40 text-amber-100">
                Остановка на «Другое»
              </Badge>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{titleLine}</h1>
          {subtitle}
          <p className="mt-2 text-sm text-muted-foreground">
            Создан{" "}
            {new Date(brief.createdAt).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        {isMaster && brief.status === "open" && !isOwner && (
          <Button
            type="button"
            className="shrink-0"
            onClick={() =>
              toast.message("Черновик отклика", {
                description: `Концепт для брифа #${brief.id} — дальше подключится API.`,
              })
            }
          >
            Предложить концепт
          </Button>
        )}
      </div>

      <section className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Бюджет брифа</h2>
          <p className="mt-1 text-lg font-medium">{formatBudget(brief.budgetMin, brief.budgetMax)}</p>
        </div>
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Срок</h2>
          <p className="mt-1 text-lg font-medium">{typeof deadline === "string" && deadline ? deadline : "—"}</p>
        </div>
      </section>

      {filterPath && (
        <section className="space-y-3 rounded-xl border border-border bg-muted/15 p-4">
          <h2 className="text-lg font-semibold">Уточнения по фильтрам</h2>
          <p className="text-sm text-muted-foreground">{formatBriefFilterPathSummary(filterPath)}</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-foreground/90">
            {filterPath.steps.map(s => (
              <li key={`${s.filterId}-${s.valueId}`}>
                <span className="font-medium">{s.filterLabel}:</span> {s.valueLabel}
              </li>
            ))}
          </ul>
        </section>
      )}

      {listing && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Позиция с витрины (ранее)</h2>
          <BriefListingBlock listing={listing} />
        </section>
      )}

      {!filterPath && !listing && (
        <section className="rounded-xl border border-dashed border-border bg-muted/20 p-6">
          <h2 className="text-lg font-semibold">Без дерева фильтров</h2>
          <p className="mt-2 text-sm text-muted-foreground">Старый или упрощённый бриф.</p>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Описание задачи</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{description || "—"}</p>
        {attachmentImages.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Фото к брифу</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Нажмите на миниатюру — откроется просмотр; стрелки по бокам или клавиши ← → переключают снимки.
            </p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {attachmentImages.map((src, i) => (
                <li key={`${i}-${src.slice(0, 40)}`} className="list-none">
                  <button
                    type="button"
                    className="group relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted text-left ring-offset-background transition-shadow hover:ring-2 hover:ring-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => {
                      setGalleryIndex(i)
                      setGalleryOpen(true)
                    }}
                  >
                    <Image src={src} alt={`Вложение ${i + 1}`} fill className="object-cover" sizes="200px" unoptimized />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent py-2 text-center text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      Открыть
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <BriefImageLightbox
              open={galleryOpen}
              onOpenChange={setGalleryOpen}
              images={attachmentImages}
              initialIndex={galleryIndex}
            />
          </div>
        )}
      </section>
    </div>
  )
}
