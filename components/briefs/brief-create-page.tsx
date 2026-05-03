"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, GripVertical, ImagePlus, Loader2, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { authUserIdToBriefClientId } from "@/lib/briefs/auth-bridge"
import { createBrief } from "@/lib/briefs/brief-api"
import {
  BRIEF_ATTACHMENT_IMAGES_KEY,
  BRIEF_DESCRIPTION_KEY,
  BRIEF_FILTER_OTHER_ID,
  BRIEF_FILTER_PATH_KEY,
  getBriefScopeAreas,
  type BriefFilterStepAnswer,
} from "@/lib/briefs/brief-scope-tree"
import type { CategoryFilter, SubFilter } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Phase = "area" | "tree" | "description" | "extras"

const MAX_PHOTOS = 6
const MAX_IMAGE_MB = 4
const PHOTO_DRAG_MIME = "application/x-brief-photo-id"

/** Пустые и нечисловые поля → строго null (не 0). */
function parseBudget(raw: string): number | null {
  const t = raw.trim()
  if (t === "") return null
  const n = Number(t.replace(/\s/g, "").replace(",", "."))
  if (!Number.isFinite(n) || Number.isNaN(n)) return null
  return n
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error("read"))
    r.readAsDataURL(file)
  })
}

interface LocalPhoto {
  id: string
  dataUrl: string
}

function treeCompleted(area: CategoryFilter, answers: BriefFilterStepAnswer[]): boolean {
  return (
    answers.some(a => a.valueId === BRIEF_FILTER_OTHER_ID) || answers.length >= area.subFilters.length
  )
}

function descriptionValid(description: string): boolean {
  return description.trim().length >= 3
}

type WizardStep = 0 | 1 | 2 | 3

function phaseToStep(phase: Phase): WizardStep {
  if (phase === "area") return 0
  if (phase === "tree") return 1
  if (phase === "description") return 2
  return 3
}

