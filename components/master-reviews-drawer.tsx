"use client"

import * as React from "react"
import { X } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/components/ui/use-mobile"
import { ReviewsList } from "@/components/reviews-list"
import { filterValidReviews } from "@/lib/reviews/filter-valid-reviews"
import { cn } from "@/lib/utils"
import type { Review } from "@/lib/types"

const OVERLAY_SOFT = "bg-black/45 backdrop-blur-[2px] dark:bg-black/55 dark:backdrop-blur-[3px]"

export interface MasterReviewsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Сырые отзывы с API — перед показом фильтруются */
  reviews: unknown[] | Review[] | null | undefined
  masterName: string
}

function CloseControl({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "size-9 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      aria-label="Закрыть"
    >
      <X className="size-5" />
    </Button>
  )
}

function ReviewsScrollArea({
  valid,
  className,
}: {
  valid: Review[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]",
        className,
      )}
    >
      {valid.length === 0 ? (
        <p className="px-2 py-12 text-center text-sm leading-relaxed text-muted-foreground">
          Пока нет отзывов к услугам и товарам этого мастера
        </p>
      ) : (
        <div className="px-1 pb-2">
          <ReviewsList reviews={valid} />
        </div>
      )}
    </div>
  )
}

export function MasterReviewsDrawer({
  open,
  onOpenChange,
  reviews,
  masterName,
}: MasterReviewsDrawerProps) {
  const isMobile = useIsMobile()
  const valid = React.useMemo(() => filterValidReviews(reviews as unknown[]), [reviews])

  const subtitle =
    valid.length > 0
      ? `${valid.length.toLocaleString("ru-RU")} отзывов · ${masterName}`
      : `${masterName}`

  const policyNote =
    "Отзыв к профилю мастера оставить нельзя — только к его услуге или товару. Ниже каждый отзыв привязан к конкретной работе."

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          hideCloseButton
          overlayClassName={OVERLAY_SOFT}
          className={cn(
            "gap-0 p-0 focus:outline-none",
            "flex max-h-[min(90dvh,calc(100dvh-env(safe-area-inset-bottom,0px)-8px))] flex-col",
            "rounded-t-3xl border-0 bg-card pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-0",
            "shadow-[0_-12px_48px_-8px_rgba(0,0,0,0.28)] dark:shadow-[0_-16px_56px_-6px_rgba(0,0,0,0.55)]",
            "duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out",
          )}
        >
          {/* Паттерн bottom sheet: ручка + контент на всю ширину МП */}
          <div className="flex shrink-0 flex-col items-center px-4 pt-3 pb-2" aria-hidden>
            <span className="block h-1.5 w-11 rounded-full bg-foreground/20 dark:bg-foreground/25" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-4 sm:px-5">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/60 pb-3">
              <SheetHeader className="flex-1 space-y-1 border-0 p-0 pr-2 text-left">
                <SheetTitle className="text-lg font-semibold tracking-tight">Отзывы</SheetTitle>
                <SheetDescription asChild>
                  <div className="space-y-1.5 text-sm leading-snug text-muted-foreground">
                    <p>{subtitle}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground/90">{policyNote}</p>
                  </div>
                </SheetDescription>
              </SheetHeader>
              <SheetClose asChild>
                <CloseControl />
              </SheetClose>
            </div>

            <ReviewsScrollArea valid={valid} className="mt-3 px-0 pb-1" />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName={OVERLAY_SOFT}
        className={cn(
          "flex w-[calc(100%-1.5rem)] max-w-lg flex-col gap-0 overflow-hidden rounded-2xl border-border/60 p-0",
          "max-h-[min(88vh,720px)] shadow-2xl sm:max-w-[28rem]",
          "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
          <DialogHeader className="flex-1 space-y-1.5 border-0 p-0 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight">Отзывы</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-1.5 text-sm leading-snug text-muted-foreground">
                <p>{subtitle}</p>
                <p className="text-xs leading-relaxed text-muted-foreground/90">{policyNote}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <CloseControl />
          </DialogClose>
        </div>

        <ReviewsScrollArea valid={valid} className="px-5 py-4 sm:px-6 sm:py-5" />
      </DialogContent>
    </Dialog>
  )
}
