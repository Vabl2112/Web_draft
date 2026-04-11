"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Users, ImageIcon, Shield, ChevronDown, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Footer } from "@/components/footer"
import { useState } from "react"

const cities = [
  { id: "moscow", name: "Москва" },
  { id: "spb", name: "Санкт-Петербург" },
  { id: "kazan", name: "Казань" },
  { id: "novosibirsk", name: "Новосибирск" },
  { id: "ekaterinburg", name: "Екатеринбург" },
]

const navLinks = [
  { href: "/masters", label: "Мастера" },
  { href: "/gallery", label: "Фотогалерея" },
  { href: "/services", label: "Услуги" },
  { href: "/products", label: "Товары" },
]

const featuredMasters = [
  {
    id: "1",
    name: "Мария Иванова",
    specialty: "Японский стиль",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=500&fit=crop",
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    specialty: "Реализм",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1590246814883-57764a58d1a3?w=400&h=500&fit=crop",
  },
  {
    id: "3",
    name: "Анна Петрова",
    specialty: "Минимализм",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    rating: 5.0,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&h=500&fit=crop",
  },
]

const galleryImages = [
  { id: "1", src: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop", alt: "Тату 1" },
  { id: "2", src: "https://images.unsplash.com/photo-1590246814883-57764a58d1a3?w=400&h=400&fit=crop", alt: "Тату 2" },
  { id: "3", src: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&h=400&fit=crop", alt: "Тату 3" },
  { id: "4", src: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=400&fit=crop", alt: "Тату 4" },
  { id: "5", src: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=400&h=400&fit=crop", alt: "Тату 5" },
  { id: "6", src: "https://images.unsplash.com/photo-1542756796-a50f9f5ae419?w=400&h=400&fit=crop", alt: "Тату 6" },
]

const stats = [
  { value: "500+", label: "Мастеров" },
  { value: "10K+", label: "Работ в галерее" },
  { value: "25K+", label: "Довольных клиентов" },
  { value: "4.9", label: "Средний рейтинг" },
]

export function LandingPage() {
  const [selectedCity, setSelectedCity] = useState("moscow")
  const currentCity = cities.find(c => c.id === selectedCity)

  return (
    <div className="min-h-screen bg-background">
      {/* Header for unauthenticated users */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-2xl font-bold text-amber-500">EGG</span>
            </Link>
            
            {/* Location Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden gap-2 rounded-full sm:flex">
                  <MapPin className="size-4" />
                  <span>{currentCity?.name}</span>
                  <ChevronDown className="size-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className="flex items-center justify-between"
                  >
                    {city.name}
                    {selectedCity === city.id && <Check className="size-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Войти
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1">
                Регистрация
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-amber-50/50 to-background py-16 dark:from-amber-950/20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="flex flex-col items-start">
                <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">
                  Лучшие мастера города
                </Badge>
                <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Найди своего <span className="text-amber-500">тату-мастера</span>
                </h1>
                <p className="mt-6 max-w-lg text-pretty text-lg text-muted-foreground">
                  EGG — платформа, где встречаются талантливые мастера и ценители качественных татуировок. 
                  Просматривайте портфолио, читайте отзывы и записывайтесь онлайн.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/masters">
                    <Button size="lg" className="gap-2 rounded-full px-8">
                      Найти мастера
                      <ArrowRight className="size-5" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline" className="rounded-full px-8">
                      Стать мастером
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Image Grid */}
              <div className="relative hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                      <Image
                        src="https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=500&fit=crop"
                        alt="Тату работа"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-2xl">
                      <Image
                        src="https://images.unsplash.com/photo-1590246814883-57764a58d1a3?w=400&h=400&fit=crop"
                        alt="Тату работа"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative aspect-square overflow-hidden rounded-2xl">
                      <Image
                        src="https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&h=400&fit=crop"
                        alt="Тату работа"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                      <Image
                        src="https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=500&fit=crop"
                        alt="Тату работа"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-b border-border py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Почему выбирают EGG</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Мы создали платформу, которая упрощает поиск идеального мастера
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Users,
                  title: "Проверенные мастера",
                  description: "Каждый мастер проходит верификацию и подтверждает свой опыт",
                },
                {
                  icon: ImageIcon,
                  title: "Большое портфолио",
                  description: "Тысячи работ для вдохновения и выбора своего стиля",
                },
                {
                  icon: Star,
                  title: "Честные отзывы",
                  description: "Реальные отзывы от клиентов помогут сделать правильный выбор",
                },
                {
                  icon: Shield,
                  title: "Безопасность",
                  description: "Онлайн-запись и прозрачные условия сотрудничества",
                },
              ].map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10">
                    <feature.icon className="size-7 text-amber-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Masters */}
        <section className="border-b border-border py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">Лучшие мастера</h2>
                <p className="mt-2 text-muted-foreground">Топ мастеров по отзывам клиентов</p>
              </div>
              <Link href="/masters">
                <Button variant="outline" className="hidden gap-2 sm:flex">
                  Все мастера
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredMasters.map((master) => (
                <Link 
                  key={master.id} 
                  href={`/masters/${master.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={master.image}
                      alt={master.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-12 ring-2 ring-white">
                          <AvatarImage src={master.avatar} alt={master.name} />
                          <AvatarFallback>{master.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">{master.name}</p>
                          <p className="text-sm text-white/70">{master.specialty}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-white">{master.rating}</span>
                        </div>
                        <span className="text-sm text-white/70">{master.reviews} отзывов</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/masters">
                <Button variant="outline" className="gap-2">
                  Все мастера
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="border-b border-border py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">Галерея работ</h2>
                <p className="mt-2 text-muted-foreground">Вдохновляйтесь работами наших мастеров</p>
              </div>
              <Link href="/gallery">
                <Button variant="outline" className="hidden gap-2 sm:flex">
                  Вся галерея
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {galleryImages.map((image) => (
                <Link
                  key={image.id}
                  href="/gallery"
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/gallery">
                <Button variant="outline" className="gap-2">
                  Вся галерея
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-3xl bg-foreground px-6 py-16 text-center text-background sm:px-12">
              <h2 className="text-3xl font-bold sm:text-4xl">Готовы найти своего мастера?</h2>
              <p className="mx-auto mt-4 max-w-xl text-background/70">
                Зарегистрируйтесь сейчас и получите доступ ко всем функциям платформы: 
                записывайтесь к мастерам, сохраняйте понравившиеся работы и общайтесь напрямую.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="gap-2 rounded-full px-8">
                    Создать аккаунт
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="rounded-full border-background/20 px-8 text-background hover:bg-background/10 hover:text-background">
                    Уже есть аккаунт
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
