/** Ответ API `/api/feed` для главной ленты (авторизованные). */

export interface FeedProductCarouselItem {
  id: string
  title: string
  image: string
  priceLabel: string
}

export interface FeedMasterCarouselItem {
  id: string
  name: string
  avatar: string
  /** Короткая подпись под именем */
  tagline: string
}

export interface FeedArticleItem {
  kind: "article"
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  publishedAt: string
  authorName: string
  authorAvatar: string | null
}

export interface FeedPostItem {
  kind: "post"
  id: string
  masterId: string
  masterName: string
  masterAvatar: string
  images: string[]
  /** Заголовок + описание для подписи */
  caption: string
  publishedAt: string
}

export type FeedTimelineItem = FeedArticleItem | FeedPostItem

export interface FeedPayload {
  /** Горизонтальная карусель товаров */
  products: FeedProductCarouselItem[]
  /** Рекомендованные мастера */
  recommendedMasters: FeedMasterCarouselItem[]
  timeline: FeedTimelineItem[]
}
