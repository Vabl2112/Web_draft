"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
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
  Camera,
  Edit3,
  ImageIcon,
  Tags,
  FileText,
  Briefcase
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

type UserRole = "user" | "master"

interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
  role: UserRole
  // Master-specific fields
  bio?: string
  tags?: string[]
  showPortfolio?: boolean
  showServices?: boolean
  showCalculator?: boolean
  showReviews?: boolean
}

const userProfile: UserProfile = {
  name: "Алексей Смирнов",
  email: "alexey@example.com",
  phone: "+7 (999) 123-45-67",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
  role: "master", // Change to "user" to test user mode
  bio: "Профессиональный тату-мастер с 10-летним опытом. Специализируюсь на японской традиционной татуировке и неотраде.",
  tags: ["Японский стиль", "Неотрад", "Блэкворк", "Орнаментал"],
  showPortfolio: true,
  showServices: true,
  showCalculator: true,
  showReviews: true,
}

type SettingsSection = "profile" | "notifications" | "privacy" | "appearance" | "language" | "master-profile"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  
  // Form states
  const [name, setName] = useState(userProfile.name)
  const [email, setEmail] = useState(userProfile.email)
  const [phone, setPhone] = useState(userProfile.phone)
  
  // Master profile states
  const [bio, setBio] = useState(userProfile.bio || "")
  const [tags, setTags] = useState<string[]>(userProfile.tags || [])
  const [newTag, setNewTag] = useState("")
  const [showPortfolio, setShowPortfolio] = useState(userProfile.showPortfolio ?? true)
  const [showServices, setShowServices] = useState(userProfile.showServices ?? true)
  const [showCalculator, setShowCalculator] = useState(userProfile.showCalculator ?? true)
  const [showReviews, setShowReviews] = useState(userProfile.showReviews ?? true)
  
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
  
  // Language settings
  const [language, setLanguage] = useState("ru")
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const baseMenuItems = [
    { id: "profile" as const, label: "Профиль", icon: User },
    { id: "notifications" as const, label: "Уведомления", icon: Bell },
    { id: "privacy" as const, label: "Приватность", icon: Shield },
    { id: "appearance" as const, label: "Внешний вид", icon: Palette },
    { id: "language" as const, label: "Язык и регион", icon: Globe },
  ]
  
  const masterMenuItem = { 
    id: "master-profile" as const, 
    label: "Профиль мастера", 
    icon: Briefcase 
  }
  
  const menuItems = userProfile.role === "master" 
    ? [baseMenuItems[0], masterMenuItem, ...baseMenuItems.slice(1)]
    : baseMenuItems

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
                              mounted && theme === option.id
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
              
              {/* Master Profile Section - Only for masters */}
              {activeSection === "master-profile" && userProfile.role === "master" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Профиль мастера</CardTitle>
                    <CardDescription>
                      Настройте отображение вашего профиля для клиентов
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Photo */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <ImageIcon className="size-4" />
                        Фото профиля
                      </Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="size-24">
                          <AvatarImage src={userProfile.avatar} alt={name} />
                          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            <Camera className="mr-2 size-4" />
                            Загрузить фото
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG до 5 МБ
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="size-4" />
                        Описание
                      </Label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Расскажите о себе и своей работе..."
                        className="min-h-24 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {bio.length}/500 символов
                      </p>
                    </div>

                    <Separator />

                    {/* Tags */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Tags className="size-4" />
                        Теги и стили
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 rounded-full hover:bg-muted-foreground/20"
                            >
                              <span className="sr-only">Удалить тег</span>
                              <svg className="size-3" viewBox="0 0 12 12" fill="none">
                                <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Добавить тег..."
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                        />
                        <Button variant="outline" onClick={handleAddTag}>
                          Добавить
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Section visibility */}
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2">
                        <Edit3 className="size-4" />
                        Отображаемые разделы
                      </Label>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Портфолио</Label>
                          <p className="text-sm text-muted-foreground">
                            Показывать галерею работ
                          </p>
                        </div>
                        <Switch
                          checked={showPortfolio}
                          onCheckedChange={setShowPortfolio}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Услуги и товары</Label>
                          <p className="text-sm text-muted-foreground">
                            Показывать список услуг и товаров
                          </p>
                        </div>
                        <Switch
                          checked={showServices}
                          onCheckedChange={setShowServices}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Калькулятор цен</Label>
                          <p className="text-sm text-muted-foreground">
                            Показывать калькулятор стоимости
                          </p>
                        </div>
                        <Switch
                          checked={showCalculator}
                          onCheckedChange={setShowCalculator}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Отзывы</Label>
                          <p className="text-sm text-muted-foreground">
                            Показывать отзывы клиентов
                          </p>
                        </div>
                        <Switch
                          checked={showReviews}
                          onCheckedChange={setShowReviews}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>Сохранить изменения</Button>
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
