"use client"

import { useState } from "react"
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Camera
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const userProfile = {
  name: "Алексей Смирнов",
  email: "alexey@example.com",
  phone: "+7 (999) 123-45-67",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
}

type SettingsSection = "profile" | "notifications" | "privacy" | "appearance" | "language"

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  
  // Form states
  const [name, setName] = useState(userProfile.name)
  const [email, setEmail] = useState(userProfile.email)
  const [phone, setPhone] = useState(userProfile.phone)
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  
  // Privacy settings
  const [profileVisible, setProfileVisible] = useState(true)
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [showLastSeen, setShowLastSeen] = useState(false)
  
  // Appearance settings
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("ru")

  const menuItems = [
    { id: "profile" as const, label: "Профиль", icon: User },
    { id: "notifications" as const, label: "Уведомления", icon: Bell },
    { id: "privacy" as const, label: "Приватность", icon: Shield },
    { id: "appearance" as const, label: "Внешний вид", icon: Palette },
    { id: "language" as const, label: "Язык и регион", icon: Globe },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Настройки</h1>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Navigation */}
            <nav className="lg:w-64 lg:shrink-0">
              <Card>
                <CardContent className="p-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        activeSection === item.id
                          ? "bg-muted font-medium"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <item.icon className="size-5 text-muted-foreground" />
                      <span>{item.label}</span>
                      <ChevronRight className="ml-auto size-4 text-muted-foreground" />
                    </button>
                  ))}
                  <Separator className="my-2" />
                  <button
                    onClick={() => setLogoutDialogOpen(true)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="size-5" />
                    <span>Выйти</span>
                  </button>
                </CardContent>
              </Card>
            </nav>

            {/* Content */}
            <div className="flex-1">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Профиль</CardTitle>
                    <CardDescription>
                      Управляйте своими личными данными
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="size-20">
                          <AvatarImage src={userProfile.avatar} alt={name} />
                          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute -bottom-1 -right-1 size-8 rounded-full"
                        >
                          <Camera className="size-4" />
                        </Button>
                      </div>
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">{email}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Новый пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Введите новый пароль"
                          className="pl-9 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>Сохранить изменения</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Уведомления</CardTitle>
                    <CardDescription>
                      Настройте, какие уведомления вы хотите получать
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Каналы уведомлений</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email уведомления</Label>
                          <p className="text-sm text-muted-foreground">
                            Получать уведомления на email
                          </p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push уведомления</Label>
                          <p className="text-sm text-muted-foreground">
                            Уведомления в браузере
                          </p>
                        </div>
                        <Switch
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS уведомления</Label>
                          <p className="text-sm text-muted-foreground">
                            Получать SMS на телефон
                          </p>
                        </div>
                        <Switch
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Типы уведомлений</h3>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Напоминания о записях</Label>
                          <p className="text-sm text-muted-foreground">
                            За день и за час до сеанса
                          </p>
                        </div>
                        <Switch
                          checked={appointmentReminders}
                          onCheckedChange={setAppointmentReminders}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Новые сообщения</Label>
                          <p className="text-sm text-muted-foreground">
                            Уведомления о входящих сообщениях
                          </p>
                        </div>
                        <Switch
                          checked={messageNotifications}
                          onCheckedChange={setMessageNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Маркетинговые рассылки</Label>
                          <p className="text-sm text-muted-foreground">
                            Акции, скидки и новости
                          </p>
                        </div>
                        <Switch
                          checked={marketingEmails}
                          onCheckedChange={setMarketingEmails}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Privacy Section */}
              {activeSection === "privacy" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Приватность</CardTitle>
                    <CardDescription>
                      Управляйте видимостью вашего профиля
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Публичный профиль</Label>
                        <p className="text-sm text-muted-foreground">
                          Другие пользователи могут видеть ваш профиль
                        </p>
                      </div>
                      <Switch
                        checked={profileVisible}
                        onCheckedChange={setProfileVisible}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Показывать онлайн статус</Label>
                        <p className="text-sm text-muted-foreground">
                          Другие видят, когда вы онлайн
                        </p>
                      </div>
                      <Switch
                        checked={showOnlineStatus}
                        onCheckedChange={setShowOnlineStatus}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Показывать время последнего визита</Label>
                        <p className="text-sm text-muted-foreground">
                          Когда вы были в сети в последний раз
                        </p>
                      </div>
                      <Switch
                        checked={showLastSeen}
                        onCheckedChange={setShowLastSeen}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Управление данными</h3>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline">Скачать мои данные</Button>
                        <Button variant="outline" className="text-destructive hover:text-destructive">
                          Удалить аккаунт
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Appearance Section */}
              {activeSection === "appearance" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Внешний вид</CardTitle>
                    <CardDescription>
                      Настройте тему и отображение приложения
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Тема</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "light", label: "Светлая", icon: Sun },
                          { id: "dark", label: "Темная", icon: Moon },
                          { id: "system", label: "Системная", icon: Monitor },
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setTheme(option.id)}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                              theme === option.id
                                ? "border-foreground bg-muted"
                                : "border-border hover:border-foreground/50"
                            )}
                          >
                            <option.icon className="size-6" />
                            <span className="text-sm font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Language Section */}
              {activeSection === "language" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Язык и регион</CardTitle>
                    <CardDescription>
                      Настройте язык интерфейса и региональные параметры
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Язык интерфейса</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full sm:w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ru">Русский</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="uk">Українська</SelectItem>
                          <SelectItem value="kk">Қазақша</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Часовой пояс</Label>
                      <Select defaultValue="moscow">
                        <SelectTrigger className="w-full sm:w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="moscow">Москва (UTC+3)</SelectItem>
                          <SelectItem value="kaliningrad">Калининград (UTC+2)</SelectItem>
                          <SelectItem value="samara">Самара (UTC+4)</SelectItem>
                          <SelectItem value="yekaterinburg">Екатеринбург (UTC+5)</SelectItem>
                          <SelectItem value="novosibirsk">Новосибирск (UTC+7)</SelectItem>
                          <SelectItem value="vladivostok">Владивосток (UTC+10)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Формат даты</Label>
                      <Select defaultValue="dmy">
                        <SelectTrigger className="w-full sm:w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dmy">ДД.ММ.ГГГГ</SelectItem>
                          <SelectItem value="mdy">ММ/ДД/ГГГГ</SelectItem>
                          <SelectItem value="ymd">ГГГГ-ММ-ДД</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Logout Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Выйти из аккаунта?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите выйти из своего аккаунта? Вам нужно будет войти снова, чтобы получить доступ к своему профилю.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive">Выйти</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
