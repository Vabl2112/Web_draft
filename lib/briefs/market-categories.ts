/**
 * Категории витрины «Товары и услуги» + устаревшие id брифов для фильтра ленты.
 * Синхронизировано с app/api/products и app/api/services (без «all»).
 */

export const BRIEF_CATEGORY_LABELS: Record<string, string> = {
  tattoo: "Татуировка",
  piercing: "Пирсинг",
  permanent: "Перманент",
  removal: "Удаление",
  consultation: "Консультация",
  care: "Уход",
  equipment: "Оборудование",
  jewelry: "Украшения",
  merch: "Мерч",
  decor: "Декор и принты",
  gift: "Подарки",
  design: "Дизайн",
  other: "Другое",
}

export const BRIEF_FEED_CATEGORY_OPTIONS: { id: string; label: string }[] = [
  { id: "tattoo", label: BRIEF_CATEGORY_LABELS.tattoo },
  { id: "piercing", label: BRIEF_CATEGORY_LABELS.piercing },
  { id: "permanent", label: BRIEF_CATEGORY_LABELS.permanent },
  { id: "removal", label: BRIEF_CATEGORY_LABELS.removal },
  { id: "consultation", label: BRIEF_CATEGORY_LABELS.consultation },
  { id: "care", label: BRIEF_CATEGORY_LABELS.care },
  { id: "equipment", label: BRIEF_CATEGORY_LABELS.equipment },
  { id: "jewelry", label: BRIEF_CATEGORY_LABELS.jewelry },
  { id: "decor", label: BRIEF_CATEGORY_LABELS.decor },
  { id: "merch", label: BRIEF_CATEGORY_LABELS.merch },
  { id: "gift", label: BRIEF_CATEGORY_LABELS.gift },
  { id: "design", label: BRIEF_CATEGORY_LABELS.design },
  { id: "other", label: BRIEF_CATEGORY_LABELS.other },
]
