/**
 * Схема статей: денормализованные блоки и соавторы для быстрого рендера на клиенте.
 */

export type ArticleCollaboratorRole = "owner" | "editor" | "commenter"

/** Сырой узел соавтора с бэка — может быть неполным или отозванным */
export interface ArticleCollaboratorInput {
  id?: string | null
  role?: ArticleCollaboratorRole | null
  displayName?: string | null
  avatarUrl?: string | null
  /** Участие подтверждено; без true узел игнорируется */
  participationConfirmed?: boolean | null
}

/** Только полностью валидные соавторы попадают в UI */
export interface ArticleCollaborator {
  id: string
  role: ArticleCollaboratorRole
  displayName: string
  avatarUrl: string
  participationConfirmed: true
}

/** Денормализованные данные для мини-карточки услуги в теле статьи */
export interface ArticleServiceEmbedData {
  id: string
  title: string
  description: string
  priceLabel: string
  image?: string | null
  masterId: string
  masterName: string
}

/** Денормализованные данные для мини-карточки товара */
export interface ArticleProductEmbedData {
  id: string
  title: string
  priceLabel: string
  image?: string | null
  sellerId: string
  sellerName: string
}

export type ArticleBodyBlock =
  | {
      type: "paragraph"
      id: string
      /** HTML из доверенного CMS; иначе используйте text */
      html?: string
      text?: string
    }
  | {
      type: "heading"
      id: string
      level: 2 | 3 | 4
      text: string
    }
  | {
      type: "calculator_widget"
      id: string
      /** Мастер, чей калькулятор открываем */
      artistId: string
      /** Денорм: подпись виджета без запроса */
      title?: string
      /** Денорм: короткий текст под кнопкой */
      hint?: string
    }
  | {
      type: "service_embed"
      id: string
      /** Если null/undefined — блок не рендерится */
      service: ArticleServiceEmbedData | null | undefined
    }
  | {
      type: "product_embed"
      id: string
      product: ArticleProductEmbedData | null | undefined
    }
  | {
      type: "vk_video"
      id: string
      /** Готовый URL для video_ext.php (рекомендуется отдавать с бэка целиком) */
      embedUrl: string
      title?: string
    }

/** Готовая к отдаче на фронт статья (денормализация, без N+1) */
export interface DenormalizedArticle {
  id: string
  slug: string
  title: string
  /** Главная картинка: превью в списках и hero на странице статьи */
  coverImage?: string | null
  /** Подпись к cover для alt (если не задана — используется title) */
  coverImageAlt?: string | null
  /** Краткий лид (опционально) */
  excerpt?: string
  publishedAt?: string
  /** Уже отфильтрованные соавторы или сырые — см. filterValidCollaborators */
  collaborators: ArticleCollaboratorInput[] | ArticleCollaborator[]
  blocks: ArticleBodyBlock[]
  /**
   * ID мастеров, на чьих страницах показывать статью во вкладке «Статьи».
   * Пусто — только в общем разделе /articles.
   */
  linkedMasterIds?: string[]
}
