"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MOCK_ARTICLES } from "@/lib/articles/mock-data"
import { ArticleListCoverThumb } from "@/components/articles/article-cover"
import { ArrowRight } from "lucide-react"

export function ArticlesHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <header className="mb-10 border-b border-border/70 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Статьи</h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Материалы объединяют историю, услуги и медиа. Откройте статью — внутри нативные виджеты без
            лишних загрузок: данные уже собраны в одном ответе.
          </p>
        </header>

        <ul className="space-y-4">
          {MOCK_ARTICLES.map(article => (
            <li key={article.id}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex flex-col gap-2 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:border-border hover:shadow-md sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <div className="flex min-w-0 flex-1 gap-4">
                  <ArticleListCoverThumb article={article} />
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-foreground group-hover:underline">{article.title}</h2>
                    {article.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
                    ) : null}
                    {article.publishedAt ? (
                      <time
                        dateTime={article.publishedAt}
                        className="mt-2 block text-xs text-muted-foreground"
                      >
                        {new Date(article.publishedAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    ) : null}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 self-end text-sm font-medium text-primary sm:self-center">
                  Читать
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  )
}
