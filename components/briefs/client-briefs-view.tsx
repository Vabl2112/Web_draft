"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import type { Brief } from "@/lib/briefs/types"
import { fetchBriefsByClient } from "@/lib/briefs/brief-api"
import { BriefCard } from "@/components/briefs/brief-card"
import { Button } from "@/components/ui/button"

export interface ClientBriefsViewProps {
  clientId: number
}

export function ClientBriefsView({ clientId }: ClientBriefsViewProps) {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchBriefsByClient(clientId)
      setBriefs(data)
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Мои брифы</h2>
          <p className="text-sm text-muted-foreground">Заявки, которые вы опубликовали как клиент.</p>
        </div>
        <Button asChild size="lg" className="shrink-0 gap-2 self-start sm:self-auto">
          <Link href="/briefs/new">Заполнить бриф</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Загрузка…</p>
      ) : briefs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <p className="text-muted-foreground">Пока нет брифов. Создайте первый.</p>
          <Button asChild className="mt-4">
            <Link href="/briefs/new">Заполнить бриф</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {briefs.map(b => (
            <BriefCard key={b.id} brief={b} className="h-full" />
          ))}
        </div>
      )}
    </section>
  )
}
