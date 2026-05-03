"use client"

import { Flag, Link2, MoreHorizontal, MoreVertical, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export type EntityMenuLead =
  | false
  | {
      title: string
      avatarUrl?: string
      /** Подпись над именем, напр. «Продавец» / «Автор» */
      hint?: string
    }

export interface EntityActionsDropdownProps extends EntityShareMenuItemsProps {
  /** Горизонтальные три точки (как в модалке фото) или вертикальные (как на карточках) */
  icon?: TriggerIcon
  align?: "start" | "end" | "center"
  triggerClassName?: string
  contentClassName?: string
  /** Блок над пунктами: крупный аватар и имя. `false` — не показывать (напр. витрина на странице мастера). */
  menuLead?: EntityMenuLead
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
  menuLead,
  open,
  onOpenChange,
}: EntityActionsDropdownProps) {
  const Icon = icon === "horizontal" ? MoreHorizontal : MoreVertical
  const controlled = open !== undefined
  const showLead = menuLead !== undefined && menuLead !== false
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
      <DropdownMenuContent
        align={align}
        className={cn("min-w-[14rem] p-0", contentClassName)}
        onClick={e => e.stopPropagation()}
      >
        {showLead && menuLead ? (
          <div className="flex items-center gap-3 border-b border-border px-3 py-3">
            <Avatar className="size-12 shrink-0 ring-2 ring-border/60">
              {menuLead.avatarUrl ? <AvatarImage src={menuLead.avatarUrl} alt="" /> : null}
              <AvatarFallback className="text-base font-semibold">
                {menuLead.title.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              {menuLead.hint ? (
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{menuLead.hint}</p>
              ) : null}
              <p className="truncate text-base font-semibold leading-tight text-foreground">{menuLead.title}</p>
            </div>
          </div>
        ) : null}
        <div className="p-1">
          <EntityShareMenuItems
            sharePath={sharePath}
            reportKind={reportKind}
            shareTitle={shareTitle}
            showReport={showReport}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
