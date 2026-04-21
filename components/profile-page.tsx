"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Camera,
  Edit2,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  Heart,
  ChevronRight,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"

const joinDateLabel = "Март 2024"

const recentActivity = [
  {
    id: "1",
    type: "favorite",
    title: "Сохранена работа",
    description: "Добавили работу в коллекцию избранного",
    date: "15 апреля",
    icon: Heart,
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

/** Демо-числа для блока профиля (пока нет API избранного) */
const DEMO_STATS = {
  reviewsCount: 3,
  savedCount: 12,
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [editOpen, setEditOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formName, setFormName] = useState("")
  const [formBio, setFormBio] = useState("")
  const [formLocation, setFormLocation] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formEmail, setFormEmail] = useState("")

  useEffect(() => {
    if (!user) return
    setFormName(user.name)
    setFormBio(user.bio ?? "")
    setFormLocation(user.location ?? "")
    setFormPhone(user.phone ?? "")
    setFormEmail(user.email)
  }, [user])

  const openEdit = () => {
    if (user) {
      setFormName(user.name)
      setFormBio(user.bio ?? "")
      setFormLocation(user.location ?? "")
      setFormPhone(user.phone ?? "")
      setFormEmail(user.email)
    }
    setEditOpen(true)
  }

  const handleSaveProfile = () => {
    updateProfile({
      name: formName.trim() || user?.name || "",
      bio: formBio.trim(),
      location: formLocation.trim(),
      phone: formPhone.trim(),
    })
    setEditOpen(false)
  }

  const handleAvatarPick = () => {
    fileInputRef.current?.click()
  }

  const onAvatarFile: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      if (typeof dataUrl === "string") {
        updateProfile({ avatar: dataUrl })
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <p className="text-muted-foreground">Войдите, чтобы открыть профиль</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            aria-hidden
            onChange={onAvatarFile}
          />

          <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative">
              <Avatar className="size-28 ring-4 ring-background shadow-lg sm:size-36">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {user.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 size-9 rounded-full shadow-md"
                onClick={handleAvatarPick}
                aria-label="Сменить фото профиля"
              >
                <Camera className="size-4" />
              </Button>
            </div>

            <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h1 className="text-2xl font-bold sm:text-3xl">{user.name}</h1>
                <Button variant="outline" size="sm" className="gap-1.5" type="button" onClick={openEdit}>
                  <Edit2 className="size-3.5" />
                  <span className="hidden sm:inline">Редактировать</span>
                </Button>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                <div className="flex items-center gap-1">
                  <MapPin className="size-4 shrink-0" />
                  {user.location || "Город не указан"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4 shrink-0" />С {joinDateLabel}
                </div>
              </div>

              <p className="mt-3 max-w-lg text-muted-foreground">
                {user.bio || "Добавьте коротко о себе — так проще найти общий язык с мастерами."}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-8 sm:justify-start">
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-bold tabular-nums">{DEMO_STATS.reviewsCount}</p>
                  <p className="text-sm text-muted-foreground">Отзывов</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-bold tabular-nums">{DEMO_STATS.savedCount}</p>
                  <p className="text-sm text-muted-foreground">Сохранено</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="mb-8 border-dashed">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Избранное</CardTitle>
                  <CardDescription>
                    Мастера и работы, которые вы сохранили — в одном месте
                  </CardDescription>
                </div>
                <Heart className="size-5 shrink-0 text-amber-600" aria-hidden />
              </div>
            </CardHeader>
            <CardContent>
              <Link
                href="/favorites"
                className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">Перейти в избранное</p>
                  <p className="text-sm text-muted-foreground">
                    {DEMO_STATS.savedCount} сохранённых · открыть список
                  </p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" aria-hidden />
              </Link>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview" className="shrink-0">
                Обзор
              </TabsTrigger>
              <TabsTrigger value="activity" className="shrink-0">
                Активность
              </TabsTrigger>
              <TabsTrigger value="reviews" className="shrink-0">
                Мои отзывы
              </TabsTrigger>
              <TabsTrigger value="info" className="shrink-0">
                Контакты
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Быстрые действия</CardTitle>
                  <CardDescription>Как в сервисах вроде Notion или GitHub: основное — на профиле</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href={`/master/${user.id}`}
                    className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                  >
                    <p className="font-medium">Публичная страница мастера</p>
                    <p className="text-sm text-muted-foreground">Как вас видят другие</p>
                  </Link>
                  <Link
                    href="/settings"
                    className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                  >
                    <p className="font-medium">Настройки аккаунта</p>
                    <p className="text-sm text-muted-foreground">Тема, язык, уведомления</p>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Последняя активность</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-start gap-4 p-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <activity.icon className="size-5 text-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
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
                {userReviews.map(review => (
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
                        <div className="min-w-0 flex-1">
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
                    <div className="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium break-all">{user.email}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-muted-foreground">Телефон</span>
                      <span className="font-medium">{user.phone || "—"}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-muted-foreground">Город</span>
                      <span className="font-medium">{user.location || "—"}</span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-muted-foreground">На платформе с</span>
                      <span className="font-medium">{joinDateLabel}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-6" type="button" onClick={openEdit}>
                    Изменить данные
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
            <DialogDescription>
              Имя и описание видны в личном кабинете; публичная страница мастера настраивается отдельно.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Имя</Label>
              <Input
                id="profile-name"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" value={formEmail} readOnly disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Телефон</Label>
              <Input
                id="profile-phone"
                value={formPhone}
                onChange={e => setFormPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-city">Город</Label>
              <Input
                id="profile-city"
                value={formLocation}
                onChange={e => setFormLocation(e.target.value)}
                autoComplete="address-level2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-bio">О себе</Label>
              <Textarea
                id="profile-bio"
                value={formBio}
                onChange={e => setFormBio(e.target.value)}
                placeholder="Кратко о себе"
                rows={4}
                maxLength={500}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
              Отмена
            </Button>
            <Button type="button" onClick={handleSaveProfile}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