export function BriefCreatePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const areas = useMemo(() => getBriefScopeAreas(), [])

  const [phase, setPhase] = useState<Phase>("area")
  const [area, setArea] = useState<CategoryFilter | null>(null)
  const [answers, setAnswers] = useState<BriefFilterStepAnswer[]>([])
  const [description, setDescription] = useState("")
  const [photos, setPhotos] = useState<LocalPhoto[]>([])
  const [deadline, setDeadline] = useState("")
  const [budgetMin, setBudgetMin] = useState("")
  const [budgetMax, setBudgetMax] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user) {
      router.replace("/login")
    }
  }, [authLoading, isAuthenticated, user, router])

  const currentSubFilter: SubFilter | null =
    area && phase === "tree" ? (area.subFilters[answers.length] ?? null) : null

  const canNavigateToStep = useCallback(
    (step: WizardStep): boolean => {
      if (step === 0) return true
      if (!area) return false
      if (step === 1) return true
      if (step === 2) return treeCompleted(area, answers)
      if (step === 3) return treeCompleted(area, answers) && descriptionValid(description)
      return false
    },
    [area, answers, description],
  )

  const goToWizardStep = useCallback(
    (step: WizardStep) => {
      if (!canNavigateToStep(step)) return
      if (step === phaseToStep(phase)) return
      setFormError(null)
      if (step === 0) {
        setPhase("area")
        setArea(null)
        setAnswers([])
        setDescription("")
        setPhotos([])
        setDeadline("")
        setBudgetMin("")
        setBudgetMax("")
        return
      }
      if (step === 1) {
        setPhase("tree")
        setAnswers(prev => {
          if (!area || area.subFilters.length === 0) return prev
          if (prev.some(a => a.valueId === BRIEF_FILTER_OTHER_ID)) return prev
          if (prev.length >= area.subFilters.length) return prev.slice(0, -1)
          return prev
        })
        return
      }
      if (step === 2) {
        setPhase("description")
        return
      }
      setPhase("extras")
    },
    [area, canNavigateToStep, phase],
  )

  const selectArea = (a: CategoryFilter) => {
    setFormError(null)
    setArea(a)
    setAnswers([])
    setPhase("tree")
  }

  const selectTreeOption = (sub: SubFilter, optionId: string, optionLabel: string) => {
    setFormError(null)
    const step: BriefFilterStepAnswer = {
      filterId: sub.id,
      filterLabel: sub.name,
      valueId: optionId,
      valueLabel: optionLabel,
    }
    const next = [...answers, step]
    setAnswers(next)
    const stop = optionId === BRIEF_FILTER_OTHER_ID
    const completedTree = area != null && next.length >= area.subFilters.length
    if (stop || completedTree) setPhase("description")
  }

  const handleTreeBack = () => {
    setFormError(null)
    if (answers.length === 0) {
      setArea(null)
      setPhase("area")
      return
    }
    setAnswers(a => a.slice(0, -1))
  }

  const handleDescriptionBack = () => {
    setFormError(null)
    if (!area) {
      setPhase("area")
      return
    }
    if (answers.length === 0) {
      setArea(null)
      setPhase("area")
      return
    }
    setAnswers(a => a.slice(0, -1))
    setPhase("tree")
  }

  const addPhotosFromFiles = useCallback(async (files: FileList | File[] | null) => {
    if (!files || (Array.isArray(files) && files.length === 0)) return
    const list = Array.isArray(files) ? files : Array.from(files)
    setFormError(null)
    const maxBytes = MAX_IMAGE_MB * 1024 * 1024
    const additions: LocalPhoto[] = []
    for (const file of list) {
      if (!file.type.startsWith("image/")) {
        setFormError("Можно прикреплять только изображения (JPEG, PNG, WebP, GIF).")
        continue
      }
      if (file.size > maxBytes) {
        setFormError(`Размер файла не больше ${MAX_IMAGE_MB} МБ: «${file.name}»`)
        continue
      }
      try {
        const dataUrl = await readFileAsDataUrl(file)
        additions.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, dataUrl })
      } catch {
        setFormError("Не удалось прочитать файл.")
      }
    }
    if (additions.length === 0) return
    setPhotos(prev => {
      const room = MAX_PHOTOS - prev.length
      if (room <= 0) return prev
      return [...prev, ...additions.slice(0, room)]
    })
  }, [])

  const removePhoto = (id: string) => {
    setPhotos(p => p.filter(x => x.id !== id))
  }

  const reorderPhotos = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) return
    setPhotos(prev => {
      const next = [...prev]
      const si = next.findIndex(x => x.id === sourceId)
      const ti = next.findIndex(x => x.id === targetId)
      if (si < 0 || ti < 0) return prev
      const [item] = next.splice(si, 1)
      next.splice(ti, 0, item)
      return next
    })
  }, [])

  const startPhotoDrag = useCallback((e: React.DragEvent, photoId: string) => {
    e.dataTransfer.setData(PHOTO_DRAG_MIME, photoId)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files
    void addPhotosFromFiles(f)
    e.target.value = ""
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.getData(PHOTO_DRAG_MIME)) return
    void addPhotosFromFiles(e.dataTransfer.files)
  }

  const onPhotoDrop = useCallback(
    (targetId: string) => (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const sourceId = e.dataTransfer.getData(PHOTO_DRAG_MIME)
      if (!sourceId) return
      reorderPhotos(sourceId, targetId)
    },
    [reorderPhotos],
  )

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const goDescriptionNext = () => {
    setFormError(null)
    const t = description.trim()
    if (t.length < 3) {
      setFormError("Опишите задачу подробнее (хотя бы пара слов).")
      return
    }
    setPhase("extras")
  }

  const resetWizard = () => {
    setPhase("area")
    setArea(null)
    setAnswers([])
    setDescription("")
    setPhotos([])
    setDeadline("")
    setBudgetMin("")
    setBudgetMax("")
    setFormError(null)
  }

  const handleSubmit = async () => {
    if (!user || !area) return
    const t = description.trim()
    if (t.length < 3) {
      setFormError("Заполните описание.")
      return
    }
    const stoppedAtOther = answers.some(a => a.valueId === BRIEF_FILTER_OTHER_ID)
    const filterPath = {
      areaId: area.id,
      areaLabel: area.name,
      steps: answers,
      stoppedAtOther,
    }
    const bMin = parseBudget(budgetMin)
    const bMax = parseBudget(budgetMax)
    const dl = deadline.trim()
    const imgs = photos.map(p => p.dataUrl)
    setSubmitting(true)
    setFormError(null)
    try {
      const created = await createBrief({
        clientId: authUserIdToBriefClientId(user.id),
        category: area.id,
        budgetMin: bMin,
        budgetMax: bMax,
        status: "open",
        dynamicData: {
          [BRIEF_FILTER_PATH_KEY]: filterPath,
          [BRIEF_DESCRIPTION_KEY]: t,
          ...(imgs.length > 0 ? { [BRIEF_ATTACHMENT_IMAGES_KEY]: imgs } : {}),
          deadline: dl === "" ? null : dl,
        },
      })
      router.push(`/briefs/${created.id}`)
    } catch {
      setFormError("Не удалось сохранить бриф.")
    } finally {
      setSubmitting(false)
    }
  }

  const currentStep = phaseToStep(phase)
  const descOk = descriptionValid(description)
  const treeOk = area != null && treeCompleted(area, answers)

  const footerBack =
    phase === "area"
      ? null
      : phase === "tree"
        ? { label: "Назад", onClick: handleTreeBack }
        : phase === "description"
          ? { label: "Назад", onClick: handleDescriptionBack }
          : { label: "Назад", onClick: () => setPhase("description") }

  const footerPrimary =
    phase === "area"
      ? null
      : phase === "tree"
        ? null
        : phase === "description"
          ? {
              label: "Далее",
              onClick: goDescriptionNext,
              disabled: !descOk,
            }
          : {
              label: "Опубликовать бриф",
              onClick: () => void handleSubmit(),
              disabled: submitting,
              loading: submitting,
            }

  if (authLoading || !user) {
    return (
      <div className="flex justify-center py-24 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" aria-hidden />
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-2xl flex-col pb-6">
      <Button variant="ghost" size="sm" className="mb-6 w-fit gap-2 px-0 text-muted-foreground hover:text-foreground" asChild>
        <Link href="/briefs">
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          К списку брифов
        </Link>
      </Button>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Новый бриф</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Сначала область как в каталоге, затем уточняющие фильтры. «Другое» завершает ветку — дальше опишите задачу и
            при желании прикрепите фото.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={resetWizard}>
          Начать заново
        </Button>
      </div>

      <ol className="mt-8 flex flex-wrap gap-2" aria-label="Шаги формы">
        <StepPill
          done={currentStep > 0}
          active={phase === "area"}
          label="1. Область"
          disabled={!canNavigateToStep(0)}
          onClick={() => goToWizardStep(0)}
        />
        <StepPill
          done={currentStep > 1}
          active={phase === "tree"}
          label="2. Уточнения"
          disabled={!canNavigateToStep(1)}
          onClick={() => goToWizardStep(1)}
        />
        <StepPill
          done={currentStep > 2}
          active={phase === "description"}
          label="3. Описание"
          disabled={!canNavigateToStep(2)}
          onClick={() => goToWizardStep(2)}
        />
        <StepPill
          done={false}
          active={phase === "extras"}
          label="4. Бюджет и срок"
          disabled={!canNavigateToStep(3)}
          onClick={() => goToWizardStep(3)}
        />
      </ol>

      {formError && <p className="mt-6 text-sm text-amber-600 dark:text-amber-200">{formError}</p>}

      <div className="mt-6 flex-1 space-y-6">
        {phase === "area" && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">В какой области вы ищете исполнителя?</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {areas.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => selectArea(a)}
                  className={cn(
                    "rounded-lg border border-border bg-card px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent/50",
                  )}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {phase === "tree" && area && currentSubFilter && (
          <section className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Область: {area.name}</p>
              <h2 className="text-lg font-semibold">{currentSubFilter.name}</h2>
              <p className="text-sm text-muted-foreground">Выберите один вариант.</p>
            </div>
            <div className="grid gap-2">
              {currentSubFilter.options.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => selectTreeOption(currentSubFilter, opt.id, opt.name)}
                  className={cn(
                    "rounded-lg border border-border px-4 py-3 text-left text-sm transition-colors hover:bg-accent/50",
                    opt.id === BRIEF_FILTER_OTHER_ID && "border-amber-500/40 bg-amber-500/5",
                  )}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {phase === "tree" && area && !currentSubFilter && (
          <p className="text-sm text-muted-foreground">Загрузка шага…</p>
        )}

        {phase === "description" && area && (
          <section className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground">Область: {area.name}</p>
              {answers.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {answers.map(a => (
                    <li key={`${a.filterId}-${a.valueId}`}>
                      <span className="text-foreground/80">{a.filterLabel}:</span> {a.valueLabel}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="brief-desc">Что именно нужно</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{description.length} симв.</span>
              </div>
              <div
                ref={dropRef}
                onDragOver={onDragOver}
                onDrop={onDrop}
                className={cn(
                  "overflow-hidden rounded-2xl border border-border bg-card/90 shadow-sm transition-colors",
                  "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/40",
                )}
              >
                <Textarea
                  id="brief-desc"
                  placeholder="Опишите задачу: контекст, размеры, пожелания, ссылки…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={10}
                  className={cn(
                    "resize-none border-0 bg-transparent px-4 py-3 text-sm leading-relaxed shadow-none",
                    "min-h-[220px] max-h-[320px] overflow-y-auto",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-muted-foreground/80",
                  )}
                />
                <div className="border-t border-border/70 bg-muted/25 px-4 py-3">
                  {photos.length > 0 && (
                    <>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Первое фото в ряду станет обложкой в карточке брифа в ленте. Перетащите миниатюру за ручку слева
                        или за сам снимок, чтобы изменить порядок.
                      </p>
                      <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {photos.map((p, idx) => (
                          <li
                            key={p.id}
                            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                            onDragOver={e => {
                              e.preventDefault()
                              e.dataTransfer.dropEffect = "move"
                            }}
                            onDrop={onPhotoDrop(p.id)}
                          >
                            <div
                              role="presentation"
                              draggable
                              onDragStart={e => startPhotoDrag(e, p.id)}
                              className="absolute inset-0 cursor-grab active:cursor-grabbing"
                            />
                            <Image src={p.dataUrl} alt="" fill className="pointer-events-none object-cover" sizes="120px" unoptimized />
                            {idx === 0 ? (
                              <Badge
                                variant="secondary"
                                className="pointer-events-none absolute bottom-1 left-1 border border-border/80 bg-background/90 px-1.5 py-0 text-[10px] font-medium"
                              >
                                Обложка
                              </Badge>
                            ) : null}
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon-sm"
                              draggable
                              onDragStart={e => startPhotoDrag(e, p.id)}
                              className="absolute left-1 top-1 z-10 size-7 cursor-grab rounded-md border border-border bg-background/90 shadow-sm active:cursor-grabbing"
                              aria-label="Перетащить, изменить порядок"
                              title="Перетащить"
                            >
                              <GripVertical className="size-3.5 shrink-0" aria-hidden />
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon-sm"
                              className="absolute right-1 top-1 z-10 size-7 rounded-full border border-border bg-background/90 shadow-sm"
                              onClick={() => removePhoto(p.id)}
                              onDragStart={e => e.preventDefault()}
                              aria-label="Удалить фото"
                            >
                              <X className="size-3.5 shrink-0" aria-hidden />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="size-4 shrink-0" aria-hidden />
                      Добавить фото
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      до {MAX_PHOTOS} шт., до {MAX_IMAGE_MB} МБ · файлы можно перетащить в поле описания выше
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="sr-only"
                    onChange={onFileInputChange}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {phase === "extras" && area && (
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Бюджет и срок</h2>
              <p className="text-sm text-muted-foreground">Необязательно — пустые поля бюджета сохранятся как «не указано» (null).</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bmin">Бюджет от (₽)</Label>
                <Input id="bmin" inputMode="numeric" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} placeholder="Не указано" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmax">Бюджет до (₽)</Label>
                <Input id="bmax" inputMode="numeric" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="Не указано" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dl">Желаемый срок</Label>
              <Input id="dl" placeholder="Например, до 15 июня" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
          </section>
        )}
      </div>

      <footer className="mt-8 border-t border-border/80 bg-background/95 pt-4 pb-2 backdrop-blur supports-[backdrop-filter]:bg-background/90">
        <div className="grid min-h-10 grid-cols-2 items-center gap-3">
          <div className="flex justify-start">
            {footerBack ? (
              <Button type="button" variant="outline" size="default" className="gap-2" onClick={footerBack.onClick}>
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                {footerBack.label}
              </Button>
            ) : null}
          </div>
          <div className="flex justify-end">
            {footerPrimary ? (
              <Button
                type="button"
                variant="default"
                size="default"
                disabled={footerPrimary.disabled}
                className="min-w-[8.5rem] gap-2"
                onClick={footerPrimary.onClick}
              >
                {"loading" in footerPrimary && footerPrimary.loading ? (
                  <>
                    <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                    Сохранение…
                  </>
                ) : (
                  footerPrimary.label
                )}
              </Button>
            ) : (
              <span className="min-w-[8.5rem] text-right text-sm text-muted-foreground">Выберите область выше</span>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

function StepPill({
  done,
  active,
  label,
  disabled,
  onClick,
}: {
  done: boolean
  active: boolean
  label: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <li className="list-none">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          active && "border-primary bg-primary/15 font-medium text-foreground",
          !active && done && "border-border bg-muted/50 text-foreground hover:bg-muted",
          !active && !done && "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground",
          disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
          !disabled && "cursor-pointer",
        )}
      >
        {label}
      </button>
    </li>
  )
}
