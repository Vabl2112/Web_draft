import { NextResponse } from "next/server"

// Shared product data - in real app this would come from database
const products = [
  {
    id: "1",
    title: "Заживляющий крем для тату",
    description: "Профессиональный крем для ухода за свежей татуировкой. Ускоряет заживление, сохраняет яркость цвета.",
    fullDescription: `Профессиональный заживляющий крем, разработанный специально для ухода за свежими татуировками.

Состав:
• Пантенол (D-пантенол) - ускоряет регенерацию кожи
• Аллантоин - смягчает и успокаивает
• Витамин Е - антиоксидантная защита
• Масло ши - глубокое увлажнение

Применение:
Наносить тонким слоем 3-4 раза в день в течение первых 2 недель заживления. Перед нанесением тщательно вымыть руки.

Объем: 50 мл`,
    price: 890,
    originalPrice: 1200,
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=800&h=800&fit=crop"
    ],
    category: "Уход",
    inStock: true,
    stockCount: 45,
    rating: 4.8,
    reviewsCount: 156,
    ordersCount: 523,
    sku: "CRM-TAT-001",
    seller: {
      id: "1",
      name: "Алексей Смирнов",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      title: "Тату-мастер",
      rating: 4.9,
      productsCount: 12
    },
    sizes: null,
    colors: null,
    specifications: [
      { label: "Объем", value: "50 мл" },
      { label: "Состав", value: "Пантенол, аллантоин, витамин Е, масло ши" },
      { label: "Страна производства", value: "Россия" },
      { label: "Срок годности", value: "24 месяца" }
    ],
    reviews: [
      {
        id: "1",
        author: "Мария К.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "3 дня назад",
        text: "Отличный крем! Тату зажила быстро и без проблем. Рекомендую всем.",
        helpful: 18,
        targetType: "product",
        targetId: "1",
        targetTitle: "Заживляющий крем для тату",
      },
      {
        id: "2",
        author: "Дмитрий С.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "1 неделю назад",
        text: "Пользуюсь этим кремом уже не первый раз. Качество на высоте!",
        helpful: 12,
        targetType: "product",
        targetId: "1",
        targetTitle: "Заживляющий крем для тату",
      }
    ]
  },
  {
    id: "2",
    title: "Набор для ухода за тату",
    description: "Полный комплект: заживляющий крем, мыло, увлажняющий лосьон. Всё для идеального заживления.",
    fullDescription: `Комплексный набор для ухода за татуировкой на всех этапах заживления.

В набор входит:
• Заживляющий крем (50 мл) - для первых дней
• Антибактериальное мыло (100 мл) - для бережного очищения
• Увлажняющий лосьон (100 мл) - для поддержания кожи

Преимущества набора:
• Все средства работают в комплексе
• Экономия по сравнению с покупкой по отдельности
• Удобная косметичка для хранения

Подходит для всех типов кожи.`,
    price: 2490,
    originalPrice: null,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop"
    ],
    category: "Уход",
    inStock: true,
    stockCount: 23,
    rating: 4.9,
    reviewsCount: 89,
    ordersCount: 234,
    sku: "SET-TAT-002",
    seller: {
      id: "2",
      name: "Мария Волкова",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      title: "Тату-мастер",
      rating: 4.8,
      productsCount: 8
    },
    sizes: null,
    colors: null,
    specifications: [
      { label: "Комплектация", value: "Крем 50мл, мыло 100мл, лосьон 100мл" },
      { label: "Упаковка", value: "Подарочная коробка" },
      { label: "Страна производства", value: "Россия" }
    ],
    reviews: [
      {
        id: "1",
        author: "Анна П.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "5 дней назад",
        text: "Идеальный набор! Все что нужно для ухода в одной коробке.",
        helpful: 8,
        targetType: "product",
        targetId: "2",
        targetTitle: "Набор для ухода за тату",
      }
    ]
  },
  {
    id: "3",
    title: "Серьга для пирсинга (титан)",
    description: "Гипоаллергенная серьга из титана. Подходит для первичного заживления.",
    fullDescription: `Высококачественная серьга из имплантационного титана ASTM F136.

Характеристики:
• Материал: Титан Grade 23 (ASTM F136)
• Толщина штанги: 1.2 мм (16G)
• Длина штанги: 6-10 мм (на выбор)
• Диаметр шарика: 3 мм

Преимущества:
• Полностью гипоаллергенный
• Подходит для первичного прокола
• Не вызывает раздражения
• Легкий и комфортный

Рекомендован профессиональными пирсерами.`,
    price: 1500,
    originalPrice: null,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop"
    ],
    category: "Украшения",
    inStock: true,
    stockCount: 67,
    rating: 4.7,
    reviewsCount: 45,
    ordersCount: 189,
    sku: "JWL-TIT-003",
    seller: {
      id: "3",
      name: "Дмитрий Козлов",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      title: "Пирсинг-мастер",
      rating: 4.9,
      productsCount: 34
    },
    sizes: ["6 мм", "8 мм", "10 мм"],
    colors: [
      { name: "Серебристый", value: "#C0C0C0" },
      { name: "Золотой", value: "#FFD700" },
      { name: "Розовое золото", value: "#B76E79" }
    ],
    specifications: [
      { label: "Материал", value: "Титан ASTM F136" },
      { label: "Толщина", value: "1.2 мм (16G)" },
      { label: "Применение", value: "Мочка, хеликс, трагус" }
    ],
    reviews: [
      {
        id: "1",
        author: "Елена В.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "2 дня назад",
        text: "Качественное украшение, никакого раздражения. Рекомендую!",
        helpful: 6,
        targetType: "product",
        targetId: "3",
        targetTitle: "Серьга для пирсинга (титан)",
      }
    ]
  },
  {
    id: "5",
    title: "Футболка EGG Studio",
    description: "Эксклюзивный мерч студии. 100% хлопок, принт высокого качества.",
    fullDescription: `Эксклюзивная футболка с авторским принтом от тату-студии EGG.

Особенности:
• 100% хлопок высшего качества
• Плотность ткани: 180 г/м²
• Современный прямой крой
• Двойная отстрочка на швах
• Усиленный воротник

Уход:
• Машинная стирка при 30°C
• Не отбеливать
• Гладить при средней температуре
• Не сушить в барабане

Принт выполнен методом прямой печати, устойчив к многочисленным стиркам.`,
    price: 2500,
    originalPrice: 3000,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop"
    ],
    category: "Мерч",
    inStock: false,
    stockCount: 0,
    rating: 4.6,
    reviewsCount: 28,
    ordersCount: 156,
    sku: "TSH-EGG-005",
    seller: {
      id: "5",
      name: "Игорь Новиков",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      title: "Тату-мастер",
      rating: 4.7,
      productsCount: 15
    },
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Черный", value: "#000000" },
      { name: "Белый", value: "#FFFFFF" },
      { name: "Серый", value: "#6B7280" }
    ],
    specifications: [
      { label: "Материал", value: "100% хлопок" },
      { label: "Плотность", value: "180 г/м²" },
      { label: "Страна производства", value: "Россия" },
      { label: "Тип принта", value: "Прямая печать" }
    ],
    reviews: [
      {
        id: "1",
        author: "Павел М.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "1 неделю назад",
        text: "Отличная футболка! Качество супер, принт яркий.",
        helpful: 10,
        targetType: "product",
        targetId: "5",
        targetTitle: "Футболка EGG Studio",
      }
    ]
  },
  {
    id: "6",
    title: "Тату-машинка Dragonhawk",
    description: "Профессиональная роторная машинка. Подходит для контура и закраса.",
    fullDescription: `Профессиональная роторная тату-машинка Dragonhawk Mast Pen.

Технические характеристики:
• Тип: роторная (pen)
• Мотор: японский DC мотор
• Ход иглы: 3.5 мм (регулируемый)
• Вес: 150 г
• Напряжение: 7-10V
• Совместимость: стандартные картриджи

Особенности:
• Тихая работа
• Минимальная вибрация
• Эргономичный дизайн
• Алюминиевый корпус

В комплекте: машинка, кабель RCA, запасной grip.`,
    price: 15000,
    originalPrice: 18000,
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=800&h=800&fit=crop"
    ],
    category: "Оборудование",
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewsCount: 67,
    ordersCount: 89,
    sku: "EQP-DRG-006",
    seller: {
      id: "5",
      name: "Игорь Новиков",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      title: "Тату-мастер",
      rating: 4.7,
      productsCount: 15
    },
    sizes: null,
    colors: [
      { name: "Черный", value: "#000000" },
      { name: "Серебристый", value: "#C0C0C0" }
    ],
    specifications: [
      { label: "Тип", value: "Роторная (pen)" },
      { label: "Мотор", value: "Японский DC" },
      { label: "Ход иглы", value: "3.5 мм" },
      { label: "Вес", value: "150 г" },
      { label: "Напряжение", value: "7-10V" }
    ],
    reviews: [
      {
        id: "1",
        author: "Артем К.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "3 дня назад",
        text: "Отличная машинка для своей цены. Работает тихо, линии ровные.",
        helpful: 14,
        targetType: "product",
        targetId: "6",
        targetTitle: "Тату-машинка Dragonhawk",
      }
    ]
  }
]

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const product = products.find(p => p.id === id)
  
  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }
  
  return NextResponse.json({ product })
}
