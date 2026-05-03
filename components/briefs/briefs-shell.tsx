"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { authUserIdToBriefClientId } from "@/lib/briefs/auth-bridge"
import { ClientBriefsView } from "@/components/briefs/client-briefs-view"
import { MasterBriefsView } from "@/components/briefs/master-briefs-view"
import { Button } from "@/components/ui/button"

export function BriefsShell() {
  const { user, isLoading, isAuthenticated, updateProfile } = useAuth()

  const clientId = user ? authUserIdToBriefClientId(user.id) : 0
  const isMaster = user?.role === "master"

  if (isLoading) {
    return <p className="py-16 text-center text-muted-foreground">Загрузка профиля…</p>
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-semibold">Брифы</h1>
        <p className="mt-2 text-muted-foreground">Войдите, чтобы создавать брифы и пользоваться лентой мастера.</p>
        <Button asChild className="mt-6">
          <Link href="/login">Войти</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <header className="space-y-4 border-b border-border pb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">OXO</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Брифы</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Доска проектных заявок. Лента и отклики — у мастеров; новый бриф привязывается к позиции из «Товаров и
              услуг».
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/briefs/new">Заполнить бриф</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-dashed"
              onClick={() => updateProfile({ role: isMaster ? "user" : "master" })}
            >
              Демо: смотреть как {isMaster ? "пользователь" : "мастер"}
            </Button>
          </div>
        </div>
      </header>

      {isMaster ? <MasterBriefsView /> : <ClientBriefsView clientId={clientId} />}
    </div>
  )
}
