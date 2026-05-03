"use client"

import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Loader2, Package } from "lucide-react"
import type { CarouselApi } from "@/components/ui/carousel"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import type { FeedPayload, FeedTimelineItem } from "@/lib/feed-types"
import { cn } from "@/lib/utils"

/** Карусель товаров — после каждых N постов витрины (статьи не считаются) */
const PRODUCTS_EVERY_N_VITRINA_POSTS = 5

function formatFeedDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}

function FeedPostCard({
  post,
  captionExpanded,
  onToggleCaption,
}: {
  post: Extract<FeedTimelineItem, { kind: "post" }>
  captionExpanded: boolean
  onToggleCaption: () => void
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    if (!carouselApi) return
    const onSelect = () => setSlide(carouselApi.selectedScrollSnap())
    onSelect()
    carouselApi.on("reInit", onSelect)
    carouselApi.on("select", onSelect)
    return () => {
      carouselApi.off("reInit", onSelect)
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  const n = post.images.length

  return (
    <article id={`feed-post-${post.id}`} className="scroll-mt-20 bg-background">
      <div className="flex items-center gap-3 py-2.5">
        <Link href={`/master/${post.masterId}`} className="shrink-0 rounded-full ring-offset-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="size-9 ring-1 ring-border">
            <AvatarImage src={post.masterAvatar} alt="" />
            <AvatarFallback>{post.masterName.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/master/${post.masterId}`} className="block truncate text-sm font-semibold hover:underline">
            {post.masterName}
          </Link>
          <p className="text-xs text-muted-foreground">{formatFeedDate(post.publishedAt)} · Витрина</p>
        </div>
      </div>

      <div className="relative w-full bg-muted">
        <Carousel className="w-full" setApi={setCarouselApi} opts={{ align: "start", loop: false }}>
          <CarouselContent className="-ml-0">
            {post.images.map((src, i) => (
              <CarouselItem key={`${post.id}-img-${i}`} className="basis-full pl-0">
                <div className="relative aspect-[4/5] w-full max-h-[min(78vh,560px)] sm:max-h-[560px]">
                  <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 28rem" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {n > 1 ? (
          <div
            className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1"
            aria-hidden
          >
            {post.images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full bg-white/90 shadow transition-opacity",
                  i === slide ? "opacity-100" : "opacity-35",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="pb-4 pt-2.5">
        <button
          type="button"
          onClick={onToggleCaption}
          aria-expanded={captionExpanded}
          className="w-full rounded-md text-left text-sm leading-snug text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className={cn(!captionExpanded && "line-clamp-1")}>{post.caption}</span>
        </button>
        {!captionExpanded && post.caption.length > 72 ? (
          <button
            type="button"
            className="mt-0.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onToggleCaption}
          >
            ещё
          </button>
        ) : null}
      </div>
    </article>
  )
}

function FeedArticleCard({ article }: { article: Extract<FeedTimelineItem, { kind: "article" }> }) {
  return (
    <article className="bg-background">
      <div className="flex items-center gap-3 py-2.5">
        <Avatar className="size-9 ring-1 ring-border">
          {article.authorAvatar ? <AvatarImage src={article.authorAvatar} alt="" /> : null}
          <AvatarFallback>
            <BookOpen className="size-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{article.authorName}</p>
          <p className="text-xs text-muted-foreground">{formatFeedDate(article.publishedAt)} · Статья</p>
        </div>
      </div>

      <Link
        href={`/articles/${article.slug}`}
        className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {article.coverImage ? (
          <div className="relative aspect-[16/10] w-full bg-muted">
            <Image
              src={article.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 28rem"
            />
          </div>
        ) : null}
        <div className="pb-4 pt-3">
          <h2 className="text-base font-semibold leading-snug tracking-tight group-hover:underline group-focus-visible:underline">
            {article.title}
          </h2>
          {article.excerpt ? (
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
          ) : null}
          <span className="mt-2 inline-block text-sm font-medium text-amber-700 dark:text-amber-400">Читать статью</span>
        </div>
      </Link>
    </article>
  )
}

/** Полоса мастеров — один раз после первого поста витрины */
function FeedMastersRail({ masters }: { masters: FeedPayload["recommendedMasters"] }) {
  if (!masters.length) return null
  return (
    <div role="region" aria-label="Рекомендованные мастера" className="border-b border-border py-3">
      <div className="overflow-hidden rounded-xl border border-border bg-muted/30 shadow-sm">
        <div className="border-b border-border/80 bg-muted/40 px-4 py-2.5">
          <span className="text-xs font-semibold tracking-tight text-foreground">Рекомендации</span>
          <p className="text-[11px] text-muted-foreground">Свайп влево-вправо</p>
        </div>
        <div className="px-4 py-3">
          <Carousel className="w-full" opts={{ align: "start", loop: false, dragFree: true }}>
            <CarouselContent className="-ml-3">
              {masters.map(m => (
                <CarouselItem
                  key={m.id}
                  className="basis-auto pl-3 shrink-0 grow-0 [min-width:5.25rem] [max-width:6rem]"
                >
                  <Link
                    href={`/master/${m.id}`}
                    className="flex flex-col items-center gap-2 rounded-lg px-1 py-2 text-center ring-1 ring-transparent transition-colors hover:bg-background/90 hover:ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Avatar className="size-14 ring-1 ring-border">
                      <AvatarImage src={m.avatar} alt="" />
                      <AvatarFallback>{m.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="line-clamp-2 w-full text-center text-[11px] font-medium leading-tight text-foreground">
                      {m.name}
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  )
}

/** Карусель товаров — после каждых N постов витрины */
function FeedProductRail({ products }: { products: FeedPayload["products"] }) {
  if (!products.length) return null
  return (
    <section className="border-b border-border py-3" aria-label="Подборка товаров">
      <div className="overflow-hidden rounded-xl border border-border bg-muted/30 shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-border/80 bg-muted/40 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
              <Package className="size-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-tight">Товары</h2>
              <p className="text-[11px] text-muted-foreground">Листайте вправо</p>
            </div>
          </div>
          <Link
            href="/products"
            className="shrink-0 text-xs font-medium text-amber-700 underline-offset-2 hover:underline dark:text-amber-400"
          >
            Все товары
          </Link>
        </div>
        <div className="px-4 py-3">
          <Carousel className="w-full" opts={{ align: "start", loop: false, dragFree: true }}>
            <CarouselContent className="-ml-3">
              {products.map(p => (
                <CarouselItem
                  key={p.id}
                  className="min-w-0 shrink-0 grow-0 basis-[min(100%,268px)] pl-3 sm:basis-[248px]"
                >
                  <Link
                    href={`/product/${p.id}`}
                    className="block h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:border-amber-500/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="relative aspect-[5/4] w-full bg-muted">
                      <Image src={p.image} alt="" fill className="object-cover" sizes="268px" />
                    </div>
                    <div className="space-y-0.5 p-3">
                      <p className="line-clamp-2 text-xs font-medium leading-snug">{p.title}</p>
                      <p className="text-xs font-semibold">{p.priceLabel}</p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export function HomeNewsFeed() {
  const [data, setData] = useState<FeedPayload | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [expandedCaptionPostId, setExpandedCaptionPostId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const res = await fetch("/api/feed")
      if (!res.ok) throw new Error("feed")
      const json = (await res.json()) as FeedPayload
      setData(json)
    } catch {
      setLoadError("Не удалось загрузить ленту")
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const timelineWithVitrinaIndex = useMemo(() => {
    if (!data?.timeline.length) return []
    let v = 0
    return data.timeline.map(item => {
      if (item.kind !== "post") {
        return { item, vitrinaSerial: null as number | null }
      }
      v += 1
      return { item, vitrinaSerial: v }
    })
  }, [data])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-feed" className="mx-auto max-w-lg px-4 pb-16">
        <header className="border-b border-border py-3">
          <h1 className="text-lg font-semibold tracking-tight">Лента</h1>
          <p className="text-xs text-muted-foreground">
            Статьи и посты витрины в одном потоке: рекомендации мастеров один раз после первого поста витрины;
            карусель товаров — после каждых пяти постов витрины (5, 10, …)
          </p>
        </header>

        {!data && !loadError ? (
          <div className="flex justify-center py-16" role="status" aria-live="polite">
            <Loader2 className="size-8 animate-spin text-muted-foreground" aria-label="Загрузка ленты" />
          </div>
        ) : null}

        {loadError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-center text-sm text-muted-foreground">{loadError}</p>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Повторить
            </Button>
          </div>
        ) : null}

        {data ? (
          <div role="feed" aria-label="Лента публикаций">
            {timelineWithVitrinaIndex.map(({ item, vitrinaSerial }) => {
              const key = item.kind === "article" ? `a-${item.id}` : `p-${item.id}`
              const showRecoAfterFirstVitrina = vitrinaSerial === 1
              const showProductsAfterNVitrina =
                vitrinaSerial !== null && vitrinaSerial % PRODUCTS_EVERY_N_VITRINA_POSTS === 0

              return (
                <Fragment key={key}>
                  <div className="border-b border-border">
                    {item.kind === "article" ? (
                      <FeedArticleCard article={item} />
                    ) : (
                      <FeedPostCard
                        post={item}
                        captionExpanded={expandedCaptionPostId === item.id}
                        onToggleCaption={() =>
                          setExpandedCaptionPostId(prev => (prev === item.id ? null : item.id))
                        }
                      />
                    )}
                  </div>
                  {showRecoAfterFirstVitrina ? <FeedMastersRail masters={data.recommendedMasters} /> : null}
                  {showProductsAfterNVitrina ? <FeedProductRail products={data.products} /> : null}
                </Fragment>
              )
            })}
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
