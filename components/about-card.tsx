import { BadgeCheck, Zap, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Artist } from "@/lib/types"

interface AboutCardProps {
  artist: Artist
}

const badgeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  verified: BadgeCheck,
  fast: Zap,
  works: Briefcase,
}

export function AboutCard({ artist }: AboutCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-lg font-semibold text-foreground">О себе</h2>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {artist.about}
      </p>
      
      <div className="mb-6 flex flex-wrap gap-2">
        {artist.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="rounded-full px-3 py-1">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
        {artist.badges.map((badge) => {
          const IconComponent = badgeIconMap[badge.icon] || BadgeCheck
          return (
            <div key={badge.label} className="flex flex-col items-center gap-1.5 text-center">
              <IconComponent className="size-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{badge.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
