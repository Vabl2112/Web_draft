"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Check, Briefcase, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type UserRole = "user" | "master"

const passwordRequirements = [
  { id: "length", label: "Минимум 8 символов", test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "Заглавная буква", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "Строчная буква", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "Цифра", test: (p: string) => /\d/.test(p) },
]

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<UserRole>("user")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const allRequirementsMet = passwordRequirements.every(req => req.test(password))

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image/Branding */}
      <div className="relative hidden w-1/2 bg-foreground lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground to-foreground/80" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-background" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-center p-16 text-background">
          <div className="mb-8">
            <span className="text-6xl font-bold text-amber-500">EGG</span>
          </div>
          
          <h2 className="mb-4 text-center text-3xl font-bold">
            Присоединяйтесь к нам
          </h2>
          
          <p className="mb-12 max-w-md text-center text-lg text-background/70">
            Создайте аккаунт и откройте для себя мир профессиональных тату-мастеров
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <Check className="size-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">Персональные рекомендации</h3>
                <p className="text-sm text-background/70">Находите мастеров по вашему вкусу и стилю</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <Check className="size-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">Удобная запись</h3>
                <p className="text-sm text-background/70">Записывайтесь на сеансы в пару кликов</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <Check className="size-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">Сохраняйте избранное</h3>
                <p className="text-sm text-background/70">Создавайте коллекции любимых работ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-between px-6 py-8 lg:w-1/2 lg:px-16">
        {/* Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-bold text-amber-500">EGG</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Войти
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Создать аккаунт
            </h1>
            <p className="mt-2 text-muted-foreground">
              Заполните данные для регистрации
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Я регистрируюсь как</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                    role === "user"
                      ? "border-foreground bg-foreground/5 shadow-sm"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  <div className={cn(
                    "flex size-12 items-center justify-center rounded-full transition-colors",
                    role === "user" ? "bg-foreground text-background" : "bg-muted"
                  )}>
                    <UserCircle className="size-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Пользователь</p>
                    <p className="text-xs text-muted-foreground">Ищу мастера</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setRole("master")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                    role === "master"
                      ? "border-amber-500 bg-amber-500/5 shadow-sm"
                      : "border-border hover:border-amber-500/30"
                  )}
                >
                  <div className={cn(
                    "flex size-12 items-center justify-center rounded-full transition-colors",
                    role === "master" ? "bg-amber-500 text-white" : "bg-muted"
                  )}>
                    <Briefcase className="size-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Мастер</p>
                    <p className="text-xs text-muted-foreground">Предлагаю услуги</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Создайте пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {password && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {passwordRequirements.map((req) => (
                    <div
                      key={req.id}
                      className={cn(
                        "flex items-center gap-2 text-xs transition-colors",
                        req.test(password) ? "text-green-600" : "text-muted-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-full border transition-colors",
                          req.test(password)
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-muted-foreground"
                        )}
                      >
                        {req.test(password) && <Check className="size-3" />}
                      </div>
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-snug text-muted-foreground"
                >
                  Я согласен с{" "}
                  <Link href="/terms" className="text-foreground underline-offset-4 hover:underline">
                    условиями использования
                  </Link>{" "}
                  и{" "}
                  <Link href="/privacy" className="text-foreground underline-offset-4 hover:underline">
                    политикой конфиденциальности
                  </Link>
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketing"
                  checked={agreeMarketing}
                  onCheckedChange={(checked) => setAgreeMarketing(checked as boolean)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="marketing"
                  className="text-sm font-normal leading-snug text-muted-foreground"
                >
                  Хочу получать новости и специальные предложения
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={cn(
                "h-12 w-full gap-2 text-base",
                role === "master" && "bg-amber-500 hover:bg-amber-600"
              )}
              disabled={isLoading || !agreeTerms || !allRequirementsMet}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Создание аккаунта...
                </>
              ) : (
                <>
                  {role === "master" ? "Стать мастером" : "Создать аккаунт"}
                  <ArrowRight className="size-5" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">или</span>
            <Separator className="flex-1" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-12">
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Button>

            <Button variant="outline" className="h-12">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </Button>

            <Button variant="outline" className="h-12">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.745-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.853 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.27-1.422 2.18-3.608 2.18-3.608.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground">
            Условия использования
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-foreground">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </div>
  )
}
