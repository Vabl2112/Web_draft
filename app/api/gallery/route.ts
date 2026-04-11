import { NextResponse } from "next/server"
import type { GalleryCategory, GalleryImage } from "@/lib/types"

const categories: GalleryCategory[] = [
  {
    id: "tattoo",
    name: "Тату",
    subFilters: [
      { id: "realism", name: "Реализм" },
      { id: "traditional", name: "Традишнл" },
      { id: "blackwork", name: "Блэкворк" },
      { id: "dotwork", name: "Дотворк" },
      { id: "watercolor", name: "Акварель" },
      { id: "geometric", name: "Геометрия" },
      { id: "minimalism", name: "Минимализм" },
    ],
  },
  {
    id: "art",
    name: "Арт",
    subFilters: [
      { id: "digital", name: "Диджитал" },
      { id: "sketch", name: "Скетчи" },
      { id: "illustration", name: "Иллюстрации" },
      { id: "portrait", name: "Портреты" },
      { id: "abstract", name: "Абстракция" },
    ],
  },
  {
    id: "leather",
    name: "Работа по коже",
    subFilters: [
      { id: "bags", name: "Сумки" },
      { id: "wallets", name: "Кошельки" },
      { id: "belts", name: "Ремни" },
      { id: "accessories", name: "Аксессуары" },
      { id: "custom", name: "На заказ" },
    ],
  },
  {
    id: "piercing",
    name: "Пирсинг",
    subFilters: [
      { id: "ear", name: "Уши" },
      { id: "face", name: "Лицо" },
      { id: "body", name: "Тело" },
      { id: "jewelry", name: "Украшения" },
    ],
  },
  {
    id: "permanent",
    name: "Перманент",
    subFilters: [
      { id: "brows", name: "Брови" },
      { id: "lips", name: "Губы" },
      { id: "eyes", name: "Веки" },
      { id: "areola", name: "Ареолы" },
    ],
  },
]

const tattooImages = [
  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1590246815117-ce3dbe62c661?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1542856204-00101eb6def4?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=550&fit=crop",
]

const artImages = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=400&h=550&fit=crop",
]

const leatherImages = [
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=550&fit=crop",
  "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=400&h=700&fit=crop",
]

const piercingImages = [
  "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1617391654483-1d7069649354?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1516914589923-f105f1535f88?w=400&h=550&fit=crop",
]

const permanentImages = [
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1588006173527-3e110058a2ed?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=450&fit=crop",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=550&fit=crop",
]

const imagesByCategory: Record<string, string[]> = {
  tattoo: tattooImages,
  art: artImages,
  leather: leatherImages,
  piercing: piercingImages,
  permanent: permanentImages,
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
  const images = imagesByCategory[category] || tattooImages
  const subFilters = categoryData?.subFilters || []
  
  const result: GalleryImage[] = []
  
  for (let i = 0; i < 20; i++) {
    const subFilter = subFilters[Math.floor(Math.random() * subFilters.length)]
    
    if (subCategory && subFilter?.id !== subCategory) {
      continue
    }
    
    const author = authors[Math.floor(Math.random() * authors.length)]
    const imageUrl = images[Math.floor(Math.random() * images.length)]
    
    result.push({
      id: `${category}-${i}-${Date.now()}`,
      imageUrl,
      title: `Работа #${i + 1}`,
      author: author.name,
      authorAvatar: author.avatar,
      category,
      subCategory: subFilter?.id || "",
      height: heights[Math.floor(Math.random() * heights.length)],
    })
  }
  
  return subCategory ? result : result.slice(0, 20)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "tattoo"
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
