"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, MessageSquare, ChevronDown, MapPin, Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

const navLinks = [
  { href: "/masters", label: "Мастера" },
  { href: "/gallery", label: "Фотогалерея" },
  { href: "/services", label: "Услуги" },
  { href: "/products", label: "Товары" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-amber-500">EGG</span>
          </Link>
          
          <Button variant="outline" size="sm" className="hidden gap-2 rounded-full sm:flex">
            <MapPin className="size-4" />
            <span>Москва</span>
          </Button>
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

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="hidden text-muted-foreground sm:flex">
            <Bell className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden text-muted-foreground sm:flex">
            <MessageSquare className="size-5" />
          </Button>
          
          {/* User Avatar - Desktop */}
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar className="size-9">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>АС</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium lg:inline-block">Алексей</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>

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
                <div className="flex items-center justify-between border-b border-border p-4">
                  <span className="text-lg font-semibold">Меню</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="size-5" />
                    </Button>
                  </SheetClose>
                </div>
                
                {/* Mobile User Info */}
                <div className="flex items-center gap-3 border-b border-border p-4">
                  <Avatar className="size-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback>АС</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Алексей</p>
                    <p className="text-sm text-muted-foreground">Москва</p>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col p-4">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="flex items-center py-3 text-base font-medium text-foreground transition-colors hover:text-foreground/70"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {/* Mobile Actions */}
                <div className="mt-auto border-t border-border p-4">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon">
                      <Bell className="size-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
