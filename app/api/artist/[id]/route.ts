import { NextResponse } from "next/server"
import type { ArtistProfile } from "@/lib/types"
import { DEFAULT_SECTION_VISIBILITY } from "@/lib/types"

const mockArtistData: ArtistProfile = {
  artist: {
    id: "1",
    name: "Алексей Смирнов",
    title: "Тату-мастер, Художник",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    reviewsCount: 120,
    location: "Москва",
    metro: "м. Бауманская",
    about: "Более 10 лет опыта, специализируюсь на реализме и графике. В своей работе использую только качественные материалы и индивидуальный подход к каждому клиенту. Специализируюсь на эскизах и графике.",
    tags: ["Реализм", "Графика", "Блэкворк", "Цветная тату"],
    sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
    socialLinks: {
      telegram: "https://t.me/example",
      instagram: "https://instagram.com/example",
    },
    badges: []
  },
  services: [
    {
      id: "1",
      icon: "pencil",
      title: "Разработка эскиза",
      description: "Индивидуальный подход к созданию уникального дизайна",
      price: "от 3000 ₽",
      images: [
        "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400&h=400&fit=crop"
      ]
    },
    {
      id: "2", 
      icon: "clock",
      title: "Сеанс тату (3 часа)",
      description: "Стерильные материалы и комфортная атмосфера",
      price: "15000 ₽",
      images: [
        "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1590246815117-0ec27ac9bc95?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&h=400&fit=crop"
      ]
    },
    {
      id: "3",
      icon: "refresh",
      title: "Перекрытие/Коррекция",
      description: "Работа со сложными случаями, перекрытие старых работ",
      price: "по договоренности"
    },
    {
      id: "4",
      icon: "star",
      title: "VIP сеанс (5 часов)",
      description: "Расширенный сеанс для крупных работ с перерывами",
      price: "25000 ₽",
      images: [
        "https://images.unsplash.com/photo-1475180429745-21de9a24a9fb?w=400&h=400&fit=crop"
      ]
    }
  ],
  portfolio: [
    { id: "1", showcaseKind: "portfolio", images: ["https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=600&fit=crop", "https://images.unsplash.com/photo-1590246814883-57764a58d1a3?w=400&h=600&fit=crop"], title: "Реализм", description: "Портретная работа в стиле реализм", height: "large" },
    { id: "2", showcaseKind: "portfolio", images: ["https://images.unsplash.com/photo-1590246815117-0ec27ac9bc95?w=400&h=500&fit=crop"], title: "Графика", height: "medium" },
    { id: "3", showcaseKind: "record", images: ["https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&h=300&fit=crop"], title: "За кадром: как собираем референсы", description: "Короткий пост о процессе", height: "small" },
    { id: "4", showcaseKind: "portfolio", images: ["https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&h=350&fit=crop"], title: "Блэкворк", height: "small" },
    { id: "5", showcaseKind: "record", images: ["https://images.unsplash.com/photo-1475180429745-21de9a24a9fb?w=400&h=550&fit=crop"], title: "Выходные 10–11 мая — запись открыта", description: "Новость студии", height: "large" },
    { id: "6", showcaseKind: "portfolio", images: ["https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop", "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop"], title: "Геометрия", description: "Сложная геометрическая композиция", height: "medium" },
    { id: "7", showcaseKind: "record", images: ["https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=450&fit=crop"], title: "Свежая работа — процесс в сторис", height: "medium" },
    { id: "8", showcaseKind: "portfolio", images: ["https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&h=380&fit=crop"], title: "Абстракция", height: "small" },
    { id: "9", showcaseKind: "record", images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=520&fit=crop"], title: "Обновили политику бронирования", height: "large" },
    { id: "10", showcaseKind: "portfolio", images: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=320&fit=crop"], title: "Животные", height: "small" },
    { id: "11", showcaseKind: "portfolio", images: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=480&fit=crop"], title: "Акварель", height: "medium" },
    { id: "12", showcaseKind: "record", images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=550&fit=crop"], title: "Спасибо за 500 подписчиков!", height: "large" }
  ],
  reviews: [
    {
      id: "1",
      author: "Алексей Смирнов",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4.9,
      date: "16.05.2017",
      text: "Отличный сеанс, атмосфера и стерильность на высоте.",
      targetType: "service",
      targetId: "2",
      targetTitle: "Сеанс тату (3 часа)",
    },
    {
      id: "2",
      author: "Летиция Валава",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      rating: 4.9,
      date: "16.08.2017",
      text: "Эскиз разработали идеально, очень довольна результатом.",
      targetType: "service",
      targetId: "1",
      targetTitle: "Разработка эскиза",
    },
    {
      id: "3",
      author: "Игорь П.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "02.03.2026",
      text: "Крем взял здесь же — качество отличное, доставка быстрая.",
      targetType: "product",
      targetId: "1",
      targetTitle: "Заживляющий крем для тату",
    },
    // Невалидные записи — клиент полностью игнорирует (демо фильтрации)
    {
      id: "x-null-author",
      author: null,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "01.01.2020",
      text: "Не должно отображаться",
      targetType: "service",
      targetId: "1",
      targetTitle: "Разработка эскиза",
    },
    {
      id: "x-other-rating",
      author: "Тест",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: "other",
      date: "01.01.2020",
      text: "Не должно отображаться",
      targetType: "product",
      targetId: "1",
      targetTitle: "Товар",
    },
    {
      id: "x-other-text",
      author: "Тест 2",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "01.01.2020",
      text: "other",
      targetType: "service",
      targetId: "2",
      targetTitle: "Услуга",
    },
    {
      id: "x-bad-target",
      author: "Валидный автор",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "01.01.2020",
      text: "Текст ок",
      targetType: "other",
      targetId: "1",
      targetTitle: "Что-то",
    },
  ],
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // In real app, fetch from database based on id
  return NextResponse.json({
    ...mockArtistData,
    artist: {
      ...mockArtistData.artist,
      id,
    },
  })
}
