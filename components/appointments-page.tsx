"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MessageSquare,
  Star,
  MoreVertical,
  X,
  CheckCircle2,
  AlertCircle,
  CalendarClock
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  artistId: string
  artistName: string
  artistAvatar: string
  service: string
  date: string
  time: string
  duration: string
  location: string
  price: number
  status: "upcoming" | "completed" | "cancelled"
  canReview: boolean
}

const appointments: Appointment[] = [
  {
    id: "1",
    artistId: "1",
    artistName: "Мария Иванова",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    service: "Татуировка (минимализм)",
    date: "15 апреля 2024",
    time: "14:00",
    duration: "2 часа",
    location: "ул. Арбат, 25",
    price: 8000,
    status: "upcoming",
    canReview: false,
  },
  {
    id: "2",
    artistId: "2",
    artistName: "Дмитрий Козлов",
    artistAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    service: "Татуировка (реализм)",
    date: "20 апреля 2024",
    time: "11:00",
    duration: "4 часа",
    location: "ул. Тверская, 12",
    price: 15000,
    status: "upcoming",
    canReview: false,
  },
  {
    id: "3",
    artistId: "3",
    artistName: "Анна Петрова",
    artistAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    service: "Консультация",
    date: "10 апреля 2024",
    time: "16:00",
    duration: "30 минут",
    location: "ул. Пушкина, 5",
    price: 1000,
    status: "completed",
    canReview: true,
  },
  {
    id: "4",
    artistId: "4",
    artistName: "Игорь Новиков",
    artistAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    service: "Татуировка (Blackwork)",
    date: "5 апреля 2024",
    time: "12:00",
    duration: "3 часа",
    location: "ул. Ленина, 45",
    price: 12000,
    status: "completed",
    canReview: false,
  },
  {
    id: "5",
    artistId: "1",
    artistName: "Мария Иванова",
    artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    service: "Татуировка (геометрия)",
    date: "1 апреля 2024",
    time: "15:00",
    duration: "2 часа",
    location: "ул. Арбат, 25",
    price: 7500,
    status: "cancelled",
    canReview: false,
  },
]

export function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [appointmentsList, setAppointmentsList] = useState(appointments)

  const upcomingAppointments = appointmentsList.filter(a => a.status === "upcoming")
  const completedAppointments = appointmentsList.filter(a => a.status === "completed")
  const cancelledAppointments = appointmentsList.filter(a => a.status === "cancelled")

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    if (selectedAppointment) {
      setAppointmentsList(prev =>
        prev.map(a =>
          a.id === selectedAppointment.id ? { ...a, status: "cancelled" as const } : a
        )
      )
    }
    setCancelDialogOpen(false)
    setSelectedAppointment(null)
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="gap-1 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
            <CalendarClock className="size-3" />
            Предстоит
          </Badge>
        )
      case "completed":
        return (
          <Badge className="gap-1 bg-green-500/10 text-green-600 hover:bg-green-500/20">
            <CheckCircle2 className="size-3" />
            Завершено
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="gap-1 bg-destructive/10 text-destructive hover:bg-destructive/20">
            <X className="size-3" />
            Отменено
          </Badge>
        )
    }
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
          {/* Artist Info */}
          <div className="flex items-center gap-3 sm:w-48 sm:shrink-0">
            <Avatar className="size-12 ring-2 ring-background shadow-md">
              <AvatarImage src={appointment.artistAvatar} alt={appointment.artistName} />
              <AvatarFallback>{appointment.artistName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <Link 
                href={`/master/${appointment.artistId}`}
                className="font-semibold hover:underline"
              >
                {appointment.artistName}
              </Link>
              <p className="text-sm text-muted-foreground">{appointment.service}</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-4" />
                {appointment.date}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" />
                {appointment.time} ({appointment.duration})
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4" />
                {appointment.location}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {appointment.price.toLocaleString("ru-RU")} &#8381;
              </span>
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:shrink-0">
            {appointment.status === "upcoming" && (
              <>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <MessageSquare className="size-4" />
                  <span className="hidden sm:inline">Написать</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Перенести</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleCancelClick(appointment)}
                    >
                      Отменить запись
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {appointment.status === "completed" && appointment.canReview && (
              <Button variant="outline" size="sm" className="gap-1.5">
                <Star className="size-4" />
                Отзыв об услуге
              </Button>
            )}
            {appointment.status === "completed" && !appointment.canReview && (
              <Button variant="outline" size="sm" className="gap-1.5">
                Повторить
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const EmptyState = ({ type }: { type: "upcoming" | "completed" | "cancelled" }) => {
    const content = {
      upcoming: {
        icon: CalendarClock,
        title: "Нет предстоящих записей",
        description: "Запишитесь к мастеру, чтобы увидеть здесь свои записи",
        action: "Найти мастера",
        href: "/masters",
      },
      completed: {
        icon: CheckCircle2,
        title: "Нет завершенных записей",
        description: "История ваших визитов появится здесь",
        action: null,
        href: null,
      },
      cancelled: {
        icon: X,
        title: "Нет отмененных записей",
        description: "Отмененные записи будут отображаться здесь",
        action: null,
        href: null,
      },
    }

    const { icon: Icon, title, description, action, href } = content[type]

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <Icon className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">{description}</p>
        {action && href && (
          <Link href={href}>
            <Button className="mt-4">{action}</Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Мои записи</h1>
            <p className="mt-1 text-muted-foreground">
              Управляйте своими записями к мастерам
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="upcoming" className="gap-2">
                Предстоящие
                {upcomingAppointments.length > 0 && (
                  <Badge variant="secondary">{upcomingAppointments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                Завершенные
                {completedAppointments.length > 0 && (
                  <Badge variant="secondary">{completedAppointments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="gap-2">
                Отмененные
                {cancelledAppointments.length > 0 && (
                  <Badge variant="secondary">{cancelledAppointments.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingAppointments.length === 0 ? (
                <EmptyState type="upcoming" />
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {completedAppointments.length === 0 ? (
                <EmptyState type="completed" />
              ) : (
                <div className="space-y-4">
                  {completedAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              {cancelledAppointments.length === 0 ? (
                <EmptyState type="cancelled" />
              ) : (
                <div className="space-y-4">
                  {cancelledAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отменить запись?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отменить запись к мастеру{" "}
              <span className="font-medium text-foreground">
                {selectedAppointment?.artistName}
              </span>{" "}
              на {selectedAppointment?.date} в {selectedAppointment?.time}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-4">
            <AlertCircle className="size-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-600">
              Обратите внимание: при отмене менее чем за 24 часа до сеанса может взиматься штраф.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Не отменять
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Отменить запись
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
