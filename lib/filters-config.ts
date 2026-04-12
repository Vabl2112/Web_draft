import { FiltersConfig } from "./types"

// Mock data for Masters filters - will be fetched from DB in production
export const mastersFiltersConfig: FiltersConfig = {
  categories: [
    {
      id: "painting",
      name: "Живопись",
      icon: "palette",
      subFilters: [
        {
          id: "style",
          name: "Стиль",
          type: "multiple",
          options: [
            { id: "realism", name: "Реализм", count: 24 },
            { id: "impressionism", name: "Импрессионизм", count: 18 },
            { id: "abstract", name: "Абстракция", count: 32 },
            { id: "minimalism", name: "Минимализм", count: 15 },
            { id: "surrealism", name: "Сюрреализм", count: 8 },
            { id: "pop-art", name: "Поп-арт", count: 12 },
          ],
        },
        {
          id: "technique",
          name: "Техника",
          type: "multiple",
          options: [
            { id: "oil", name: "Масло", count: 45 },
            { id: "acrylic", name: "Акрил", count: 38 },
            { id: "watercolor", name: "Акварель", count: 29 },
            { id: "gouache", name: "Гуашь", count: 16 },
            { id: "pastel", name: "Пастель", count: 22 },
          ],
        },
        {
          id: "format",
          name: "Формат работ",
          type: "multiple",
          options: [
            { id: "portrait", name: "Портреты", count: 56 },
            { id: "landscape", name: "Пейзажи", count: 43 },
            { id: "still-life", name: "Натюрморты", count: 21 },
            { id: "custom", name: "На заказ", count: 67 },
          ],
        },
      ],
    },
    {
      id: "tattoo",
      name: "Тату",
      icon: "pen-tool",
      subFilters: [
        {
          id: "style",
          name: "Стиль",
          type: "multiple",
          options: [
            { id: "realism", name: "Реализм", count: 34 },
            { id: "traditional", name: "Традишнл", count: 28 },
            { id: "blackwork", name: "Блэкворк", count: 45 },
            { id: "dotwork", name: "Дотворк", count: 19 },
            { id: "watercolor", name: "Акварель", count: 15 },
            { id: "geometric", name: "Геометрия", count: 27 },
            { id: "japanese", name: "Японский", count: 12 },
            { id: "neo-traditional", name: "Нео-традишнл", count: 23 },
            { id: "minimalism", name: "Минимализм", count: 41 },
            { id: "trash-polka", name: "Трэш-полька", count: 8 },
          ],
        },
        {
          id: "body-part",
          name: "Часть тела",
          type: "multiple",
          options: [
            { id: "arm", name: "Рука", count: 89 },
            { id: "leg", name: "Нога", count: 67 },
            { id: "back", name: "Спина", count: 45 },
            { id: "chest", name: "Грудь", count: 34 },
            { id: "neck", name: "Шея", count: 28 },
            { id: "hand", name: "Кисть", count: 56 },
          ],
        },
        {
          id: "size",
          name: "Размер",
          type: "single",
          options: [
            { id: "small", name: "Маленькие (до 5 см)", count: 78 },
            { id: "medium", name: "Средние (5-15 см)", count: 123 },
            { id: "large", name: "Большие (15-30 см)", count: 67 },
            { id: "full-sleeve", name: "Рукав / большие проекты", count: 34 },
          ],
        },
      ],
    },
    {
      id: "sculpture",
      name: "Скульптура",
      icon: "box",
      subFilters: [
        {
          id: "material",
          name: "Материал",
          type: "multiple",
          options: [
            { id: "bronze", name: "Бронза", count: 15 },
            { id: "marble", name: "Мрамор", count: 8 },
            { id: "clay", name: "Глина", count: 23 },
            { id: "wood", name: "Дерево", count: 19 },
            { id: "metal", name: "Металл", count: 12 },
            { id: "plastic", name: "Пластик/3D печать", count: 27 },
          ],
        },
        {
          id: "type",
          name: "Тип",
          type: "multiple",
          options: [
            { id: "figure", name: "Фигуры", count: 34 },
            { id: "bust", name: "Бюсты", count: 18 },
            { id: "relief", name: "Рельефы", count: 12 },
            { id: "installation", name: "Инсталляции", count: 9 },
          ],
        },
      ],
    },
    {
      id: "photography",
      name: "Фотография",
      icon: "camera",
      subFilters: [
        {
          id: "genre",
          name: "Жанр",
          type: "multiple",
          options: [
            { id: "portrait", name: "Портретная", count: 89 },
            { id: "wedding", name: "Свадебная", count: 56 },
            { id: "commercial", name: "Коммерческая", count: 45 },
            { id: "fashion", name: "Fashion", count: 34 },
            { id: "landscape", name: "Пейзажная", count: 28 },
            { id: "reportage", name: "Репортажная", count: 41 },
          ],
        },
        {
          id: "service-type",
          name: "Тип услуги",
          type: "multiple",
          options: [
            { id: "studio", name: "Студийная съёмка", count: 67 },
            { id: "outdoor", name: "Выездная съёмка", count: 78 },
            { id: "retouching", name: "Ретушь", count: 45 },
          ],
        },
      ],
    },
    {
      id: "design",
      name: "Дизайн",
      icon: "pen-tool",
      subFilters: [
        {
          id: "specialization",
          name: "Специализация",
          type: "multiple",
          options: [
            { id: "graphic", name: "Графический дизайн", count: 78 },
            { id: "web", name: "Веб-дизайн", count: 65 },
            { id: "interior", name: "Интерьерный дизайн", count: 43 },
            { id: "industrial", name: "Промышленный дизайн", count: 21 },
            { id: "motion", name: "Моушн-дизайн", count: 34 },
          ],
        },
        {
          id: "software",
          name: "Инструменты",
          type: "multiple",
          options: [
            { id: "figma", name: "Figma", count: 89 },
            { id: "photoshop", name: "Photoshop", count: 95 },
            { id: "illustrator", name: "Illustrator", count: 67 },
            { id: "blender", name: "Blender", count: 34 },
            { id: "after-effects", name: "After Effects", count: 45 },
          ],
        },
      ],
    },
  ],
  commonFilters: [
    {
      id: "experience",
      name: "Опыт работы",
      type: "single",
      options: [
        { id: "any", name: "Любой", count: 500 },
        { id: "1-3", name: "1-3 года", count: 120 },
        { id: "3-5", name: "3-5 лет", count: 180 },
        { id: "5-10", name: "5-10 лет", count: 140 },
        { id: "10+", name: "Более 10 лет", count: 60 },
      ],
    },
    {
      id: "rating",
      name: "Рейтинг",
      type: "single",
      options: [
        { id: "any", name: "Любой", count: 500 },
        { id: "4+", name: "4+ звёзд", count: 350 },
        { id: "4.5+", name: "4.5+ звёзд", count: 180 },
        { id: "5", name: "5 звёзд", count: 45 },
      ],
    },
    {
      id: "availability",
      name: "Доступность",
      type: "checkbox",
      options: [
        { id: "available-now", name: "Свободен сейчас", count: 89 },
        { id: "online-booking", name: "Онлайн-запись", count: 234 },
        { id: "remote-work", name: "Работает удалённо", count: 156 },
      ],
    },
  ],
}

