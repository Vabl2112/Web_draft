"use client"

import Link from "next/link"
import { Mail, Instagram, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = {
  company: [
    { href: "/about", label: "О нас" },
    { href: "/masters", label: "Авторы" },
    { href: "/gallery", label: "Витрина" },
    { href: "/articles", label: "Статьи" },
    { href: "/careers", label: "Вакансии" },
  ],
  services: [
    { href: "/products", label: "Товары и услуги" },
    { href: "/services", label: "Только услуги" },
    { href: "/faq", label: "Вопросы" },
  ],
  support: [
    { href: "/help", label: "Помощь" },
    { href: "/contact", label: "Связаться" },
    { href: "/privacy", label: "Конфиденциальность" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-amber-500">EGG</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Пространство для авторов оригинальных вещей и услуг и для тех, кто их ищет — в одном
              интерфейсе.
            </p>

            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Соцсети и почта
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ссылки появятся здесь — пока заглушки под Telegram, Instagram и email.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex size-11 items-center justify-center rounded-full border border-dashed border-border bg-muted/40 text-muted-foreground"
                  title="Telegram — скоро"
                  aria-hidden
                >
                  <Send className="size-5 opacity-60" />
                </span>
                <span
                  className="inline-flex size-11 items-center justify-center rounded-full border border-dashed border-border bg-muted/40 text-muted-foreground"
                  title="Instagram — скоро"
                  aria-hidden
                >
                  <Instagram className="size-5 opacity-60" />
                </span>
                <a
                  href="mailto:hello@egg.market"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Mail className="size-4" />
                  hello@egg.market
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Компания</h3>
            <ul className="space-y-1">
              {footerLinks.company.map(link => (
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

          <div>
            <h3 className="mb-4 text-sm font-semibold">Разделы</h3>
            <ul className="space-y-1">
              {footerLinks.services.map(link => (
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

          <div>
            <h3 className="mb-4 text-sm font-semibold">Поддержка</h3>
            <ul className="space-y-1">
              {footerLinks.support.map(link => (
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

        <div className="mt-12 rounded-2xl border border-border/80 bg-muted/30 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold">Рассылка</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Редкие письма о новых возможностях платформы — без спама.
              </p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto sm:min-w-80">
              <Input
                type="email"
                placeholder="Email"
                className="flex-1 rounded-full border-border bg-background"
              />
              <Button className="shrink-0 rounded-full px-6" type="button">
                Ок
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} EGG</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Условия
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
