import { notFound } from "next/navigation"
import { ArticleDetailPage } from "@/components/article-detail-page"
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/articles/mock-data"

export function generateStaticParams() {
  return getAllArticleSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: "Статья не найдена" }
  const cover = article.coverImage?.trim()
  return {
    title: `${article.title} — EGG`,
    description: article.excerpt ?? article.title,
    openGraph: cover
      ? {
          images: [{ url: cover, alt: article.coverImageAlt?.trim() || article.title }],
        }
      : undefined,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()
  return <ArticleDetailPage article={article} />
}
