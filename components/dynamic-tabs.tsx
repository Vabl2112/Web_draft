"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
}

interface DynamicTabsProps {
  tabs: TabItem[]
  defaultEnabled?: string[]
}

export function DynamicTabs({ tabs, defaultEnabled }: DynamicTabsProps) {
  const [enabledTabs, setEnabledTabs] = useState<string[]>(
    defaultEnabled || tabs.map(t => t.id)
  )

  const visibleTabs = tabs.filter(tab => enabledTabs.includes(tab.id))
  const defaultTab = visibleTabs[0]?.id || ""

  const toggleTab = (tabId: string) => {
    setEnabledTabs(prev => {
      if (prev.includes(tabId)) {
        if (prev.length <= 1) return prev
        return prev.filter(id => id !== tabId)
      }
      return [...prev, tabId]
    })
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="flex items-start justify-between gap-2">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {visibleTabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Settings2 className="size-4" />
              <span className="sr-only">Настроить разделы</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Показывать разделы</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tabs.map(tab => (
              <DropdownMenuCheckboxItem
                key={tab.id}
                checked={enabledTabs.includes(tab.id)}
                onCheckedChange={() => toggleTab(tab.id)}
                disabled={enabledTabs.length === 1 && enabledTabs.includes(tab.id)}
              >
                {tab.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-1 h-px w-full bg-border" />

      {visibleTabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
