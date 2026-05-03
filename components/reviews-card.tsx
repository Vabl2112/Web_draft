import { ReviewsList } from "@/components/reviews-list"
import { filterValidReviews } from "@/lib/reviews/filter-valid-reviews"

interface ReviewsCardProps {
  /** Сырые отзывы; в интерфейс попадают только валидные */
  reviews: unknown[] | null | undefined
}

/** Карточка списка отзывов (вне профиля мастера, если понадобится) */
export function ReviewsCard({ reviews }: ReviewsCardProps) {
  const valid = filterValidReviews(reviews)

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Отзывы</h2>
      {valid.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Пока нет отзывов к услугам и товарам
        </p>
      ) : (
        <ReviewsList reviews={valid} />
      )}
    </div>
  )
}
