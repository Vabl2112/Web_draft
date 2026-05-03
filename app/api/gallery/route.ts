import { NextResponse } from "next/server"
import type { GalleryCategory, GalleryImage, ShowcaseCardKind } from "@/lib/types"

const SHOWCASE_ROTATION: ShowcaseCardKind[] = ["portfolio", "record"]

const categories: GalleryCategory[] = [
  {
    id: "painting",
    name: "Живопись",
    subFilters: [
      { id: "oil", name: "Масло" },
      { id: "acrylic", name: "Акрил" },
      { id: "watercolor", name: "Акварель" },
      { id: "portrait", name: "Портреты" },
      { id: "landscape", name: "Пейзажи" },
      { id: "abstract", name: "Абстракция" },
    ],
  },
  {
    id: "ceramics",
    name: "Керамика",
    subFilters: [
      { id: "dishes", name: "Посуда" },
      { id: "vases", name: "Вазы" },
      { id: "sculpture", name: "Скульптура" },
      { id: "decor", name: "Декор" },
    ],
  },
  {
    id: "jewelry",
    name: "Украшения",
    subFilters: [
      { id: "rings", name: "Кольца" },
      { id: "necklaces", name: "Колье" },
      { id: "earrings", name: "Серьги" },
      { id: "bracelets", name: "Браслеты" },
      { id: "custom", name: "На заказ" },
    ],
  },
  {
    id: "woodwork",
    name: "Изделия из дерева",
    subFilters: [
      { id: "furniture", name: "Мебель" },
      { id: "decor", name: "Декор" },
      { id: "toys", name: "Игрушки" },
      { id: "kitchenware", name: "Кухонная утварь" },
    ],
  },
  {
    id: "textile",
    name: "Текстиль",
    subFilters: [
      { id: "embroidery", name: "Вышивка" },
      { id: "knitting", name: "Вязание" },
      { id: "sewing", name: "Шитьё" },
      { id: "macrame", name: "Макраме" },
    ],
  },
  {
    id: "photography",
    name: "Фотография",
    subFilters: [
      { id: "portrait", name: "Портрет" },
      { id: "landscape", name: "Пейзаж" },
      { id: "street", name: "Стрит" },
      { id: "product", name: "Предметная" },
    ],
  },
]

const paintingImages = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=400&h=550&fit=crop",
]

const ceramicsImages = [
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=550&fit=crop",
]

const jewelryImages = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=550&fit=crop",
]

const woodworkImages = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=550&fit=crop",
]

const textileImages = [
  "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1617713964959-d9a36bbc7b52?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=400&h=550&fit=crop",
]

const photographyImages = [
  "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=550&fit=crop",
]

const imagesByCategory: Record<string, string[]> = {
  painting: paintingImages,
  ceramics: ceramicsImages,
  jewelry: jewelryImages,
  woodwork: woodworkImages,
  textile: textileImages,
  photography: photographyImages,
}

const heights: ("small" | "medium" | "large")[] = ["small", "medium", "large"]

const authors = [
  { name: "Алексей Смирнов", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Мария Иванова", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Дмитрий Козлов", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { name: "Анна Петрова", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "Игорь Волков", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
]

function generateImages(category: string, subCategory?: string): GalleryImage[] {
  const categoryData = categories.find((c) => c.id === category)
  const images = imagesByCategory[category] || paintingImages
  const subFilters = categoryData?.subFilters || []
  
  const result: GalleryImage[] = []
  
  for (let i = 0; i < 20; i++) {
    const subFilter = subFilters[Math.floor(Math.random() * subFilters.length)]
    
    if (subCategory && subFilter?.id !== subCategory) {
      continue
    }
    
    const author = authors[Math.floor(Math.random() * authors.length)]
    const imageUrl = images[Math.floor(Math.random() * images.length)]
    
    const extra =
      i % 3 === 0
        ? [
            imageUrl,
            images[Math.floor(Math.random() * images.length)] +
              (imageUrl.includes("?") ? "&" : "?") +
              `alt=${i}`,
          ]
        : undefined

    result.push({
      id: `${category}-${i}-${Date.now()}`,
      imageUrl,
      ...(extra ? { images: extra } : {}),
      title: `Работа #${i + 1}`,
      author: author.name,
      authorAvatar: author.avatar,
      category,
      subCategory: subFilter?.id || "",
      height: heights[Math.floor(Math.random() * heights.length)],
      showcaseKind: SHOWCASE_ROTATION[i % SHOWCASE_ROTATION.length],
    })
  }
  
  return subCategory ? result : result.slice(0, 20)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "painting"
  const subCategory = searchParams.get("subCategory") || undefined

  await new Promise((resolve) => setTimeout(resolve, 300))

  const images = generateImages(category, subCategory)
  const categoryData = categories.find((c) => c.id === category)

  return NextResponse.json({
    categories,
    currentCategory: categoryData,
    images,
  })
}