// Mock data for Services filters
export const servicesFiltersConfig: FiltersConfig = {
  categories: [
    {
      id: "tattoo",
      name: "Тату",
      icon: "pen-tool",
      subFilters: [
        {
          id: "type",
          name: "Тип услуги",
          type: "multiple",
          options: [
            { id: "new-tattoo", name: "Новое тату", count: 156 },
            { id: "cover-up", name: "Перекрытие", count: 67 },
            { id: "correction", name: "Коррекция", count: 45 },
            { id: "consultation", name: "Консультация", count: 89 },
          ],
        },
        {
          id: "style",
          name: "Стиль",
          type: "multiple",
          options: [
            { id: "realism", name: "Реализм", count: 34 },
            { id: "traditional", name: "Традишнл", count: 28 },
            { id: "blackwork", name: "Блэкворк", count: 45 },
            { id: "minimalism", name: "Минимализм", count: 41 },
          ],
        },
      ],
    },
    {
      id: "piercing",
      name: "Пирсинг",
      icon: "circle-dot",
      subFilters: [
        {
          id: "location",
          name: "Расположение",
          type: "multiple",
          options: [
            { id: "ear", name: "Ухо", count: 78 },
            { id: "nose", name: "Нос", count: 56 },
            { id: "lip", name: "Губа", count: 45 },
            { id: "navel", name: "Пупок", count: 34 },
            { id: "eyebrow", name: "Бровь", count: 28 },
          ],
        },
        {
          id: "jewelry-type",
          name: "Тип украшения",
          type: "multiple",
          options: [
            { id: "ring", name: "Кольцо", count: 89 },
            { id: "barbell", name: "Штанга", count: 67 },
            { id: "labret", name: "Лабрет", count: 45 },
            { id: "stud", name: "Гвоздик", count: 78 },
          ],
        },
      ],
    },
    {
      id: "permanent",
      name: "Перманент",
      icon: "eye",
      subFilters: [
        {
          id: "area",
          name: "Зона",
          type: "multiple",
          options: [
            { id: "eyebrows", name: "Брови", count: 89 },
            { id: "lips", name: "Губы", count: 67 },
            { id: "eyeliner", name: "Стрелки", count: 56 },
            { id: "areola", name: "Ареола", count: 12 },
          ],
        },
        {
          id: "technique",
          name: "Техника",
          type: "multiple",
          options: [
            { id: "microblading", name: "Микроблейдинг", count: 78 },
            { id: "powder", name: "Пудровое напыление", count: 65 },
            { id: "aquarelle", name: "Акварельная техника", count: 34 },
            { id: "hair-stroke", name: "Волосковая техника", count: 56 },
          ],
        },
      ],
    },
    {
      id: "art-services",
      name: "Художественные услуги",
      icon: "palette",
      subFilters: [
        {
          id: "service-type",
          name: "Тип услуги",
          type: "multiple",
          options: [
            { id: "portrait-order", name: "Портрет на заказ", count: 45 },
            { id: "wall-painting", name: "Роспись стен", count: 23 },
            { id: "illustration", name: "Иллюстрация", count: 67 },
            { id: "logo-design", name: "Дизайн логотипа", count: 89 },
            { id: "sketch", name: "Эскиз", count: 112 },
          ],
        },
        {
          id: "format",
          name: "Формат",
          type: "single",
          options: [
            { id: "digital", name: "Цифровой", count: 156 },
            { id: "physical", name: "Физический", count: 89 },
            { id: "both", name: "Оба варианта", count: 67 },
          ],
        },
      ],
    },
  ],
  commonFilters: [
    {
      id: "price-range",
      name: "Цена",
      type: "single",
      options: [
        { id: "any", name: "Любая", count: 500 },
        { id: "0-3000", name: "До 3 000 ₽", count: 120 },
        { id: "3000-10000", name: "3 000 - 10 000 ₽", count: 180 },
        { id: "10000-30000", name: "10 000 - 30 000 ₽", count: 140 },
        { id: "30000+", name: "От 30 000 ₽", count: 60 },
      ],
    },
    {
      id: "duration",
      name: "Длительность",
      type: "single",
      options: [
        { id: "any", name: "Любая", count: 500 },
        { id: "0-1", name: "До 1 часа", count: 89 },
        { id: "1-3", name: "1-3 часа", count: 234 },
        { id: "3-6", name: "3-6 часов", count: 156 },
        { id: "6+", name: "Более 6 часов", count: 21 },
      ],
    },
  ],
}

