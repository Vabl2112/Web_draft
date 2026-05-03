"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ArticleProductEmbedData } from "@/lib/articles/schema"

export interface ProductArticleEmbedProps {
  product: ArticleProductEmbedData
  className?: string
}

/** Мини-карточка товара между абзацами статьи */
export function ProductArticleEmbed({ product, className }: ProductArticleEmbedProps) {
  const { id, title, priceLabel, image, sellerName } = product
  if (!id?.trim()) return null

  return (
    <aside
      className={cn(
        "my-6 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <Link href={`/product/${id.trim()}`} className="group flex flex-col sm:flex-row">
        {image ? (
          <div className="relative aspect-square w-full shrink-0 bg-muted sm:size-36">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width:640px) 100vw, 144px"
            />
          </div>
        ) : (
          <div className="flex size-full shrink-0 items-center justify-center bg-muted p-8 sm:size-36">
            <Package className="size-10 text-muted-foreground/50" aria-hidden />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Товар</p>
          <p className="font-semibold leading-snug text-foreground group-hover:underline">{title}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold tabular-nums text-foreground">{priceLabel}</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              {sellerName}
              <ArrowUpRight className="size-3.5 opacity-70" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </aside>
  )
}
