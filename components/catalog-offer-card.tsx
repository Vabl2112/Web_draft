"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { ImageCarousel } from "@/components/image-carousel"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  Heart,
  MessageSquare,
  MoreVertical,
  Package,
  Star,
  Edit2,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EntityShareMenuItems } from "@/components/entity-share-menu"
import { MessageDialog } from "@/components/message-dialog"
import { cn } from "@/lib/utils"
import { useSuppressNavAfterDropdownClose } from "@/hooks/use-suppress-nav-after-dropdown"
import { useSingleOrDoubleTap } from "@/hooks/use-single-or-double-tap"
import type { CatalogOfferItem } from "@/lib/types"

function catalogOfferSlides(item: CatalogOfferItem): string[] {
  if (item.images?.length) return item.images
  return [item.image]
}

/** Надзаголовок над названием: контурная иконка + «Товар» / «Услуга» (как мелкий серый текст у отзывов) */
function OfferKindSubtitle({
  kind,
  className,
}: {
  kind: CatalogOfferItem["kind"]
  className?: string
}) {
  const Icon = kind === "product" ? Package : CalendarDays
  const label = kind === "product" ? "Товар" : "Услуга"
  return (
    <p className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded border border-muted-foreground/30 text-muted-foreground"
        aria-hidden
      >
        <Icon className="size-3" strokeWidth={1.5} />
      </span>
      <span>{label}</span>
    </p>
  )
}

export interface CatalogOfferCardProps {
  item: CatalogOfferItem
  viewMode: "grid" | "list"
  /** Режим владельца профиля: меню редактирования вместо «поделиться» */
  profileOwner?: {
    onEdit: () => void
    onDelete?: () => void
    deleteTitle: string
    deleteDescription: string
  }
  /** Страница мастера: не дублировать имя/аватар продавца под карточкой */
  hideSellerRow?: boolean
}

