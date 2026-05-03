"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ListingKindValue = "all" | "product" | "service"

interface ListingKindSwitchProps {
  value: ListingKindValue
  onChange: (v: ListingKindValue) => void
  /** Скрыть или задизейблить «Товары» (например, в профиле выключен блок товаров) */
  disableProducts?: boolean
  disableServices?: boolean
  /** Три сегмента на всю ширину контейнера, поровну (страница мастера) */
  stretch?: boolean
  className?: string
}

export function ListingKindSwitch({
  value,
  onChange,
  disableProducts,
  disableServices,
  stretch,
  className,
}: ListingKindSwitchProps) {
  const item = (v: ListingKindValue, label: string, disabled?: boolean) => (
    <Button
      key={v}
      type="button"
      variant={value === v ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "h-9 rounded-lg text-sm font-medium",
        stretch
          ? "min-w-0 flex-1 basis-0 px-2 sm:px-3"
          : "flex-1 sm:flex-initial sm:min-w-[6.5rem]",
        value === v && "bg-background shadow-sm ring-1 ring-border",
      )}
      disabled={disabled}
      onClick={() => onChange(v)}
    >
      {label}
    </Button>
  )

  return (
    <div
      role="group"
      aria-label="Тип предложений"
      className={cn(
        "flex w-full gap-1 rounded-xl border border-border/80 bg-muted/50 p-1 dark:bg-muted/30",
        stretch ? "max-w-none" : "max-w-xl",
        className,
      )}
    >
      {item("all", "Все")}
      {item("product", "Товары", disableProducts)}
      {item("service", "Услуги", disableServices)}
    </div>
  )
}
