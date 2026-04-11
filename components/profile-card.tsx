"use client"

import { Star, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Artist } from "@/lib/types"

interface ProfileCardProps {
  artist: Artist
}

export function ProfileCard({ artist }: ProfileCardProps) {
  return (
    <div className="flex flex-col gap-6 pb-6 lg:flex-row lg:items-start lg:gap-8">
      {/* Avatar */}
      <Avatar className="size-36 shrink-0 ring-4 ring-background shadow-lg sm:size-44">
        <AvatarImage src={artist.avatar} alt={artist.name} className="object-cover" />
        <AvatarFallback className="text-3xl font-bold">
          {artist.name.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      
      {/* Info */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {artist.name}
          </h1>
          
          <div className="mt-1 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`size-4 ${i < Math.floor(artist.rating) ? "fill-foreground text-foreground" : "fill-muted text-muted"}`}
              />
            ))}
            <span className="ml-1 font-semibold">{artist.rating}</span>
            <span className="text-muted-foreground">({artist.reviewsCount} reviews)</span>
          </div>
        </div>
        
        <p className="max-w-lg text-muted-foreground">
          {artist.about}
        </p>
        
        <Button className="w-fit px-8 py-6 text-base font-semibold uppercase tracking-wide">
          Записаться на сеанс
        </Button>
      </div>
      
      {/* Location and Tags */}
      <div className="flex flex-col items-start gap-4 lg:items-end">
        <div className="flex items-center gap-1.5 text-foreground">
          <MapPin className="size-5" />
          <span className="font-medium">{artist.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
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
