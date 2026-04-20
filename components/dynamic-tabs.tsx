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
        className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0"
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
                "inline-flex items-center rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]",
                selected && "border-foreground text-foreground"
              )}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-1 h-px w-full bg-border" />

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={activeTab ? `${baseId}-tab-${activeTab.id}` : undefined}
        className="mt-6 outline-none"
      >
        {activeTab?.content ?? null}
      </div>
    </div>
  )
}
