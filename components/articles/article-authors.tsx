"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ArticleCollaborator, ArticleCollaboratorInput } from "@/lib/articles/schema"
import { filterValidCollaborators } from "@/lib/articles/filter-collaborators"

const ROLE_LABEL: Record<ArticleCollaborator["role"], string> = {
  owner: "Автор",
  editor: "Редактор",
  commenter: "Комментатор",
}

export interface ArticleAuthorsProps {
  collaborators: ArticleCollaboratorInput[] | ArticleCollaborator[]
  className?: string
}

/**
 * Список соавторов: только полностью валидные и подтвердившие участие.
 */
export function ArticleAuthors({ collaborators, className }: ArticleAuthorsProps) {
  const valid = filterValidCollaborators(collaborators)

  if (valid.length === 0) return null

  return (
    <ul className={cn("flex flex-wrap gap-4", className)} aria-label="Соавторы статьи">
      {valid.map(person => (
        <li
          key={person.id}
          className="flex min-w-0 max-w-[14rem] items-center gap-3 rounded-xl border border-border/60 bg-card/80 px-3 py-2 pr-4 shadow-sm"
        >
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-border/80">
            <Image src={person.avatarUrl} alt="" fill className="object-cover" sizes="44px" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{person.displayName}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABEL[person.role]}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
