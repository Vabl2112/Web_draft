import type { DenormalizedArticle } from "./schema"

const AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"
const AVATAR2 =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face"

const COVER_HUB =
  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=1200&h=500&fit=crop"
const COVER_ROLES =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=500&fit=crop"
const COVER_PLATFORM =
  "https://images.unsplash.com/photo-1524995997946-a1c029e1a822?w=1200&h=500&fit=crop"

/**
 * Демо-статьи (денормализованный ответ «как с бэка»).
 * В collaborators намеренно есть битые узлы — UI их не показывает.
 */
export const MOCK_ARTICLES: DenormalizedArticle[] = [
  {
    id: "art-1",
    slug: "tattoo-hub-session-and-care",
    title: "Сеанс и уход: смысловой хаб для клиента",
    coverImage: COVER_HUB,
    coverImageAlt: "Рабочее место мастера, процесс нанесения тату",
    excerpt:
      "Текст, калькулятор, услуга и товар в одном материале — без лишних запросов с клиента.",
    publishedAt: "2026-04-12",
    linkedMasterIds: ["1"],
    collaborators: [
      {
        id: "u1",
        role: "owner",
        displayName: "Алексей Смирнов",
        avatarUrl: AVATAR,
        participationConfirmed: true,
      },
      {
        id: "u2",
        role: "editor",
        displayName: "Мария К.",
        avatarUrl: AVATAR2,
        participationConfirmed: true,
      },
      // не подтвердил — не рендерим
      {
        id: "u-x",
        role: "editor",
        displayName: "Призрак",
        avatarUrl: AVATAR,
        participationConfirmed: false,
      },
      // null-поля — не рендерим
      {
        id: "",
        role: "commenter",
        displayName: "  ",
        avatarUrl: null,
        participationConfirmed: true,
      },
    ],
    blocks: [
      {
        type: "paragraph",
        id: "p1",
        text:
          "Статья на платформе — не монолитный текст. Ниже встроены виджеты: оценка через калькулятор мастера, карточка услуги и товара. Данные приходят уже денормализованными, интерфейс не ждёт цепочки запросов.",
      },
      { type: "heading", id: "h1", level: 2, text: "Оценить бюджет" },
      {
        type: "calculator_widget",
        id: "calc1",
        artistId: "1",
        title: "Калькулятор услуг",
        hint: "Параметры и формула мастера — на отдельной странице профиля.",
      },
      { type: "heading", id: "h2", level: 3, text: "Услуга из портфолио" },
      {
        type: "service_embed",
        id: "svc1",
        service: {
          id: "2",
          title: "Сеанс тату (3 часа)",
          description: "Стерильные материалы и комфортная атмосфера",
          priceLabel: "15 000 ₽",
          image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop",
          masterId: "1",
          masterName: "Алексей Смирнов",
        },
      },
      {
        type: "service_embed",
        id: "svc-null",
        service: null,
      },
      { type: "heading", id: "h3", level: 3, text: "Товар мастера" },
      {
        type: "product_embed",
        id: "prd1",
        product: {
          id: "1",
          title: "Картина на холсте",
          priceLabel: "15 000 ₽",
          image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
          sellerId: "1",
          sellerName: "Алексей Смирнов",
        },
      },
      { type: "heading", id: "h4", level: 3, text: "Видео (VK)" },
      {
        type: "paragraph",
        id: "p2",
        text:
          "Тяжёлые ролики не хостим у себя — только встраивание через VK. Ниже плеер в 16:9, без рамки у iframe и с низким z-index, чтобы не перекрывать меню сайта.",
      },
      {
        type: "vk_video",
        id: "vk1",
        title: "Демо-встраивание VK",
        // Публичный ролик VK (формат video_ext); hash при необходимости подставляет бэкенд
        embedUrl:
          "https://vk.com/video_ext.php?oid=-22822305&id=456239017&hd=2&autoplay=0",
      },
    ],
  },
  {
    id: "art-2",
    slug: "co-authors-and-roles",
    title: "Соавторство и роли в материалах",
    coverImage: COVER_ROLES,
    excerpt: "Короткая заметка про owner, editor и commenter — только с подтверждённым участием.",
    publishedAt: "2026-04-01",
    linkedMasterIds: ["1"],
    collaborators: [
      {
        id: "u1",
        role: "owner",
        displayName: "Алексей Смирнов",
        avatarUrl: AVATAR,
        participationConfirmed: true,
      },
      {
        id: "u-gone",
        role: "editor",
        displayName: "Удалённый автор",
        avatarUrl: AVATAR2,
        participationConfirmed: false,
      },
    ],
    blocks: [
      {
        type: "paragraph",
        id: "a1",
        text:
          "В списке соавторов выше не должно быть «дыр» и заглушек: неподтверждённые приглашения и пустые записи отфильтровываются на уровне данных перед рендером.",
      },
      {
        type: "paragraph",
        id: "a2",
        text: "Когда появится API, эту же структуру можно отдавать одним JSON с сервера — фронт только рисует блоки.",
      },
    ],
  },
  {
    id: "art-global",
    slug: "platform-articles-overview",
    title: "Раздел «Статьи» на EGG",
    coverImage: COVER_PLATFORM,
    excerpt: "Общий материал платформы без привязки к конкретной странице мастера.",
    publishedAt: "2026-03-15",
    linkedMasterIds: [],
    collaborators: [
      {
        id: "editor-egg",
        role: "owner",
        displayName: "Редакция EGG",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
        participationConfirmed: true,
      },
    ],
    blocks: [
      {
        type: "paragraph",
        id: "g1",
        text:
          "Здесь собираются материалы как хабы: текст, услуги, товары и внешние медиа. На странице мастера во вкладке «Статьи» показываются только статьи с привязкой к этому автору.",
      },
    ],
  },
]

export function getArticleBySlug(slug: string): DenormalizedArticle | undefined {
  return MOCK_ARTICLES.find(a => a.slug === slug)
}

export function getArticlesForMaster(masterId: string): DenormalizedArticle[] {
  return MOCK_ARTICLES.filter(
    a => a.linkedMasterIds?.length && a.linkedMasterIds.includes(masterId),
  )
}

export function getAllArticleSlugs(): string[] {
  return MOCK_ARTICLES.map(a => a.slug)
}
