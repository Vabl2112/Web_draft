import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Review } from "@/lib/types"

interface ReviewsCardProps {
  reviews: Review[]
}

export function ReviewsCard({ reviews }: ReviewsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Отзывы</h2>
      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage src={review.avatar} alt={review.author} />
              <AvatarFallback>
                {review.author.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{review.rating}</span>
                  <span className="font-medium text-foreground">{review.author}</span>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{review.text}</p>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-4 w-full">
        Показать все отзывы
      </Button>
    </div>
  )
}
