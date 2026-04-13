"use client"

import { useState } from "react"
import Image from "next/image"
import { 
  Camera, 
  Edit2, 
  MapPin, 
  Calendar, 
  Star, 
  MessageSquare,
  Heart,
  Settings,
  LogOut
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DEMO_USER_ID } from "@/lib/demo-constants"

const userProfile = {
  id: DEMO_USER_ID,
  name: "Алексей Смирнов",
  email: "alexey@example.com",
  phone: "+7 (999) 123-45-67",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
  location: "Москва",
  joinDate: "Март 2024",
  about: "Люблю качественные татуировки и хороший сервис. Уже сделал несколько работ у мастеров EGG.",
  stats: {
    appointments: 5,
    reviews: 3,
    favorites: 12,
  },
}

const recentActivity = [
  {
    id: "1",
    type: "appointment",
    title: "Запись подтверждена",
    description: "Сеанс у мастера Мария Иванова",
    date: "15 апреля, 14:00",
    icon: Calendar,
  },
  {
    id: "2",
    type: "review",
    title: "Отзыв опубликован",
    description: "Вы оставили отзыв мастеру Дмитрий Козлов",
    date: "10 апреля",
    icon: Star,
  },
  {
    id: "3",
    type: "favorite",
    title: "Добавлено в избранное",
    description: "Мастер Анна Петрова",
    date: "8 апреля",
    icon: Heart,
  },
  {
    id: "4",
    type: "message",
    title: "Новое сообщение",
    description: "Игорь Новиков ответил на ваше сообщение",
    date: "5 апреля",
    icon: MessageSquare,
  },
]

const userReviews = [
  {
    id: "1",
    artistName: "Дмитрий Козлов",
    artistAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Отличный мастер! Сделал татуировку точно по эскизу, очень доволен результатом. Рекомендую!",
    date: "10 апреля 2024",
    workImage: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    artistName: "Мария Иванова",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Профессиональный подход, чистота и внимание к деталям. Буду обращаться ещё!",
    date: "25 марта 2024",
    workImage: "https://images.unsplash.com/photo-1590246814883-57764a58d1a3?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    artistName: "Анна Петрова",
    artistAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    text: "Хорошая работа, немного дольше по времени чем планировалось, но результат стоит того.",
    date: "15 марта 2024",
    workImage: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=300&h=300&fit=crop",
  },
]

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("activity")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Profile Header */}
          <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative">
              <Avatar className="size-28 ring-4 ring-background shadow-lg sm:size-36">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback className="text-2xl font-bold">АС</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 size-9 rounded-full shadow-md"
              >
                <Camera className="size-4" />
              </Button>
            </div>

            <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold sm:text-3xl">{userProfile.name}</h1>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Edit2 className="size-3.5" />
                  <span className="hidden sm:inline">Редактировать</span>
                </Button>
              </div>

              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {userProfile.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  С {userProfile.joinDate}
                </div>
              </div>

              <p className="mt-3 max-w-lg text-muted-foreground">
                {userProfile.about}
              </p>

              {/* Stats */}
              <div className="mt-4 flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{userProfile.stats.appointments}</p>
                  <p className="text-sm text-muted-foreground">Записей</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userProfile.stats.reviews}</p>
                  <p className="text-sm text-muted-foreground">Отзывов</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userProfile.stats.favorites}</p>
                  <p className="text-sm text-muted-foreground">Избранное</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="activity" className="flex-shrink-0">Активность</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-shrink-0">Мои отзывы</TabsTrigger>
              <TabsTrigger value="info" className="flex-shrink-0">Информация</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Последняя активность</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <activity.icon className="size-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <span className="shrink-0 text-sm text-muted-foreground">{activity.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg sm:size-24">
                          <Image
                            src={review.workImage}
                            alt="Работа"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="size-8">
                                <AvatarImage src={review.artistAvatar} alt={review.artistName} />
                                <AvatarFallback>{review.artistName.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{review.artistName}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`size-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{review.text}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="info" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{userProfile.email}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-muted-foreground">Телефон</span>
                      <span className="font-medium">{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-muted-foreground">Город</span>
                      <span className="font-medium">{userProfile.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Дата регистрации</span>
                      <span className="font-medium">{userProfile.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
