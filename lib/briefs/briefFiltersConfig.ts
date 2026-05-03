/**
 * Конфиг динамических фильтров ленты брифов (Master View).
 * Универсальные поля (бюджет от/до, порядок) задаются в UI отдельно.
 * Здесь только селекты, зависящие от выбранной категории (чипса).
 */

export interface BriefDynamicFilterOption {
  valueId: string
  label: string
}

export interface BriefDynamicFilterDef {
  filterId: string
  label: string
  options: BriefDynamicFilterOption[]
}

/** Ключ — id категории брифа (как в `Brief.category`). Для «Все» селекты не показываются. */
export const BRIEF_DYNAMIC_FILTERS_BY_CATEGORY: Partial<Record<string, BriefDynamicFilterDef[]>> = {
  tattoo: [
    {
      filterId: "type",
      label: "Тип услуги",
      options: [
        { valueId: "new-tattoo", label: "Новое тату" },
        { valueId: "cover-up", label: "Кавер" },
        { valueId: "touch-up", label: "Коррекция" },
        { valueId: "session", label: "Сеанс" },
      ],
    },
    {
      filterId: "style",
      label: "Стиль",
      options: [
        { valueId: "realism", label: "Реализм" },
        { valueId: "old-school", label: "Old school" },
        { valueId: "minimal", label: "Минимализм" },
        { valueId: "watercolor", label: "Акварель" },
        { valueId: "geometry", label: "Геометрия" },
      ],
    },
  ],
  piercing: [
    {
      filterId: "location",
      label: "Расположение",
      options: [
        { valueId: "ear", label: "Ухо" },
        { valueId: "nose", label: "Нос" },
        { valueId: "lip", label: "Губа" },
        { valueId: "tongue", label: "Язык" },
        { valueId: "navel", label: "Пупок" },
      ],
    },
    {
      filterId: "jewelry-type",
      label: "Тип украшения",
      options: [
        { valueId: "labret", label: "Лабрет" },
        { valueId: "ring", label: "Кольцо" },
        { valueId: "barbell", label: "Штанга" },
        { valueId: "stud", label: "Пусет" },
      ],
    },
  ],
  care: [
    {
      filterId: "product-type",
      label: "Тип продукта",
      options: [
        { valueId: "consumables", label: "Расходники" },
        { valueId: "cosmetics", label: "Косметика" },
        { valueId: "aftercare", label: "Уход после процедуры" },
        { valueId: "other", label: "Другое" },
      ],
    },
  ],
  decor: [
    {
      filterId: "print-type",
      label: "Тип принта",
      options: [
        { valueId: "poster", label: "Постеры" },
        { valueId: "canvas", label: "Холст" },
        { valueId: "sticker", label: "Стикеры" },
      ],
    },
    {
      filterId: "size",
      label: "Размер",
      options: [
        { valueId: "small", label: "Малый (до A5)" },
        { valueId: "medium", label: "Средний (A4–A3)" },
        { valueId: "large", label: "Крупный" },
      ],
    },
  ],
  design: [
    {
      filterId: "design-type",
      label: "Тип задачи",
      options: [
        { valueId: "logo", label: "Логотип" },
        { valueId: "identity", label: "Айдентика" },
        { valueId: "layout", label: "Верстка / макет" },
      ],
    },
  ],
  permanent: [
    {
      filterId: "zone",
      label: "Зона",
      options: [
        { valueId: "brows", label: "Брови" },
        { valueId: "lips", label: "Губы" },
        { valueId: "eyeliner", label: "Межресничка" },
      ],
    },
  ],
  removal: [
    {
      filterId: "removal-type",
      label: "Тип удаления",
      options: [
        { valueId: "laser", label: "Лазер" },
        { valueId: "saline", label: "Солевой раствор" },
      ],
    },
  ],
  consultation: [
    {
      filterId: "format",
      label: "Формат",
      options: [
        { valueId: "online", label: "Онлайн" },
        { valueId: "offline", label: "В студии" },
      ],
    },
  ],
  equipment: [
    {
      filterId: "equipment-kind",
      label: "Категория",
      options: [
        { valueId: "machine", label: "Машинки и блоки" },
        { valueId: "furniture", label: "Мебель" },
      ],
    },
  ],
  jewelry: [
    {
      filterId: "material",
      label: "Материал",
      options: [
        { valueId: "titanium", label: "Титан" },
        { valueId: "gold", label: "Золото" },
        { valueId: "steel", label: "Сталь" },
      ],
    },
  ],
  merch: [
    {
      filterId: "merch-type",
      label: "Тип мерча",
      options: [
        { valueId: "apparel", label: "Одежда" },
        { valueId: "accessory", label: "Аксессуары" },
      ],
    },
  ],
  gift: [
    {
      filterId: "gift-format",
      label: "Формат",
      options: [
        { valueId: "certificate", label: "Сертификат" },
        { valueId: "box", label: "Набор" },
      ],
    },
  ],
}

export function getBriefDynamicFilterDefs(category: string | "all"): BriefDynamicFilterDef[] {
  if (category === "all") return []
  return BRIEF_DYNAMIC_FILTERS_BY_CATEGORY[category] ?? []
}

/** Активные пары filterId/valueId для пайплайна (без «Любой»). */
export function buildActivePathStepFilters(
  defs: BriefDynamicFilterDef[],
  values: Record<string, string | undefined>,
): { filterId: string; valueId: string }[] {
  const out: { filterId: string; valueId: string }[] = []
  for (const d of defs) {
    const v = values[d.filterId]
    if (v && v !== "all") out.push({ filterId: d.filterId, valueId: v })
  }
  return out
}
