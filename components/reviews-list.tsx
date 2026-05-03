"use client"

import Link from "next/link"
import { Package, PenLine, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Review } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ReviewsListProps {
  reviews: Review[]
  className?: string
}

export function ReviewTargetBadge({ review }: { review: Review }) {
  const isService = review.targetType === "service"
  const href = isService ? `/service/${review.targetId}` : `/product/${review.targetId}`
  const label = isService ? "Услуга" : "Товар"

  return (
    <Link
      href={href}
      className={cn(
        "group/target mt-2 inline-flex max-w-full items-center gap-2 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1.5 text-xs transition-colors",
        "hover:border-border hover:bg-muted/70",
      )}
    >
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background/80 text-muted-foreground ring-1 ring-border/60 group-hover/target:text-foreground"
        aria-hidden
      >
        {isService ? <PenLine className="size-3.5" /> : <Package className="size-3.5" />}
      </span>
      <span className="min-w-0 text-left leading-snug">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="mt-0.5 block truncate font-medium text-foreground group-hover/target:underline">
          {review.targetTitle}
        </span>
      </span>
    </Link>
  )
}

/** Только уже отфильтрованные валидные отзывы */
export function ReviewsList({ reviews, className }: ReviewsListProps) {
  if (reviews.length === 0) return null

  return (
    <ul className={cn("flex flex-col gap-5", className)}>
      {reviews.map(review => (
        <li key={review.id} className="border-b border-border/60 pb-5 last:border-0 last:pb-0">
          <div className="flex gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage src={review.avatar} alt="" />
              <AvatarFallback>{review.author.split(/\s+/).map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
                  <span className="text-sm font-medium tabular-nums">{review.rating}</span>
                  <span className="truncate font-medium text-foreground">{review.author}</span>
                </div>
                <time className="shrink-0 text-xs text-muted-foreground">{review.date}</time>
              </div>
              <ReviewTargetBadge review={review} />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
