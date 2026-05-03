"use client"

import { Fragment } from "react"
import { cn } from "@/lib/utils"
import type { ArticleBodyBlock } from "@/lib/articles/schema"
import { VKVideoPlayer } from "@/components/articles/vk-video-player"
import { CalculatorArticleWidget } from "@/components/articles/widgets/calculator-article-widget"
import { ServiceArticleEmbed } from "@/components/articles/widgets/service-article-embed"
import { ProductArticleEmbed } from "@/components/articles/widgets/product-article-embed"

export interface ArticleBlockRendererProps {
  blocks: ArticleBodyBlock[]
  className?: string
}

function ParagraphBlock({ block }: { block: Extract<ArticleBodyBlock, { type: "paragraph" }> }) {
  if (block.html?.trim()) {
    // HTML должен быть санитизирован на бэке / при сохранении
    return (
      <div
        className="article-prose-p text-pretty text-base leading-relaxed text-foreground [&_a]:text-primary [&_a]:underline [&_p+p]:mt-4"
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    )
  }
  if (block.text?.trim()) {
    const parts = block.text.split(/\n\n+/)
    return (
      <div className="space-y-4 text-pretty text-base leading-relaxed text-foreground">
        {parts.map((p, i) => (
          <p key={`${block.id}-p-${i}`}>{p.trim()}</p>
        ))}
      </div>
    )
  }
  return null
}

function HeadingBlock({ block }: { block: Extract<ArticleBodyBlock, { type: "heading" }> }) {
  const cls = "scroll-mt-24 font-semibold tracking-tight text-foreground"
  const text = block.text.trim()
  if (!text) return null
  if (block.level === 2) return <h2 className={cn(cls, "mt-10 text-2xl")}>{text}</h2>
  if (block.level === 3) return <h3 className={cn(cls, "mt-8 text-xl")}>{text}</h3>
  return <h4 className={cn(cls, "mt-6 text-lg")}>{text}</h4>
}

function renderBlockNode(block: ArticleBodyBlock) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock block={block} />
    case "heading":
      return <HeadingBlock block={block} />
    case "calculator_widget":
      return <CalculatorArticleWidget artistId={block.artistId} title={block.title} hint={block.hint} />
    case "service_embed": {
      const s = block.service
      if (!s || !s.id?.trim()) return null
      return <ServiceArticleEmbed service={s} />
    }
    case "product_embed": {
      const p = block.product
      if (!p || !p.id?.trim()) return null
      return <ProductArticleEmbed product={p} />
    }
    case "vk_video":
      return <VKVideoPlayer embedUrl={block.embedUrl} title={block.title} />
    default:
      return null
  }
}

/**
 * Рендер тела статьи по JSON-блокам: текст, виджеты, VK, мини-карточки — между абзацами без «швов».
 */
export function ArticleBlockRenderer({ blocks, className }: ArticleBlockRendererProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {blocks.map(block => (
        <Fragment key={block.id}>{renderBlockNode(block)}</Fragment>
      ))}
    </div>
  )
}