export function CatalogOfferCard({ item, viewMode, profileOwner, hideSellerRow }: CatalogOfferCardProps) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { allowCardNavigation, scheduleBlockCardNav } = useSuppressNavAfterDropdownClose()

  const discount =
    item.kind === "product" && item.originalPrice
      ? Math.round(((item.originalPrice - item.priceValue) / item.originalPrice) * 100)
      : null

  const go = () => router.push(item.href)

  const onCatalogImageTap = useSingleOrDoubleTap<CatalogOfferItem>(
    useCallback(
      _p => {
        if (messageOpen || deleteOpen) return
        if (!allowCardNavigation()) return
        go()
      },
      [messageOpen, deleteOpen, allowCardNavigation, go],
    ),
    useCallback(() => {
      setIsLiked(v => !v)
    }, []),
    it => it.id,
  )

  const ownerMenu = profileOwner ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-8 shrink-0 border border-border/70 bg-background/95 shadow-sm sm:size-9"
          onClick={e => e.stopPropagation()}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation()
            profileOwner.onEdit()
          }}
        >
          <Edit2 className="mr-2 size-4" />
          Редактировать
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {profileOwner.onDelete ? (
          <>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={e => {
                e.stopPropagation()
                setDeleteOpen(true)
              }}
            >
              <Trash2 className="mr-2 size-4" />
              Удалить
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <EntityShareMenuItems
          sharePath={item.href}
          shareTitle={item.shareTitle}
          reportKind={item.reportKind}
          showReport={false}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null

  if (viewMode === "list") {
    return (
      <>
        <div
          className="group flex cursor-pointer gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-lg sm:gap-6"
          onClick={() => {
            if (messageOpen || deleteOpen) return
            if (!allowCardNavigation()) return
            go()
          }}
        >
          <div
            className={cn(
              "relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-40",
              !profileOwner && "cursor-pointer",
            )}
            onClick={
              profileOwner
                ? undefined
                : e => {
                    e.stopPropagation()
                    onCatalogImageTap(item)
                  }
            }
            role={!profileOwner ? "button" : undefined}
            tabIndex={!profileOwner ? 0 : undefined}
            onKeyDown={
              !profileOwner
                ? e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onCatalogImageTap(item)
                    }
                  }
                : undefined
            }
            aria-label={!profileOwner ? "Открыть: двойной тап — лайк" : undefined}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {discount ? (
              <Badge className="pointer-events-none absolute left-2 top-2 z-20 border border-white/25 bg-destructive text-destructive-foreground shadow-md">
                -{discount}%
              </Badge>
            ) : null}
            {item.kind === "product" && !item.inStock ? (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <Badge variant="secondary">Нет в наличии</Badge>
              </div>
            ) : null}
            {!profileOwner ? (
              <div className="absolute right-2 top-2 z-[25]" onClick={e => e.stopPropagation()}>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "size-9 rounded-xl border border-border/70 bg-background/95 shadow-sm",
                    isLiked && "border-destructive/30",
                  )}
                  aria-pressed={isLiked}
                  aria-label={isLiked ? "Снять лайк" : "Поставить лайк"}
                  onClick={e => {
                    e.stopPropagation()
                    setIsLiked(v => !v)
                  }}
                >
                  <Heart className={cn("size-4", isLiked && "fill-destructive text-destructive")} />
                </Button>
              </div>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <OfferKindSubtitle kind={item.kind} className="mb-1.5" />
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-foreground">
                {item.title}
              </h3>
              <div className="flex shrink-0 items-center gap-1" onClick={e => e.stopPropagation()}>
                {profileOwner ? ownerMenu : null}
              </div>
            </div>

            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>

            {item.duration ? (
              <p className="mt-1 text-xs text-muted-foreground">Длительность: {item.duration}</p>
            ) : null}

            {item.rating != null ? (
              <div className="mt-2 flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{item.rating}</span>
                {item.reviewsCount != null && item.reviewsCount > 0 ? (
                  <span className="text-sm text-muted-foreground">({item.reviewsCount})</span>
                ) : null}
              </div>
            ) : null}

            {!hideSellerRow ? (
              <Link
                href={`/master/${item.seller.id}`}
                className="mt-2 flex items-center gap-2 transition-opacity hover:opacity-80"
                onClick={e => e.stopPropagation()}
              >
                <Avatar className="size-5">
                  <AvatarImage src={item.seller.avatar} alt="" />
                  <AvatarFallback>{item.seller.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground/65">
                  {item.seller.name}
                </span>
              </Link>
            ) : null}

            <div className="mt-auto flex items-end justify-between gap-4 pt-3">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">{item.priceLabel}</span>
                {item.kind === "product" && item.originalPrice ? (
                  <span className="text-sm text-muted-foreground line-through">
                    {item.originalPrice.toLocaleString("ru-RU")} ₽
                  </span>
                ) : null}
              </div>
              {!profileOwner ? (
                <Button
                  className="gap-2"
                  disabled={item.kind === "product" && !item.inStock}
                  onClick={e => {
                    e.stopPropagation()
                    setMessageOpen(true)
                  }}
                >
                  <MessageSquare className="size-4" />
                  <span className="hidden sm:inline">Написать мастеру</span>
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {!profileOwner ? (
          <MessageDialog
            open={messageOpen}
            onOpenChange={open => {
              setMessageOpen(open)
              if (!open) scheduleBlockCardNav()
            }}
            artist={{
              id: item.seller.id,
              name: item.seller.name,
              avatar: item.seller.avatar,
            }}
          />
        ) : null}

        {profileOwner?.onDelete ? (
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent onClick={e => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>{profileOwner.deleteTitle}</AlertDialogTitle>
                <AlertDialogDescription>{profileOwner.deleteDescription}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    profileOwner.onDelete?.()
                    setDeleteOpen(false)
                  }}
                >
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </>
    )
  }

  return (
    <>
      <div
        className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg"
        onClick={() => {
          if (messageOpen || deleteOpen) return
          if (!allowCardNavigation()) return
          go()
        }}
      >
        <div
          className="relative aspect-square overflow-hidden bg-muted"
          onClick={!profileOwner ? e => e.stopPropagation() : undefined}
        >
          <ImageCarousel
            images={catalogOfferSlides(item)}
            alt={item.title}
            aspectRatio="square"
            className="h-full rounded-none rounded-t-2xl"
            fillContainer
            onImageClick={!profileOwner ? () => onCatalogImageTap(item) : undefined}
          />
          {discount ? (
            <Badge className="pointer-events-none absolute left-3 top-3 z-20 border border-white/25 bg-destructive text-destructive-foreground shadow-md">
              -{discount}%
            </Badge>
          ) : null}
          {item.kind === "product" && !item.inStock ? (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <Badge variant="secondary" className="text-base">
                Нет в наличии
              </Badge>
            </div>
          ) : null}
          <div className="absolute right-3 top-3 z-[25] flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {!profileOwner ? (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className={cn(
                  "size-9 rounded-xl border border-border/70 bg-background/95 shadow-sm",
                  isLiked && "border-destructive/30",
                )}
                aria-pressed={isLiked}
                aria-label={isLiked ? "Снять лайк" : "Поставить лайк"}
                onClick={e => {
                  e.stopPropagation()
                  setIsLiked(v => !v)
                }}
              >
                <Heart className={cn("size-4", isLiked && "fill-destructive text-destructive")} />
              </Button>
            ) : null}
            {profileOwner ? ownerMenu : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <OfferKindSubtitle kind={item.kind} className="mb-1.5" />
          <h3 className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-foreground">
            {item.title}
          </h3>

          {item.duration ? (
            <p className="mt-1 text-xs text-muted-foreground">{item.duration}</p>
          ) : null}

          {item.rating != null ? (
            <div className="mt-2 flex items-center gap-1">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{item.rating}</span>
              {item.reviewsCount != null && item.reviewsCount > 0 ? (
                <span className="text-sm text-muted-foreground">({item.reviewsCount})</span>
              ) : null}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">{item.priceLabel}</span>
            {item.kind === "product" && item.originalPrice ? (
              <span className="text-sm text-muted-foreground line-through">
                {item.originalPrice.toLocaleString("ru-RU")} ₽
              </span>
            ) : null}
          </div>

          {!hideSellerRow ? (
            <Link
              href={`/master/${item.seller.id}`}
              className="mt-3 flex items-center gap-2 transition-opacity hover:opacity-80"
              onClick={e => e.stopPropagation()}
            >
              <Avatar className="size-6">
                <AvatarImage src={item.seller.avatar} alt="" />
                <AvatarFallback>{item.seller.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground/65">
                {item.seller.name}
              </span>
            </Link>
          ) : null}

          {!profileOwner ? (
            <Button
              className="mt-4 w-full gap-2"
              disabled={item.kind === "product" && !item.inStock}
              onClick={e => {
                e.stopPropagation()
                setMessageOpen(true)
              }}
            >
              <MessageSquare className="size-4" />
              Написать мастеру
            </Button>
          ) : null}
        </div>
      </div>

      {!profileOwner ? (
        <MessageDialog
          open={messageOpen}
          onOpenChange={open => {
            setMessageOpen(open)
            if (!open) scheduleBlockCardNav()
          }}
          artist={{
            id: item.seller.id,
            name: item.seller.name,
            avatar: item.seller.avatar,
          }}
        />
      ) : null}

      {profileOwner?.onDelete ? (
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent onClick={e => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>{profileOwner.deleteTitle}</AlertDialogTitle>
              <AlertDialogDescription>{profileOwner.deleteDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  profileOwner.onDelete?.()
                  setDeleteOpen(false)
                }}
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </>
  )
}
