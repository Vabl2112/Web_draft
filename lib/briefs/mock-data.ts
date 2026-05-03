import type { Brief, BriefsUser } from "@/lib/briefs/types"
import { BRIEF_DESCRIPTION_KEY, BRIEF_FILTER_PATH_KEY } from "@/lib/briefs/brief-scope-tree"

export const MOCK_BRIEFS_USERS: BriefsUser[] = [
  {
    id: 1,
    role: "master",
    name: "Анна Мастер",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anna",
  },
  {
    id: 2,
    role: "user",
    name: "Клиент Олег",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=oleg",
  },
  {
    id: 3,
    role: "master",
    name: "Илья Креатор",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ilya",
  },
]

export const INITIAL_MOCK_BRIEFS: Brief[] = [
  {
    id: 101,
    clientId: 2,
    category: "tattoo",
    budgetMin: 15000,
    budgetMax: 35000,
    status: "open",
    dynamicData: {
      [BRIEF_FILTER_PATH_KEY]: {
        areaId: "tattoo",
        areaLabel: "Тату",
        stoppedAtOther: false,
        steps: [
          {
            filterId: "type",
            filterLabel: "Тип услуги",
            valueId: "new-tattoo",
            valueLabel: "Новое тату",
          },
          {
            filterId: "style",
            filterLabel: "Стиль",
            valueId: "realism",
            valueLabel: "Реализм",
          },
        ],
      },
      [BRIEF_DESCRIPTION_KEY]:
        "Нужен мастер на крупный реализм на плече, референсы пришлю в переписке. Волк в тумане, обсудить композицию.",
      deadline: "до августа",
    },
    createdAt: "2026-04-10T10:00:00.000Z",
  },
  {
    id: 102,
    clientId: 2,
    category: "care",
    budgetMin: null,
    budgetMax: 80000,
    status: "open",
    dynamicData: {
      [BRIEF_FILTER_PATH_KEY]: {
        areaId: "care",
        areaLabel: "Уход и косметика",
        stoppedAtOther: true,
        steps: [
          {
            filterId: "product-type",
            filterLabel: "Тип продукта",
            valueId: "other",
            valueLabel: "Другое",
          },
        ],
      },
      [BRIEF_DESCRIPTION_KEY]:
        "Ищем поставку расходников для студии: разные бренды, объём на квартал. Каталог пришлю отдельно.",
      deadline: "2 недели",
    },
    createdAt: "2026-04-12T14:30:00.000Z",
  },
  {
    id: 103,
    clientId: 1,
    category: "piercing",
    budgetMin: 5000,
    budgetMax: null,
    status: "open",
    dynamicData: {
      [BRIEF_FILTER_PATH_KEY]: {
        areaId: "piercing",
        areaLabel: "Пирсинг",
        stoppedAtOther: false,
        steps: [
          {
            filterId: "location",
            filterLabel: "Расположение",
            valueId: "ear",
            valueLabel: "Ухо",
          },
          {
            filterId: "jewelry-type",
            filterLabel: "Тип украшения",
            valueId: "labret",
            valueLabel: "Лабрет",
          },
        ],
      },
      [BRIEF_DESCRIPTION_KEY]: "Первичный прокол, титан, обсудить анатомию.",
      deadline: null,
    },
    createdAt: "2026-04-15T09:00:00.000Z",
  },
  {
    id: 104,
    clientId: 3,
    category: "other",
    budgetMin: 10000,
    budgetMax: 20000,
    status: "open",
    dynamicData: { summary: "Нужна консультация по бренду (старый бриф без дерева фильтров)" },
    createdAt: "2026-04-18T11:00:00.000Z",
  },
  {
    id: 105,
    clientId: 2,
    category: "decor",
    budgetMin: null,
    budgetMax: null,
    status: "in_progress",
    dynamicData: {
      [BRIEF_FILTER_PATH_KEY]: {
        areaId: "decor",
        areaLabel: "Декор и принты",
        stoppedAtOther: false,
        steps: [
          {
            filterId: "print-type",
            filterLabel: "Тип принта",
            valueId: "poster",
            valueLabel: "Постеры",
          },
          {
            filterId: "size",
            filterLabel: "Размер",
            valueId: "medium",
            valueLabel: "Средний (A4-A3)",
          },
        ],
      },
      [BRIEF_DESCRIPTION_KEY]: "Серия постеров для выставки, печать матовая.",
    },
    createdAt: "2026-04-20T16:00:00.000Z",
  },
]
