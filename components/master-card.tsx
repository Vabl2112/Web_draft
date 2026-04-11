"use client"

import Link from "next/link"
import { Star, MapPin, CheckCircle, Clock, Briefcase } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface MasterCardProps {
  master: {
    id: string
    name: string
    avatar: string
    specialty: string
    rating: number
    reviewsCount: number
    location: string
    styles: string[]
    verified: boolean
    experience: string
    worksCount: number
  }
}

export function MasterCard({ master }: MasterCardProps) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-lg sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Avatar */}
        <Link href={`/artist/${master.id}`} className="shrink-0 self-center sm:self-start">
          <Avatar className="size-24 ring-4 ring-background shadow-lg transition-transform group-hover:scale-105 sm:size-28">
            <AvatarImage src={master.avatar} alt={master.name} />
            <AvatarFallback>{master.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Link>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col text-center sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-3">
            <Link href={`/artist/${master.id}`}>
              <h3 className="text-lg font-semibold text-foreground transition-colors hover:text-foreground/80 sm:text-xl">
                {master.name}
              </h3>
            </Link>
            {master.verified && (
              <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700">
                <CheckCircle className="size-3" />
                Проверен
              </Badge>
            )}
          </div>
          
          <p className="mt-1 text-sm text-muted-foreground">{master.specialty}</p>
          
          {/* Rating */}
          <div className="mt-2 flex items-center justify-center gap-1 sm:justify-start">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{master.rating}</span>
            <span className="text-muted-foreground">({master.reviewsCount} отзывов)</span>
          </div>

          {/* Location */}
          <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
            <MapPin className="size-4" />
            <span>{master.location}</span>
          </div>

          {/* Stats */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-4" />
              <span>{master.experience}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Briefcase className="size-4" />
              <span>{master.worksCount} работ</span>
            </div>
          </div>

          {/* Styles */}
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            {master.styles.map((style) => (
              <Badge key={style} variant="outline" className="rounded-full">
                {style}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:shrink-0">
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/artist/${master.id}`}>Профиль</Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Написать
          </Button>
        </div>
      </div>
    </div>
  )
}
