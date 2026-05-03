"use client"

import { cn } from "@/lib/utils"
import type { ArticleBodyBlock } from "@/lib/articles/schema"
import { ArticleBlockRenderer } from "@/components/articles/article-block-renderer"

export interface ArticleBodyProps {
  blocks: ArticleBodyBlock[]
  className?: string
}

/** Обёртка контента статьи: типографика и максимальная ширина чтения */
export function ArticleBody({ blocks, className }: ArticleBodyProps) {
  return (
    <article className={cn("mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6", className)}>
      <ArticleBlockRenderer blocks={blocks} />
    </article>
  )
}