// Mock data for Products filters
export const productsFiltersConfig: FiltersConfig = {
  categories: [
    {
      id: "tattoo-care",
      name: "Уход за тату",
      icon: "droplet",
      subFilters: [
        {
          id: "product-type",
          name: "Тип продукта",
          type: "multiple",
          options: [
            { id: "cream", name: "Крем", count: 45 },
            { id: "gel", name: "Гель", count: 34 },
            { id: "oil", name: "Масло", count: 23 },
            { id: "spray", name: "Спрей", count: 18 },
            { id: "film", name: "Плёнка", count: 28 },
          ],
        },
        {
          id: "stage",
          name: "Этап ухода",
          type: "multiple",
          options: [
            { id: "healing", name: "Заживление", count: 67 },
            { id: "moisturizing", name: "Увлажнение", count: 89 },
            { id: "protection", name: "Защита от солнца", count: 34 },
            { id: "restoration", name: "Восстановление", count: 45 },
          ],
        },
      ],
    },
    {
      id: "art-supplies",
      name: "Художественные материалы",
      icon: "palette",
      subFilters: [
        {
          id: "material-type",
          name: "Тип материала",
          type: "multiple",
          options: [
            { id: "paints", name: "Краски", count: 156 },
            { id: "brushes", name: "Кисти", count: 89 },
            { id: "canvas", name: "Холсты", count: 67 },
            { id: "paper", name: "Бумага", count: 78 },
            { id: "pencils", name: "Карандаши", count: 112 },
            { id: "markers", name: "Маркеры", count: 95 },
          ],
        },
        {
          id: "paint-type",
          name: "Тип краски",
          type: "multiple",
          options: [
            { id: "oil", name: "Масляные", count: 45 },
            { id: "acrylic", name: "Акриловые", count: 67 },
            { id: "watercolor", name: "Акварельные", count: 56 },
            { id: "gouache", name: "Гуашь", count: 34 },
          ],
        },
        {
          id: "brand",
          name: "Бренд",
          type: "multiple",
          options: [
            { id: "winsor-newton", name: "Winsor & Newton", count: 78 },
            { id: "faber-castell", name: "Faber-Castell", count: 65 },
            { id: "copic", name: "Copic", count: 89 },
            { id: "royal-talens", name: "Royal Talens", count: 45 },
            { id: "schmincke", name: "Schmincke", count: 34 },
          ],
        },
      ],
    },
    {
      id: "equipment",
      name: "Оборудование",
      icon: "settings",
      subFilters: [
        {
          id: "equipment-type",
          name: "Тип оборудования",
          type: "multiple",
          options: [
            { id: "tattoo-machine", name: "Тату-машинки", count: 56 },
            { id: "needles", name: "Иглы", count: 89 },
            { id: "power-supply", name: "Блоки питания", count: 34 },
            { id: "furniture", name: "Мебель", count: 23 },
            { id: "lighting", name: "Освещение", count: 45 },
          ],
        },
        {
          id: "brand",
          name: "Бренд",
          type: "multiple",
          options: [
            { id: "cheyenne", name: "Cheyenne", count: 34 },
            { id: "fk-irons", name: "FK Irons", count: 28 },
            { id: "dragonhawk", name: "Dragonhawk", count: 45 },
            { id: "bishop", name: "Bishop", count: 23 },
          ],
        },
      ],
    },
    {
      id: "jewelry",
      name: "Украшения",
      icon: "gem",
      subFilters: [
        {
          id: "jewelry-type",
          name: "Тип украшения",
          type: "multiple",
          options: [
            { id: "rings", name: "Кольца", count: 78 },
            { id: "barbells", name: "Штанги", count: 56 },
            { id: "labrets", name: "Лабреты", count: 45 },
            { id: "plugs", name: "Плаги", count: 34 },
            { id: "chains", name: "Цепочки", count: 67 },
          ],
        },
        {
          id: "material",
          name: "Материал",
          type: "multiple",
          options: [
            { id: "titanium", name: "Титан", count: 89 },
            { id: "surgical-steel", name: "Хирургическая сталь", count: 112 },
            { id: "gold", name: "Золото", count: 45 },
            { id: "silver", name: "Серебро", count: 67 },
            { id: "niobium", name: "Ниобий", count: 23 },
          ],
        },
      ],
    },
    {
      id: "prints",
      name: "Принты и постеры",
      icon: "image",
      subFilters: [
        {
          id: "print-type",
          name: "Тип принта",
          type: "multiple",
          options: [
            { id: "poster", name: "Постеры", count: 89 },
            { id: "canvas-print", name: "Печать на холсте", count: 56 },
            { id: "art-print", name: "Арт-принты", count: 78 },
            { id: "stickers", name: "Стикеры", count: 123 },
          ],
        },
        {
          id: "size",
          name: "Размер",
          type: "single",
          options: [
            { id: "small", name: "Маленький (до A4)", count: 156 },
            { id: "medium", name: "Средний (A4-A3)", count: 89 },
            { id: "large", name: "Большой (A3-A2)", count: 45 },
            { id: "xl", name: "Очень большой (A2+)", count: 23 },
          ],
        },
      ],
    },
  ],
  commonFilters: [
    {
      id: "price-range",
      name: "Цена",
      type: "single",
      options: [
        { id: "any", name: "Любая", count: 500 },
        { id: "0-1000", name: "До 1 000 ₽", count: 120 },
        { id: "1000-5000", name: "1 000 - 5 000 ₽", count: 180 },
        { id: "5000-15000", name: "5 000 - 15 000 ₽", count: 140 },
        { id: "15000+", name: "От 15 000 ₽", count: 60 },
      ],
    },
    {
      id: "availability",
      name: "Наличие",
      type: "checkbox",
      options: [
        { id: "in-stock", name: "В наличии", count: 345 },
        { id: "on-order", name: "Под заказ", count: 155 },
      ],
    },
    {
      id: "seller-rating",
      name: "Рейтинг продавца",
      type: "single",
      options: [
        { id: "any", name: "Любой", count: 500 },
        { id: "4+", name: "4+ звёзд", count: 350 },
        { id: "4.5+", name: "4.5+ звёзд", count: 180 },
      ],
    },
  ],
}

// API simulation function - will be replaced with actual API call
export async function fetchFiltersConfig(type: "masters" | "services" | "products"): Promise<FiltersConfig> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  switch (type) {
    case "masters":
      return mastersFiltersConfig
    case "services":
      return servicesFiltersConfig
    case "products":
      return productsFiltersConfig
    default:
      return { categories: [] }
  }
}
