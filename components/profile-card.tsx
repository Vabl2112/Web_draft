"use client"

import { useState } from "react"
import { Star, MapPin, MessageSquare, Heart, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Artist } from "@/lib/types"

interface ProfileCardProps {
  artist: Artist
}

export function ProfileCard({ artist }: ProfileCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="flex flex-col gap-6 pb-6 lg:flex-row lg:items-start lg:gap-8">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="size-36 shrink-0 ring-4 ring-background shadow-lg sm:size-44">
          <AvatarImage src={artist.avatar} alt={artist.name} className="object-cover" />
          <AvatarFallback className="text-3xl font-bold">
            {artist.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Info */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {artist.name}
            </h1>
            
            {/* Mobile Favorite & Share */}
            <div className="flex gap-2 lg:hidden">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={cn("size-5", isFavorite && "fill-destructive text-destructive")} />
              </Button>
              <Button variant="outline" size="icon" className="shrink-0">
                <Share2 className="size-5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`size-4 ${i < Math.floor(artist.rating) ? "fill-foreground text-foreground" : "fill-muted text-muted"}`}
              />
            ))}
            <span className="ml-1 font-semibold">{artist.rating}</span>
            <span className="text-muted-foreground">({artist.reviewsCount} отзывов)</span>
          </div>
        </div>
        
        <p className="max-w-lg text-muted-foreground">
          {artist.about}
        </p>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button className="gap-2 px-6 py-5 text-base font-semibold">
            <MessageSquare className="size-5" />
            Написать
          </Button>
          
          {/* Desktop Favorite */}
          <Button
            variant="outline"
            size="lg"
            className="hidden gap-2 lg:flex"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={cn("size-5", isFavorite && "fill-destructive text-destructive")} />
            {isFavorite ? "В избранном" : "В избранное"}
          </Button>
          
          {/* Desktop Share */}
          <Button variant="outline" size="icon" className="hidden size-11 lg:flex">
            <Share2 className="size-5" />
          </Button>
        </div>
      </div>
      
      {/* Location and Tags */}
      <div className="flex flex-col items-start gap-4 lg:items-end">
        <div className="flex items-center gap-1.5 text-foreground">
          <MapPin className="size-5" />
          <span className="font-medium">{artist.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {artist.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="default"
              className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background hover:bg-foreground/90"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
