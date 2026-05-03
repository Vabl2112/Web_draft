import type { ArticleCollaborator, ArticleCollaboratorInput, ArticleCollaboratorRole } from "./schema"

const ROLES: ReadonlySet<ArticleCollaboratorRole> = new Set(["owner", "editor", "commenter"])

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0
}

/**
 * Строго: не подтвердил участие, удалён, null — узел полностью исключается.
 * Не подставляем заглушки и не показываем «пустые» аватары.
 */
export function filterValidCollaborators(
  input: ArticleCollaboratorInput[] | null | undefined,
): ArticleCollaborator[] {
  if (!input?.length) return []

  const out: ArticleCollaborator[] = []

  for (const raw of input) {
    if (raw == null) continue
    if (raw.participationConfirmed !== true) continue
    if (!isNonEmptyString(raw.id)) continue
    if (!isNonEmptyString(raw.displayName)) continue
    if (!isNonEmptyString(raw.avatarUrl)) continue
    const role = raw.role
    if (!role || !ROLES.has(role)) continue

    out.push({
      id: raw.id.trim(),
      role,
      displayName: raw.displayName.trim(),
      avatarUrl: raw.avatarUrl.trim(),
      participationConfirmed: true,
    })
  }

  return out
}
