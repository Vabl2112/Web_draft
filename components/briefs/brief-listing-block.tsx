"use client"

import Image from "next/image"
import type { BriefListingSnapshot } from "@/lib/briefs/types"
import { BRIEF_CATEGORY_LABELS } from "@/lib/briefs/market-categories"
import { formatListingPrice } from "@/lib/briefs/listing-snapshot"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function BriefListingBlock({
  listing,
  className,
  compact,
}: {
  listing: BriefListingSnapshot
  className?: string
  compact?: boolean
}) {
  const cat = BRIEF_CATEGORY_LABELS[listing.category] ?? listing.category
  const vendor = listing.kind === "product" ? listing.seller : listing.master

  const hasMainImage = Boolean(listing.image) && !compact

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-muted/20",
        compact ? "flex gap-3 p-3" : hasMainImage ? "grid gap-4 p-4 sm:grid-cols-[minmax(0,140px)_1fr]" : "p-4",
        className,
      )}
    >
      {hasMainImage && (
        <div className="relative aspect-square w-full max-w-[140px] overflow-hidden rounded-lg bg-muted">
          <Image src={listing.image!} alt={listing.title} fill className="object-cover" sizes="140px" />
        </div>
      )}
      {listing.image && compact && (
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image src={listing.image} alt={listing.title} fill className="object-cover" sizes="64px" />
        </div>
      )}
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{listing.kind === "product" ? "Товар" : "Услуга"}</Badge>
          <Badge variant="outline">{cat}</Badge>
        </div>
        <h3 className={cn("font-semibold leading-snug", compact ? "text-sm" : "text-base")}>{listing.title}</h3>
        <p className={cn("text-muted-foreground", compact ? "line-clamp-2 text-xs" : "line-clamp-4 text-sm")}>
          {listing.description}
        </p>
        <p className="text-sm font-medium text-foreground">{formatListingPrice(listing)}</p>
        {listing.duration && (
          <p className="text-xs text-muted-foreground">Длительность (из витрины): {listing.duration}</p>
        )}
        {vendor && (
          <div className="flex items-center gap-2 pt-1">
            <Avatar className="size-8">
              <AvatarImage src={vendor.avatar} alt="" />
              <AvatarFallback>{vendor.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{vendor.name}</span>
          </div>
        )}
      </div>
    </div>
  )
}
