"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ArticleServiceEmbedData } from "@/lib/articles/schema"

export interface ServiceArticleEmbedProps {
  service: ArticleServiceEmbedData
  className?: string
}

/** Мини-карточка услуги между абзацами статьи */
export function ServiceArticleEmbed({ service, className }: ServiceArticleEmbedProps) {
  const { id, title, description, priceLabel, image, masterName } = service
  if (!id?.trim()) return null

  return (
    <aside
      className={cn(
        "my-6 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <Link href={`/service/${id.trim()}`} className="group flex flex-col sm:flex-row">
        {image ? (
          <div className="relative aspect-[16/10] w-full shrink-0 bg-muted sm:aspect-auto sm:h-auto sm:w-40 sm:min-h-[8rem]">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width:640px) 100vw, 160px"
            />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Услуга</p>
          <p className="font-semibold leading-snug text-foreground group-hover:underline">{title}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold tabular-nums text-foreground">{priceLabel}</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              {masterName}
              <ArrowUpRight className="size-3.5 opacity-70" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </aside>
  )
}
