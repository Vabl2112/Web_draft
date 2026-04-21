"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Sparkles, ImageIcon, MessageCircle, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"

/** Демо: город подбора топа (позже — из профиля / гео) */
const DEMO_CITY = "Москва"

/** 100 слотов для «топ-100» (уникальный query — позже заменится ID с бэка) */
const GALLERY_BASE_SRC = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1513506003901-1e6be2291ede?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1460661361042-e76e2d0922db?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506905925346-a21b6674f7c5?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1490759557868-88c88d14c5a2?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0a78e?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1528164344705-4759e864256e?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516979183417-b491317a0a0a?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500530855690-bf6c5a3e0b0b?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f04e0a0?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504196606670-af8628abf765?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0a78e?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524758630224-e2b586094c85?w=500&h=500&fit=crop&q=80",
]

const GALLERY_POOL: { src: string; alt: string }[] = Array.from({ length: 100 }, (_, i) => ({
  src: `${GALLERY_BASE_SRC[i % GALLERY_BASE_SRC.length]}&sig=${i}`,
  alt: `Работа ${i + 1}`,
}))

function shuffleGalleryPick(): { src: string; alt: string }[] {
  const copy = [...GALLERY_POOL]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, 6)
}

const mastersPool = [
  {
    id: "1",
    name: "Мария Иванова",
    specialty: "Живопись и иллюстрация",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
    city: "Москва",
    pageViews: 18420,
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    specialty: "Керамика и объект",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=500&fit=crop",
    city: "Москва",
    pageViews: 22100,
  },
  {
    id: "3",
    name: "Анна Петрова",
    specialty: "Ювелирный дизайн",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    rating: 5.0,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
    city: "Москва",
    pageViews: 15300,
  },
  {
    id: "4",
    name: "Игорь Соколов",
    specialty: "Фотография",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    rating: 4.7,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=500&fit=crop",
    city: "Москва",
    pageViews: 9800,
  },
  {
    id: "5",
    name: "Елена Ветрова",
    specialty: "Текстиль и материал",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    reviews: 41,
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=500&fit=crop",
    city: "Москва",
    pageViews: 11200,
  },
]

/** Единый акцент на лендинге: иконки и подсветки (светлая / тёмная тема) */
const accentIcon = "text-amber-600 dark:text-amber-400"
const accentIconBg =
  "bg-amber-500/12 shadow-sm ring-4 ring-background dark:bg-amber-400/10 dark:ring-background"

const HOW_IT_WORKS_STEPS = [
  {
    title: "Найдите автора",
    text: "Фильтры по городу и направлению — без навязанных рубрик.",
    icon: Compass,
  },
  {
    title: "Свяжитесь напрямую",
    text: "Переписка на платформе — без лишних посредников.",
    icon: MessageCircle,
  },
  {
    title: "Договоритесь о формате",
    text: "Заказ, консультация или проект — как договоритесь с автором.",
    icon: Sparkles,
  },
] as const

