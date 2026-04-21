"use client"

import { Flag, Link2, MoreHorizontal, MoreVertical, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { copyEntityLink, reportEntity, shareEntityLink } from "@/lib/entity-share"

export interface EntityShareMenuItemsProps {
  /** Путь `/product/1` или полный URL */
  sharePath: string
  /** Подпись в тосте жалобы */
  reportKind?: string
  /** Заголовок для Web Share API */
  shareTitle?: string
  /** Для владельца на своей странице — скрыть «Пожаловаться» */
  showReport?: boolean
}

/** Только пункты: пожаловаться, копировать, поделиться — для вставки в существующее меню */
export function EntityShareMenuItems({
  sharePath,
  reportKind,
  shareTitle,
  showReport = true,
}: EntityShareMenuItemsProps) {
  return (
    <>
      {showReport ? (
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation()
            reportEntity(reportKind)
          }}
        >
          <Flag className="mr-2 size-4" />
          Пожаловаться
        </DropdownMenuItem>
      ) : null}
      <DropdownMenuItem
        onClick={e => {
          e.stopPropagation()
          void copyEntityLink(sharePath)
        }}
      >
        <Link2 className="mr-2 size-4" />
        Копировать ссылку
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={e => {
          e.stopPropagation()
          void shareEntityLink(sharePath, shareTitle)
        }}
      >
        <Share2 className="mr-2 size-4" />
        Поделиться
      </DropdownMenuItem>
    </>
  )
}

type TriggerIcon = "horizontal" | "vertical"

export interface EntityActionsDropdownProps extends EntityShareMenuItemsProps {
  /** Горизонтальные три точки (как в модалке фото) или вертикальные (как на карточках) */
  icon?: TriggerIcon
  align?: "start" | "end" | "center"
  triggerClassName?: string
  contentClassName?: string
  /** Управляемое меню (например, чтобы подавить клик по карточке после закрытия) */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/** Кнопка «⋯» + меню: пожаловаться, копировать, поделиться */
export function EntityActionsDropdown({
  sharePath,
  reportKind,
  shareTitle,
  showReport = true,
  icon = "vertical",
  align = "end",
  triggerClassName,
  contentClassName,
  open,
  onOpenChange,
}: EntityActionsDropdownProps) {
  const Icon = icon === "horizontal" ? MoreHorizontal : MoreVertical
  const controlled = open !== undefined
  return (
    <DropdownMenu {...(controlled ? { open, onOpenChange } : {})}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className={cn("size-8 shrink-0", triggerClassName)}
          onClick={e => e.stopPropagation()}
        >
          <Icon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentClassName} onClick={e => e.stopPropagation()}>
        <EntityShareMenuItems
          sharePath={sharePath}
          reportKind={reportKind}
          shareTitle={shareTitle}
          showReport={showReport}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
