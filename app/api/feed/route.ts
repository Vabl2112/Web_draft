import { NextResponse } from "next/server"
import { MOCK_ARTICLES } from "@/lib/articles/mock-data"
import type {
  FeedArticleItem,
  FeedMasterCarouselItem,
  FeedPayload,
  FeedPostItem,
  FeedProductCarouselItem,
  FeedTimelineItem,
} from "@/lib/feed-types"

function ownerMeta(article: (typeof MOCK_ARTICLES)[0]) {
  const owner = article.collaborators?.find(
    c => c.role === "owner" && c.participationConfirmed && c.displayName?.trim() && c.avatarUrl,
  )
  return {
    authorName: owner?.displayName?.trim() || "Автор",
    authorAvatar: owner?.avatarUrl?.trim() || null,
  }
}

function priceLabel(n: number) {
  return `${new Intl.NumberFormat("ru-RU").format(n)} ₽`
}

/** Карусель товаров (синхрон с демо `/api/products`, сокращённый список) */
const FEED_PRODUCTS: FeedProductCarouselItem[] = [
  {
    id: "1",
    title: "Заживляющий крем для тату",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    priceLabel: priceLabel(890),
  },
  {
    id: "2",
    title: "Набор для ухода за тату",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    priceLabel: priceLabel(2490),
  },
  {
    id: "3",
    title: "Серьга для пирсинга (титан)",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    priceLabel: priceLabel(1500),
  },
  {
    id: "4",
    title: "Подарочный сертификат 5000 руб.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop",
    priceLabel: priceLabel(5000),
  },
  {
    id: "5",
    title: "Футболка EGG Studio",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    priceLabel: priceLabel(2500),
  },
  {
    id: "6",
    title: "Тату-машинка Dragonhawk",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
    priceLabel: priceLabel(15000),
  },
]

const FEED_MASTERS: FeedMasterCarouselItem[] = [
  {
    id: "1",
    name: "Алексей Смирнов",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    tagline: "Живопись и тату",
  },
  {
    id: "2",
    name: "Мария Иванова",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    tagline: "Иллюстрация",
  },
  {
    id: "3",
    name: "Дмитрий Козлов",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    tagline: "Керамика",
  },
  {
    id: "4",
    name: "Анна Петрова",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    tagline: "Ювелирный дизайн",
  },
  {
    id: "5",
    name: "Игорь Новиков",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    tagline: "Оборудование и мерч",
  },
]

/** 10 демо-записей витрины для ленты (заглушка API; порядок в ленте — по дате вместе со статьями) */
const SHOWCASE_FEED_POSTS: Omit<FeedPostItem, "kind">[] = [
  {
    id: "vit-1",
    masterId: "1",
    masterName: "Алексей Смирнов",
    masterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=720&h=900&fit=crop",
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=720&h=900&fit=crop",
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=720&h=900&fit=crop",
    ],
    caption:
      "За кадром: как собираем референсы. Короткий пост о процессе — свет, тени и пара слов про настроение перед сеансом.",
    publishedAt: "2026-04-29T12:00:00",
  },
  {
    id: "vit-2",
    masterId: "2",
    masterName: "Мария Иванова",
    masterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1475180429745-21de9a24a9fb?w=720&h=900&fit=crop",
      "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=720&h=900&fit=crop",
    ],
    caption: "Выходные 10–11 мая — запись открыта. Пишите в директ, разберём слоты по времени.",
    publishedAt: "2026-04-28T09:30:00",
  },
  {
    id: "vit-3",
    masterId: "1",
    masterName: "Алексей Смирнов",
    masterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=720&h=900&fit=crop",
    ],
    caption: "Свежая работа — процесс в сторис. Листайте фото, там эскиз и финал.",
    publishedAt: "2026-04-27T16:00:00",
  },
  {
    id: "vit-4",
    masterId: "3",
    masterName: "Дмитрий Козлов",
    masterAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=720&h=900&fit=crop",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=720&h=900&fit=crop",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=720&h=900&fit=crop",
    ],
    caption:
      "Обновили политику бронирования: предоплата, переносы и отмена — всё в одном сообщении, чтобы не гадать.",
    publishedAt: "2026-04-26T11:15:00",
  },
  {
    id: "vit-5",
    masterId: "4",
    masterName: "Анна Петрова",
    masterAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=720&h=900&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=720&h=900&fit=crop",
    ],
    caption: "Новая коллекция колец — превью в фото, полный каталог в профиле.",
    publishedAt: "2026-04-25T14:00:00",
  },
  {
    id: "vit-6",
    masterId: "5",
    masterName: "Игорь Новиков",
    masterAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
    images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=720&h=900&fit=crop"],
    caption: "Распаковка роторной машинки — что в комплекте и для каких задач.",
    publishedAt: "2026-04-24T10:20:00",
  },
  {
    id: "vit-7",
    masterId: "2",
    masterName: "Мария Иванова",
    masterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1460661414201-fd25d6766859?w=720&h=900&fit=crop",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=720&h=900&fit=crop",
    ],
    caption: "Эскизы на неделю: три слота на персональные иллюстрации.",
    publishedAt: "2026-04-23T18:45:00",
  },
  {
    id: "vit-8",
    masterId: "1",
    masterName: "Алексей Смирнов",
    masterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=720&h=900&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=720&h=900&fit=crop",
    ],
    caption: "Рабочий стол перед большим проектом — референсы, краски, немного хаоса.",
    publishedAt: "2026-04-22T09:00:00",
  },
  {
    id: "vit-9",
    masterId: "3",
    masterName: "Дмитрий Козлов",
    masterAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
    images: ["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=720&h=900&fit=crop"],
    caption: "Обжиг этой недели — цвет глазури до и после печи.",
    publishedAt: "2026-04-21T15:30:00",
  },
  {
    id: "vit-10",
    masterId: "4",
    masterName: "Анна Петрова",
    masterAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=720&h=900&fit=crop",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=720&h=900&fit=crop",
    ],
    caption: "Золото 585 и родий — сравнение на одном пальце, без фильтров.",
    publishedAt: "2026-04-20T11:00:00",
  },
]

function mergeTimeline(articles: FeedArticleItem[], posts: FeedPostItem[]): FeedTimelineItem[] {
  const items: FeedTimelineItem[] = [...articles, ...posts]
  const ms = (iso: string) => {
    const t = new Date(iso).getTime()
    return Number.isNaN(t) ? 0 : t
  }
  items.sort((a, b) => ms(b.publishedAt) - ms(a.publishedAt))
  return items
}

export async function GET() {
  await new Promise(r => setTimeout(r, 200))

  const articles: FeedArticleItem[] = MOCK_ARTICLES.map(a => {
    const { authorName, authorAvatar } = ownerMeta(a)
    return {
      kind: "article" as const,
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt ?? "",
      coverImage: a.coverImage?.trim() || null,
      publishedAt: a.publishedAt,
      authorName,
      authorAvatar,
    }
  })

  const posts: FeedPostItem[] = SHOWCASE_FEED_POSTS.map(p => ({ kind: "post" as const, ...p }))

  const payload: FeedPayload = {
    products: FEED_PRODUCTS,
    recommendedMasters: FEED_MASTERS,
    timeline: mergeTimeline(articles, posts),
  }

  return NextResponse.json(payload)
}
