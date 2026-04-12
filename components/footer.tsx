"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Instagram, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = {
  company: [
    { href: "/about", label: "О нас" },
    { href: "/masters", label: "Наши мастера" },
    { href: "/gallery", label: "Галерея работ" },
    { href: "/careers", label: "Вакансии" },
  ],
  services: [
    { href: "/services", label: "Услуги" },
    { href: "/products", label: "Товары" },
    { href: "/calculator", label: "Калькулятор" },
    { href: "/gift-cards", label: "Подарочные сертификаты" },
  ],
  support: [
    { href: "/faq", label: "Частые вопросы" },
    { href: "/care", label: "Уход за тату" },
    { href: "/contact", label: "Связаться с нами" },
    { href: "/privacy", label: "Политика конфиденциальности" },
  ],
}

const socialLinks = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://t.me", icon: Send, label: "Telegram" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-amber-500">EGG</span>
            </Link>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Профессиональная тату-студия с лучшими мастерами города. Воплощаем ваши идеи в искусство на коже.
            </p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="size-5 shrink-0 text-muted-foreground" />
                <span>Москва, ул. Тверская, 15, офис 301</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-5 shrink-0 text-muted-foreground" />
                <a href="tel:+74951234567" className="hover:text-foreground/70">+7 (495) 123-45-67</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-5 shrink-0 text-muted-foreground" />
                <a href="mailto:info@egg-tattoo.ru" className="hover:text-foreground/70">info@egg-tattoo.ru</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="size-5 shrink-0 text-muted-foreground" />
                <span>Пн-Вс: 10:00 - 22:00</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
                  aria-label={social.label}
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links - Company */}
          <div>
            <h3 className="mb-4 font-semibold">Компания</h3>
            <ul className="space-y-1">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Services */}
          <div>
            <h3 className="mb-4 font-semibold">Услуги</h3>
            <ul className="space-y-1">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Support */}
          <div>
            <h3 className="mb-4 font-semibold">Поддержка</h3>
            <ul className="space-y-1">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-2xl bg-muted p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Подпишитесь на новости</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Получайте информацию о скидках и новых работах мастеров
              </p>
            </div>
            <div className="flex gap-2 sm:w-auto sm:min-w-80">
              <Input
                type="email"
                placeholder="Ваш email"
                className="flex-1 rounded-full bg-background"
              />
              <Button className="shrink-0 rounded-full px-6">
                Подписаться
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            2024 EGG Tattoo Studio. Все права защищены.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Условия использования
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Конфиденциальность
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
