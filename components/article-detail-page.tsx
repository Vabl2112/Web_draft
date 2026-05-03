"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArticleAuthors } from "@/components/articles/article-authors"
import { ArticleBody } from "@/components/articles/article-body"
import { ArticleHeroCover } from "@/components/articles/article-cover"
import type { DenormalizedArticle } from "@/lib/articles/schema"

export interface ArticleDetailPageProps {
  article: DenormalizedArticle
}

export function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-8 pt-6 md:pt-10">
        <Button variant="ghost" size="sm" className="-ml-2 mb-6 gap-1 text-muted-foreground" asChild>
          <Link href="/articles">
            <ArrowLeft className="size-4" aria-hidden />
            Ко всем статьям
          </Link>
        </Button>

        <ArticleHeroCover article={article} className="mb-8" />

        <header className="border-b border-border/70 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{article.title}</h1>
          {article.excerpt ? (
            <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>
          ) : null}
          {article.publishedAt ? (
            <time dateTime={article.publishedAt} className="mt-4 block text-sm text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          ) : null}
          <div className="mt-6">
            <ArticleAuthors collaborators={article.collaborators} />
          </div>
        </header>

        <ArticleBody
          blocks={article.blocks}
          className="max-w-none px-0 pb-12 pt-2 sm:px-0"
        />
      </main>
      <Footer />
    </div>
  )
}
