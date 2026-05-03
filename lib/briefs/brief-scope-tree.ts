/**
 * Дерево областей для создания брифа: верхний уровень как в объединённом каталоге,
 * вложенность — из фильтров «Услуги» / «Товары» (lib/filters-config).
 * На каждом уровне опция «Другое» (id: other) — при выборе дальнейшие шаги не показываются.
 */

import type { CategoryFilter, FilterOption, SubFilter } from "@/lib/types"
import {
  catalogFiltersConfig,
  productsFiltersConfig,
  servicesFiltersConfig,
} from "@/lib/filters-config"

export const BRIEF_FILTER_OTHER_ID = "other" as const

const OTHER_OPTION: FilterOption = { id: BRIEF_FILTER_OTHER_ID, name: "Другое" }

function appendOther(sub: SubFilter): SubFilter {
  const has = sub.options.some(o => o.id === BRIEF_FILTER_OTHER_ID)
  return {
    ...sub,
    options: has ? [...sub.options] : [...sub.options, OTHER_OPTION],
  }
}

function cloneSubFilters(subs: SubFilter[]): SubFilter[] {
  return subs.map(s =>
    appendOther({
      ...s,
      options: s.options.map(o => ({ ...o })),
    }),
  )
}

function findServiceCategory(id: string): CategoryFilter | undefined {
  return servicesFiltersConfig.categories.find(c => c.id === id)
}

function findProductCategory(id: string): CategoryFilter | undefined {
  return productsFiltersConfig.categories.find(c => c.id === id)
}

/** Синтетические ветки для зон каталога без готового дерева в услугах/товарах */
function syntheticRemoval(): SubFilter[] {
  return cloneSubFilters([
    {
      id: "removal-goal",
      name: "Задача",
      type: "single",
      options: [
        { id: "laser-session", name: "Лазерный сеанс" },
        { id: "lightening", name: "Осветление / подготовка" },
        { id: "consult-only", name: "Только консультация по удалению" },
      ],
    },
  ])
}

function syntheticConsultation(): SubFilter[] {
  return cloneSubFilters([
    {
      id: "consult-focus",
      name: "Что нужно",
      type: "single",
      options: [
        { id: "style-choice", name: "Подбор стиля / мастера" },
        { id: "sketch-review", name: "Разбор эскиза" },
        { id: "session-plan", name: "План сеансов" },
        { id: "aftercare", name: "Рекомендации по уходу" },
      ],
    },
  ])
}

/**
 * Какую ветку subFilters подставить для id верхнего уровня (как в catalogFiltersConfig + decor).
 */
function resolveSubFiltersForCatalogArea(catalogAreaId: string): SubFilter[] {
  const fromService = findServiceCategory(catalogAreaId)
  if (fromService && fromService.subFilters.length > 0) {
    return cloneSubFilters(fromService.subFilters)
  }

  const productAlias: Record<string, string> = {
    care: "tattoo-care",
    equipment: "equipment",
    jewelry: "jewelry",
    merch: "prints",
  }
  const pid = productAlias[catalogAreaId]
  if (pid) {
    const pc = findProductCategory(pid)
    if (pc && pc.subFilters.length > 0) return cloneSubFilters(pc.subFilters)
  }

  if (catalogAreaId === "removal") return syntheticRemoval()
  if (catalogAreaId === "consultation") return syntheticConsultation()

  if (catalogAreaId === "decor") {
    const prints = findProductCategory("prints")
    if (prints?.subFilters.length) return cloneSubFilters(prints.subFilters)
  }

  return cloneSubFilters([
    {
      id: "generic-detail",
      name: "Уточнение",
      type: "single",
      options: [{ id: "general", name: "Общий запрос" }],
    },
  ])
}

/** Зоны: каталог + «Декор и принты» (дерево из фильтра товаров «Принты и постеры») */
export function getBriefScopeAreas(): CategoryFilter[] {
  const base = catalogFiltersConfig.categories.map(
    (c): CategoryFilter => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      subFilters: resolveSubFiltersForCatalogArea(c.id),
    }),
  )

  const decor: CategoryFilter = {
    id: "decor",
    name: "Декор и принты",
    icon: "image",
    subFilters: resolveSubFiltersForCatalogArea("decor"),
  }

  const merchIdx = base.findIndex(c => c.id === "merch")
  if (merchIdx === -1) return [...base, decor]
  const next = [...base]
  next.splice(merchIdx, 0, decor)
  return next
}

export interface BriefFilterStepAnswer {
  filterId: string
  filterLabel: string
  valueId: string
  valueLabel: string
}

export interface BriefFilterPathPayload {
  areaId: string
  areaLabel: string
  /** Выборы по дереву; обрыв по «Другое» — последний шаг с valueId other */
  steps: BriefFilterStepAnswer[]
  stoppedAtOther: boolean
}

export const BRIEF_FILTER_PATH_KEY = "filterPath" as const
export const BRIEF_DESCRIPTION_KEY = "description" as const
/** Опциональный заголовок карточки с витрины / формы */
export const BRIEF_TITLE_KEY = "title" as const
/** data:image/... строки (мок без отдельного файлового API) */
export const BRIEF_ATTACHMENT_IMAGES_KEY = "attachmentImages" as const

export function parseBriefFilterPath(raw: unknown): BriefFilterPathPayload | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  if (typeof o.areaId !== "string" || typeof o.areaLabel !== "string") return null
  if (!Array.isArray(o.steps)) return null
  const steps: BriefFilterStepAnswer[] = []
  for (const s of o.steps) {
    if (!s || typeof s !== "object") continue
    const r = s as Record<string, unknown>
    if (
      typeof r.filterId === "string" &&
      typeof r.filterLabel === "string" &&
      typeof r.valueId === "string" &&
      typeof r.valueLabel === "string"
    ) {
      steps.push({
        filterId: r.filterId,
        filterLabel: r.filterLabel,
        valueId: r.valueId,
        valueLabel: r.valueLabel,
      })
    }
  }
  return {
    areaId: o.areaId,
    areaLabel: o.areaLabel,
    steps,
    stoppedAtOther: o.stoppedAtOther === true,
  }
}

export function formatBriefFilterPathSummary(path: BriefFilterPathPayload): string {
  const parts = [path.areaLabel, ...path.steps.map(s => s.valueLabel)]
  return parts.join(" · ")
}

export function parseBriefAttachmentImages(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is string => typeof x === "string" && x.startsWith("data:image"))
}
