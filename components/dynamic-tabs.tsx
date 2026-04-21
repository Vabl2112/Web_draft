"use client"

import { useEffect, useId, useState } from "react"
import { cn } from "@/lib/utils"

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
}

interface DynamicTabsProps {
  tabs: TabItem[]
}

export function DynamicTabs({ tabs }: DynamicTabsProps) {
  const baseId = useId()
  const [active, setActive] = useState(tabs[0]?.id ?? "")

  useEffect(() => {
    const first = tabs[0]?.id ?? ""
    setActive(current => (tabs.some(t => t.id === current) ? current : first))
  }, [tabs])

  const activeTab = tabs.find(t => t.id === active) ?? tabs[0]
  const panelId = `${baseId}-panel`
  const tablistId = `${baseId}-list`

  return (
    <div className="w-full">
      <div
        id={tablistId}
        role="tablist"
        aria-orientation="horizontal"
        className="-mx-1 flex h-auto snap-x snap-mandatory flex-nowrap gap-1 overflow-x-auto overflow-y-hidden scroll-smooth rounded-xl border border-border/60 bg-muted/30 p-1 sm:mx-0 sm:flex-wrap sm:overflow-visible"
      >
        {tabs.map(tab => {
          const selected = activeTab?.id === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "inline-flex min-h-10 shrink-0 snap-start items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all",
                "text-muted-foreground hover:text-foreground",
                "focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]",
                selected &&
                  "bg-background text-foreground shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08]"
              )}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={activeTab ? `${baseId}-tab-${activeTab.id}` : undefined}
        className="mt-8 outline-none md:mt-10"
      >
        {activeTab?.content ?? null}
      </div>
    </div>
  )
}
