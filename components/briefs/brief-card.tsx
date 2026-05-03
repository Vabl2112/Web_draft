"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Sparkles, Wallet } from "lucide-react"
import type { Brief } from "@/lib/briefs/types"
import { BRIEF_CATEGORY_LABELS } from "@/lib/briefs/market-categories"
import { formatListingPrice, getListingFromBrief } from "@/lib/briefs/listing-snapshot"
import {
  BRIEF_ATTACHMENT_IMAGES_KEY,
  BRIEF_DESCRIPTION_KEY,
  BRIEF_FILTER_PATH_KEY,
  BRIEF_TITLE_KEY,
  formatBriefFilterPathSummary,
  parseBriefAttachmentImages,
  parseBriefFilterPath,
} from "@/lib/briefs/brief-scope-tree"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function formatBudgetBold(min: number | null, max: number | null): string {
  if (min == null && max == null) return "Не указан"
  if (min != null && max != null) return `${min.toLocaleString("ru-RU")} — ${max.toLocaleString("ru-RU")} ₽`
  if (min != null) return `от ${min.toLocaleString("ru-RU")} ₽`
  return `до ${max!.toLocaleString("ru-RU")} ₽`
}

function briefDescription(b: Brief): string {
  const d = b.dynamicData
  const v = d[BRIEF_DESCRIPTION_KEY]
  if (typeof v === "string" && v.trim()) return v.trim()
  const c = d.clientNotes
  if (typeof c === "string" && c.trim()) return c.trim()
  const s = d.summary
  if (typeof s === "string" && s.trim()) return s.trim()
  return ""
}

/**
 * Заголовок: явный title; если дерево фильтров — только базовое направление (категория / зона),
 * детали шагов только в микро-тегах ниже.
 */
function getBriefCardHeadline(b: Brief): string {
  const raw = b.dynamicData[BRIEF_TITLE_KEY]
  if (typeof raw === "string" && raw.trim()) return raw.trim()
  const path = parseBriefFilterPath(b.dynamicData[BRIEF_FILTER_PATH_KEY])
  if (path) {
    return BRIEF_CATEGORY_LABELS[b.category] ?? path.areaLabel
  }
  const listing = getListingFromBrief(b)
  if (listing?.title) return listing.title
  const desc = briefDescription(b)
  if (desc) {
    const line = desc.replace(/\s+/g, " ").trim()
    return line.length > 90 ? `${line.slice(0, 90)}…` : line
  }
  return `Заявка · ${BRIEF_CATEGORY_LABELS[b.category] ?? b.category}`
}

export interface BriefCardProps {
  brief: Brief
  variant?: "default" | "feed"
  showProposeCta?: boolean
  onProposeConcept?: (brief: Brief) => void
  className?: string
}

export function BriefCard({ brief, variant = "default", showProposeCta, onProposeConcept, className }: BriefCardProps) {
  const isFeed = variant === "feed"
  const path = parseBriefFilterPath(brief.dynamicData[BRIEF_FILTER_PATH_KEY])
  const listing = getListingFromBrief(brief)
  const headline = getBriefCardHeadline(brief)
  const desc = briefDescription(brief)
  const catLabel = BRIEF_CATEGORY_LABELS[brief.category] ?? brief.category
  const deadline = typeof brief.dynamicData.deadline === "string" ? brief.dynamicData.deadline.trim() : ""
  const attachments = parseBriefAttachmentImages(brief.dynamicData[BRIEF_ATTACHMENT_IMAGES_KEY])
  const hasCover = attachments.length > 0
  const pathSummary = path ? formatBriefFilterPathSummary(path) : null

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-amber-500/20 bg-zinc-950/95 shadow-md ring-1 ring-amber-500/10",
        isFeed && "ring-amber-500/15",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          hasCover && "sm:flex-row",
          isFeed && hasCover && "min-h-[220px] sm:min-h-[200px]",
        )}
      >
        {hasCover ? (
          <div
            className={cn(
              "relative w-full shrink-0 overflow-hidden bg-muted/40",
              "aspect-[5/3] max-h-[200px] sm:aspect-auto sm:h-auto sm:max-h-none sm:w-40 sm:min-h-[200px] lg:w-44",
            )}
          >
            <Image
              src={attachments[0]!}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 176px"
              unoptimized={attachments[0]!.startsWith("data:")}
            />
            {attachments.length > 1 && (
              <span className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm">
                +{attachments.length - 1} фото
              </span>
            )}
          </div>
        ) : null}

        <Link
          href={`/briefs/${brief.id}`}
          className={cn(
            "flex min-w-0 flex-1 flex-col p-4 transition-colors hover:bg-muted/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50 sm:p-5",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="border border-amber-500/25 bg-amber-500/12 text-amber-100">
                {catLabel}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "border-emerald-500/35 text-xs text-emerald-200",
                  brief.status === "in_progress" && "border-sky-500/40 text-sky-200",
                )}
              >
                {brief.status === "open" ? "Открыт" : "В работе"}
              </Badge>
            </div>
            <time className="text-xs tabular-nums text-muted-foreground" dateTime={brief.createdAt}>
              {new Date(brief.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
            </time>
          </div>

          <h3
            className={cn(
              "mt-3 font-semibold tracking-tight text-foreground",
              isFeed ? "text-lg leading-snug sm:text-xl" : "text-base leading-snug sm:text-lg",
            )}
          >
            {headline}
          </h3>

          {path && path.steps.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {path.steps.map(s => (
                <span
                  key={`${s.filterId}-${s.valueId}`}
                  className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-foreground/90 backdrop-blur-sm"
                >
                  <span className="text-muted-foreground">{s.filterLabel}:</span>
                  <span className="ml-1">{s.valueLabel}</span>
                </span>
              ))}
            </div>
          ) : listing ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-foreground/90">
                {listing.kind === "product" ? "Товар" : "Услуга"} · {formatListingPrice(listing)}
              </span>
            </div>
          ) : pathSummary ? (
            <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">{pathSummary}</p>
          ) : null}

          {desc ? (
            <p className={cn("mt-3 text-sm leading-relaxed text-muted-foreground", isFeed ? "line-clamp-4" : "line-clamp-3")}>
              {desc}
            </p>
          ) : (
            <p className="mt-3 text-sm italic text-muted-foreground/80">Описание не заполнено</p>
          )}

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-border/60 pt-4">
            <div className="flex items-center gap-2.5">
              <Wallet className="size-5 shrink-0 text-amber-500/90" aria-hidden />
              <span className="text-lg font-bold tabular-nums tracking-tight text-foreground">
                {formatBudgetBold(brief.budgetMin, brief.budgetMax)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4 shrink-0 opacity-80" aria-hidden />
              <span className="text-foreground/85">{deadline || "Срок не указан"}</span>
            </div>
          </div>
        </Link>
      </div>

      {showProposeCta && brief.status === "open" && (
        <div className="flex justify-end border-t border-border/70 bg-muted/20 px-4 py-3">
          <Button type="button" variant="default" size="default" onClick={() => onProposeConcept?.(brief)}>
            <Sparkles className="size-4 shrink-0" aria-hidden />
            Предложить концепт
          </Button>
        </div>
      )}
    </article>
  )
}
