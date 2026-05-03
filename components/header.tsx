"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, MessageSquare, ChevronDown, MapPin, Menu, X, Check, ArrowRight, LogIn } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navLinks = [
  { href: "/masters", label: "Мастера" },
  { href: "/gallery", label: "Витрина" },
  { href: "/products", label: "Товары и услуги" },
  { href: "/articles", label: "Статьи" },
]

const cities = [
  { id: "moscow", name: "Москва" },
  { id: "spb", name: "Санкт-Петербург" },
  { id: "kazan", name: "Казань" },
  { id: "novosibirsk", name: "Новосибирск" },
  { id: "ekaterinburg", name: "Екатеринбург" },
]

const notifications = [
  { id: 1, title: "Новый отзыв", message: "Алексей оставил отзыв о вашей работе", time: "5 мин назад", unread: true },
  { id: 2, title: "Новый подписчик", message: "Кто-то добавил вас в избранное", time: "1 час назад", unread: true },
  { id: 3, title: "Новое сообщение", message: "Мария: Здравствуйте, хотела уточнить...", time: "3 часа назад", unread: false },
]

const messages = [
  { id: 1, name: "Мария Иванова", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", message: "Здравствуйте, хотела уточнить...", time: "3 часа назад", unread: true },
  { id: 2, name: "Дмитрий Козлов", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", message: "Спасибо за работу!", time: "Вчера", unread: false },
  { id: 3, name: "Анна Петрова", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", message: "Когда можно записаться?", time: "2 дня назад", unread: false },
]

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState("moscow")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [messagesOpen, setMessagesOpen] = useState(false)

  const currentCity = cities.find(c => c.id === selectedCity)
  const unreadNotifications = notifications.filter(n => n.unread).length
  const unreadMessages = messages.filter(m => m.unread).length

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-amber-500">EGG</span>
          </Link>
          
          {/* Location Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden gap-2 rounded-full sm:flex">
                <MapPin className="size-4" />
                <span>{currentCity?.name}</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className="flex items-center justify-between"
                >
                  {city.name}
                  {selectedCity === city.id && <Check className="size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated && user ? (
            <>
              {/* Notifications - Only for authenticated users */}
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                    <Bell className="size-5" />
                    {unreadNotifications > 0 && (
                      <Badge className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-3">
                    <span className="font-semibold">Уведомления</span>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
                      Прочитать все
                    </Button>
                  </div>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                      <div className="flex w-full items-start justify-between">
                        <span className={cn("text-sm font-medium", notification.unread && "text-foreground")}>
                          {notification.title}
                        </span>
                        {notification.unread && <span className="size-2 rounded-full bg-destructive" />}
                      </div>
                      <span className="text-sm text-muted-foreground">{notification.message}</span>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Link href="/notifications">
                      <Button variant="outline" size="sm" className="w-full">
                        Все уведомления
                      </Button>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Messages - Only for authenticated users */}
              <DropdownMenu open={messagesOpen} onOpenChange={setMessagesOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                    <MessageSquare className="size-5" />
                    {unreadMessages > 0 && (
                      <Badge className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
                        {unreadMessages}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-3">
                    <span className="font-semibold">Сообщения</span>
                  </div>
                  <DropdownMenuSeparator />
                  {messages.map((msg) => (
                    <DropdownMenuItem key={msg.id} className="flex items-start gap-3 p-3">
                      <Avatar className="size-10 shrink-0">
                        <AvatarImage src={msg.avatar} alt={msg.name} />
                        <AvatarFallback>{msg.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className={cn("text-sm font-medium", msg.unread && "text-foreground")}>
                            {msg.name}
                          </span>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <span className="truncate text-sm text-muted-foreground">{msg.message}</span>
                      </div>
                      {msg.unread && <span className="mt-2 size-2 shrink-0 rounded-full bg-destructive" />}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Link href="/messages">
                      <Button variant="outline" size="sm" className="w-full">
                        Все сообщения
                      </Button>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Avatar - Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden items-center gap-2 px-2 sm:flex">
                    <div className="relative">
                      <Avatar className="size-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="hidden text-sm font-medium lg:inline-block">{user.name}</span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={`/master/${user.id}`}>Страница мастера</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Личный кабинет</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Настройки</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive cursor-pointer"
                    onClick={() => logout()}
                  >
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Auth buttons for unauthenticated users */
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1">
                  <LogIn className="size-4" />
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-1">
                  Регистрация
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-0">
              <div className="flex h-full flex-col">
                <SheetHeader className="border-b border-border p-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle>Меню</SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="size-5" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                
                {/* Mobile User Info or Auth Buttons */}
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3 border-b border-border p-4">
                    <div className="relative">
                      <Avatar className="size-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{currentCity?.name}</p>
                      <div className="mt-2 flex flex-col gap-1">
                        <SheetClose asChild>
                          <Link
                            href={`/master/${user.id}`}
                            className="text-sm font-medium text-amber-600 hover:underline"
                          >
                            Страница мастера
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
                            Личный кабинет
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 border-b border-border p-4">
                    <SheetClose asChild>
                      <Link href="/login">
                        <Button variant="outline" className="w-full gap-2">
                          <LogIn className="size-4" />
                          Войти
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/register">
                        <Button className="w-full gap-2">
                          Регистрация
                          <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                )}

                {/* Mobile Location Selector */}
                <div className="border-b border-border p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Город</p>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((city) => (
                      <Button
                        key={city.id}
                        variant={selectedCity === city.id ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setSelectedCity(city.id)}
                      >
                        {city.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col p-4">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="flex min-h-[44px] items-center py-3 text-base font-medium text-foreground transition-colors hover:text-foreground/70 active:bg-muted/50 -mx-4 px-4 rounded-lg"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {/* Mobile Actions - Only for authenticated users */}
                {isAuthenticated && user && (
                  <div className="mt-auto border-t border-border p-4">
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" className="relative">
                        <Bell className="size-5" />
                        {unreadNotifications > 0 && (
                          <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
                            {unreadNotifications}
                          </Badge>
                        )}
                      </Button>
                      <Button variant="outline" size="icon" className="relative">
                        <MessageSquare className="size-5" />
                        {unreadMessages > 0 && (
                          <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
                            {unreadMessages}
                          </Badge>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto text-destructive"
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                        }}
                      >
                        Выйти
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