export function LandingPage() {
  const [gallerySlice, setGallerySlice] = useState<{ src: string; alt: string }[] | null>(null)

  useEffect(() => {
    setGallerySlice(shuffleGalleryPick())
  }, [])

  const topMastersByCity = useMemo(() => {
    return [...mastersPool]
      .filter(m => m.city === DEMO_CITY)
      .sort((a, b) => b.pageViews - a.pageViews)
      .slice(0, 3)
  }, [])

  const galleryDisplay = gallerySlice ?? GALLERY_POOL.slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-amber-50/40 via-background to-background pt-8 pb-14 dark:from-amber-950/15 sm:pt-10 sm:pb-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgb(245 158 11 / 0.22), transparent 45%), radial-gradient(circle at 80% 60%, rgb(251 191 36 / 0.18), transparent 42%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col items-start">
                <Badge
                  variant="secondary"
                  className="mb-3 rounded-full px-4 py-1.5 text-sm font-medium tracking-tight sm:mb-4 sm:px-5 sm:py-2 sm:text-base"
                >
                  Платформа для творческих людей
                </Badge>
                <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                  Идеи, материалы и люди —{" "}
                  <span className={accentIcon}>в одном пространстве</span>
                </h1>
                <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  EGG помогает находить авторов оригинальных вещей и услуг: от предметов и образов до
                  консультаций и совместных проектов. Без жёсткой тематики — только ваша сфера и ваш
                  вкус.
                </p>
                <div className="mt-7 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                  <Link href="/masters">
                    <Button size="lg" className="gap-2 rounded-full px-7 sm:px-8">
                      Смотреть авторов
                      <ArrowRight className="size-5" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-border bg-background/90 px-7 text-foreground shadow-sm backdrop-blur-sm hover:bg-muted hover:text-foreground sm:px-8 dark:bg-input/35 dark:hover:bg-muted dark:hover:text-foreground"
                    >
                      Присоединиться
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/60">
                      <Image
                        src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 400px"
                      />
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/60">
                      <Image
                        src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 400px"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-6">
                    <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/60">
                      <Image
                        src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 400px"
                      />
                    </div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/60">
                      <Image
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 400px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Как это работает */}
        <section className="border-b border-border bg-muted/25 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Как это работает</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Три шага без лишней бюрократии — от поиска до договорённости
              </p>
            </div>

            <ol className="mt-12 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-6 lg:gap-10">
              {HOW_IT_WORKS_STEPS.map(item => (
                <li key={item.title} className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      "relative flex size-[4.5rem] shrink-0 items-center justify-center rounded-3xl",
                      accentIconBg,
                    )}
                  >
                    <item.icon className={cn("size-9", accentIcon)} strokeWidth={1.65} />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mx-auto mt-2.5 max-w-[19rem] text-pretty text-sm leading-relaxed text-muted-foreground sm:max-w-[20rem]">
                    {item.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Зачем EGG</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Мы делаем упор на ясность и уважение к разным видам творческой работы — без узкой
                «ниши» в шапке сайта.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {[
                {
                  icon: Sparkles,
                  title: "Разные практики",
                  description: "Визуальные искусства, ремесло, цифровые и гибридные форматы — на одной площадке.",
                },
                {
                  icon: ImageIcon,
                  title: "Живые портфолио",
                  description: "Смотрите работы и стиль автора до первого сообщения.",
                },
                {
                  icon: Star,
                  title: "Отзывы и рейтинг",
                  description: "Ориентир для выбора — с возможностью уточнить детали лично.",
                },
                {
                  icon: MessageCircle,
                  title: "Честные ожидания",
                  description: "Мы помогаем договориться о формате и сроках — без обещаний «как в рекламе».",
                },
              ].map(feature => (
                <div
                  key={feature.title}
                  className={cn(
                    "group flex h-full flex-col items-center rounded-2xl border border-border/50 bg-card/60 p-6 text-center",
                    "shadow-sm transition-all duration-300",
                    "hover:-translate-y-0.5 hover:border-amber-600/20 hover:bg-card hover:shadow-md",
                    "dark:border-border/60 dark:bg-card/40 dark:hover:border-amber-400/25 dark:hover:bg-card/80",
                  )}
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/12 transition-colors group-hover:bg-amber-500/[0.18] dark:bg-amber-400/10 dark:group-hover:bg-amber-400/15">
                    <feature.icon className={cn("size-7", accentIcon)} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top masters */}
        <section className="border-b border-border py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Сейчас в топе</h2>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  {DEMO_CITY}: три автора с наибольшим интересом к страницам за выбранный период
                  (демо-данные; на бэке — просмотры и гео).
                </p>
              </div>
              <Link href="/masters" className="shrink-0">
                <Button variant="outline" className="gap-2">
                  Все авторы
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topMastersByCity.map((master, idx) => (
                <Link
                  key={master.id}
                  href={`/master/${master.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={master.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium tabular-nums shadow-sm">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-11 ring-2 ring-white/90">
                          <AvatarImage src={master.avatar} alt="" />
                          <AvatarFallback>{master.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">{master.name}</p>
                          <p className="truncate text-sm text-white/75">{master.specialty}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
                        <div className="flex items-center gap-1">
                          <Star className={cn("size-4 fill-amber-500 text-amber-500")} />
                          <span className="font-medium">{master.rating}</span>
                        </div>
                        <span className="text-white/70">{master.reviews} отзывов</span>
                        <span className="text-xs text-white/60 tabular-nums">
                          ~{(master.pageViews / 1000).toFixed(1)}k просм.
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="border-b border-border py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Галерея</h2>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  Случайная подборка из топ-100 работ (демо: перемешивание на клиенте; позже — метод
                  API).
                </p>
              </div>
              <Link href="/gallery">
                <Button variant="outline" className="gap-2">
                  Открыть галерею
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
              {galleryDisplay.map((image, i) => (
                <Link
                  key={`${image.src}-${i}`}
                  href="/gallery"
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-xl ring-1 ring-border/60",
                    i === 0 && "sm:col-span-1 lg:row-span-1"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-12 text-center text-background sm:px-10 sm:py-14">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 20%, rgb(245 158 11 / 0.45), transparent 52%)",
                }}
              />
              <div className="relative">
                <h2 className="text-3xl font-bold sm:text-4xl">Создайте аккаунт за минуту</h2>
                <p className="mx-auto mt-4 max-w-lg text-pretty text-background/75">
                  Сохраняйте авторов, ведите переписку и оформляйте публичную страницу — когда будете
                  готовы показать свою практику.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/register">
                    <Button size="lg" variant="secondary" className="gap-2 rounded-full px-8">
                      Регистрация
                      <ArrowRight className="size-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-background/25 bg-transparent px-8 text-background hover:bg-background/10 hover:text-background"
                    >
                      Уже есть аккаунт
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
