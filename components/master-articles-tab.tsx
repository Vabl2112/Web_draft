"use client"

import Link from "next/link"
import { ArticleCardCoverBanner } from "@/components/articles/article-cover"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getArticlesForMaster } from "@/lib/articles/mock-data"
import { cn } from "@/lib/utils"

export interface MasterArticlesTabProps {
  masterId: string
  masterName: string
  className?: string
}

/**
 * Заглушка вкладки «Статьи»: статьи, привязанные к мастеру, + ссылка в общий раздел.
 */
export function MasterArticlesTab({ masterId, masterName, className }: MasterArticlesTabProps) {
  const articles = getArticlesForMaster(masterId)

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-2xl border border-border/70 bg-muted/20 p-5 dark:bg-muted/10">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Материалы <span className="font-medium text-foreground">{masterName}</span> как смысловые хабы:
          текст, услуги, товары и внешние видео. Сейчас показаны демо-статьи с привязкой к профилю;
          позже список подтянется из API.
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
          Пока нет статей, связанных с этим мастером. Загляните в общий раздел — там есть материалы
          платформы.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {articles.map(article => (
            <li key={article.id}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:border-border hover:shadow-md"
              >
                <ArticleCardCoverBanner article={article} />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-semibold leading-snug text-foreground group-hover:underline">
                    {article.title}
                  </h3>
                  {article.excerpt ? (
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{article.excerpt}</p>
                  ) : null}
                  {article.publishedAt ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Читать
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/articles">
            Все статьи платформы
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  )
}
