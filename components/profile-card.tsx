"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, MessageSquare, Heart, Instagram, Send, Globe, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageDialog } from "@/components/message-dialog"
import { EntityActionsDropdown } from "@/components/entity-share-menu"
import { BoostyIcon, MaxIcon, VkIcon } from "@/components/social-icons"
import { RatingStars } from "@/components/rating-stars"
import { cn } from "@/lib/utils"
import type { Artist } from "@/lib/types"

interface ProfileCardProps {
  artist: Artist
  /** На своей странице мастеру не показываем «Пожаловаться» */
  showReport?: boolean
  /** Открыть панель отзывов (клик по блоку рейтинга) */
  onOpenReviews?: () => void
}

export function ProfileCard({ artist, showReport = true, onOpenReviews }: ProfileCardProps) {
  const [messageOpen, setMessageOpen] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const socialLinks = artist.socialLinks

  const locationLabel = [artist.location, artist.metro].filter(Boolean).join(" · ")

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
      <div className="p-5 sm:p-7 md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
          {/* Аватар */}
          <div className="flex shrink-0 justify-center lg:justify-start">
            <Avatar className="size-28 ring-2 ring-border/60 shadow-sm sm:size-36 md:size-40">
              <AvatarImage src={artist.avatar} alt={artist.name} className="object-cover" />
              <AvatarFallback className="text-2xl font-semibold md:text-3xl">
                {artist.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* Шапка: имя + подзаголовок | локация и меню */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 space-y-1">
                <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-[2rem] md:leading-tight">
                  {artist.name}
                </h1>
                {artist.title ? (
                  <p className="text-pretty text-sm leading-snug text-muted-foreground md:text-[15px]">
                    {artist.title}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
                <span className="inline-flex max-w-[min(100%,18rem)] items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-sm text-foreground">
                  <MapPin className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="truncate">{locationLabel}</span>
                </span>
                <EntityActionsDropdown
                  sharePath={`/master/${artist.id}`}
                  shareTitle={artist.name}
                  reportKind="профиль мастера"
                  icon="vertical"
                  showReport={showReport}
                  triggerClassName="size-9 shrink-0 rounded-md border-2 border-border/70 bg-background shadow-sm hover:bg-muted sm:size-10"
                />
              </div>
            </div>

            {/* Рейтинг — кнопка открытия панели отзывов */}
            {onOpenReviews ? (
              <button
                type="button"
                onClick={onOpenReviews}
                className={cn(
                  "mt-5 flex w-full max-w-md flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm transition-colors md:mt-6 md:max-w-none md:px-2 md:py-2",
                  "bg-muted/25 hover:bg-muted/45 focus-visible:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
                title="Отзывы оставляют только к услугам и товарам мастера; рейтинг считается по ним"
                aria-label={`Отзывы к услугам и товарам: рейтинг ${artist.rating}, ${artist.reviewsCount.toLocaleString("ru-RU")} отзывов`}
              >
                <RatingStars rating={artist.rating} className="gap-0.5" />
                <span className="font-semibold tabular-nums text-foreground">{artist.rating}</span>
                <span className="text-muted-foreground">
                  · {artist.reviewsCount.toLocaleString("ru-RU")}{" "}
                  <span className="hidden sm:inline">к услугам и товарам</span>
                  <span className="sm:hidden">отзывов</span>
                </span>
                <ChevronRight
                  className="ml-auto size-5 shrink-0 text-muted-foreground md:hidden"
                  aria-hidden
                />
              </button>
            ) : (
              <div
                className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm md:mt-6"
                title="Рейтинг считается по отзывам к услугам и товарам мастера"
              >
                <RatingStars rating={artist.rating} className="gap-0.5" />
                <span className="font-semibold tabular-nums text-foreground">{artist.rating}</span>
                <span className="text-muted-foreground">
                  · {artist.reviewsCount.toLocaleString("ru-RU")}{" "}
                  <span className="hidden sm:inline">к услугам и товарам</span>
                  <span className="sm:hidden">отзывов</span>
                </span>
              </div>
            )}

            {/* Текст и теги: сетка выравнивает колонки по канонам (одна базовая линия) */}
            <div className="mt-5 grid min-w-0 gap-8 md:mt-6 lg:grid-cols-[minmax(0,1fr)_min(13.5rem,28%)] lg:gap-x-10 lg:gap-y-0">
              <p className="max-w-prose text-[15px] leading-[1.65] text-muted-foreground md:text-base md:leading-relaxed">
                {artist.about}
              </p>

              {artist.tags.length > 0 ? (
                <aside className="min-w-0 lg:pt-0.5">
                  <h2 className="mb-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Направления
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {artist.tags.map(tag => (
                      <li key={tag}>
                        <Badge
                          variant="secondary"
                          className="rounded-full border-0 bg-muted/70 px-3 py-1 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          {tag}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </aside>
              ) : null}
            </div>

            {/* Действия */}
            <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-6 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Button
                size="lg"
                className="h-11 w-full rounded-xl px-6 text-base font-semibold sm:w-auto"
                onClick={() => setMessageOpen(true)}
              >
                <MessageSquare className="size-5" />
                Написать
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-11 w-full rounded-xl sm:w-auto"
                onClick={() => setIsSubscribed(!isSubscribed)}
              >
                <Heart className={cn("size-5", isSubscribed && "fill-destructive text-destructive")} />
                {isSubscribed ? "Вы подписаны" : "Подписаться"}
              </Button>
              {socialLinks ? (
                <div className="flex flex-wrap items-center gap-2 sm:pl-0">
                  <span className="sr-only">Соцсети</span>
                  <div className="inline-flex flex-wrap gap-1 rounded-xl border border-border/50 bg-muted/20 p-1">
                    {socialLinks.vk && (
                      <Button variant="ghost" size="icon" className="size-10 rounded-lg sm:size-11" asChild>
                        <Link href={socialLinks.vk} target="_blank" rel="noreferrer" aria-label="VK">
                          <VkIcon className="size-5" />
                        </Link>
                      </Button>
                    )}
                    {socialLinks.telegram && (
                      <Button variant="ghost" size="icon" className="size-10 rounded-lg sm:size-11" asChild>
                        <Link href={socialLinks.telegram} target="_blank" rel="noreferrer" aria-label="Telegram">
                          <Send className="size-5" />
                        </Link>
                      </Button>
                    )}
                    {socialLinks.instagram && (
                      <Button variant="ghost" size="icon" className="size-10 rounded-lg sm:size-11" asChild>
                        <Link href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                          <Instagram className="size-5" />
                        </Link>
                      </Button>
                    )}
                    {socialLinks.max && (
                      <Button variant="ghost" size="icon" className="size-10 rounded-lg sm:size-11" asChild>
                        <Link href={socialLinks.max} target="_blank" rel="noreferrer" aria-label="Max">
                          <MaxIcon className="size-5" />
                        </Link>
                      </Button>
                    )}
                    {socialLinks.boosty && (
                      <Button variant="ghost" size="icon" className="size-10 rounded-lg sm:size-11" asChild>
                        <Link href={socialLinks.boosty} target="_blank" rel="noreferrer" aria-label="Boosty">
                          <BoostyIcon className="size-5" />
                        </Link>
                      </Button>
                    )}
                    {socialLinks.website && (
                      <Button variant="ghost" size="icon" className="size-10 rounded-lg sm:size-11" asChild>
                        <Link href={socialLinks.website} target="_blank" rel="noreferrer" aria-label="Сайт">
                          <Globe className="size-5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <MessageDialog
        open={messageOpen}
        onOpenChange={setMessageOpen}
        artist={{
          id: artist.id,
          name: artist.name,
          avatar: artist.avatar,
        }}
      />
    </section>
  )
}
