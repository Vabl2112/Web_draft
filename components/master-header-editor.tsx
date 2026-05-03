"use client"

import { useEffect, useState } from "react"
import { X, Plus, Save, Upload, Camera, Link2, ChevronDown, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  DEFAULT_SECTION_VISIBILITY,
  type SectionVisibility,
} from "@/lib/types"

const SECTION_LABELS: { key: keyof SectionVisibility; label: string }[] = [
  { key: "portfolio", label: "Витрина" },
  { key: "services", label: "Услуги" },
  { key: "products", label: "Товары" },
  { key: "calculator", label: "Калькулятор" },
  { key: "articles", label: "Статьи" },
]

export interface MasterHeaderEditorSavePayload {
  name: string
  title: string
  avatar: string
  bio: string
  tags: string[]
  location: string
  metro: string
  socialLinks?: {
    vk?: string
    telegram?: string
    instagram?: string
    max?: string
    boosty?: string
    website?: string
  }
  sectionVisibility: SectionVisibility
}

interface MasterHeaderEditorProps {
  initialData?: {
    name: string
    title: string
    avatar: string
    bio: string
    tags: string[]
    location: string
    metro: string
    socialLinks?: MasterHeaderEditorSavePayload["socialLinks"]
    sectionVisibility?: SectionVisibility
  }
  onSave?: (data: MasterHeaderEditorSavePayload) => void
}

function mergeVisibility(v?: SectionVisibility): SectionVisibility {
  return { ...DEFAULT_SECTION_VISIBILITY, ...v }
}

export function MasterHeaderEditor({ initialData, onSave }: MasterHeaderEditorProps) {
  const [open, setOpen] = useState(false)

  const [name, setName] = useState(initialData?.name || "")
  const [title, setTitle] = useState(initialData?.title || "")
  const [avatar, setAvatar] = useState(initialData?.avatar || "")
  const [bio, setBio] = useState(initialData?.bio || "")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [location, setLocation] = useState(initialData?.location || "")
  const [metro, setMetro] = useState(initialData?.metro || "")
  const [newTag, setNewTag] = useState("")

  const [vk, setVk] = useState(initialData?.socialLinks?.vk || "")
  const [telegram, setTelegram] = useState(initialData?.socialLinks?.telegram || "")
  const [instagram, setInstagram] = useState(initialData?.socialLinks?.instagram || "")
  const [max, setMax] = useState(initialData?.socialLinks?.max || "")
  const [boosty, setBoosty] = useState(initialData?.socialLinks?.boosty || "")
  const [website, setWebsite] = useState(initialData?.socialLinks?.website || "")

  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(() =>
    mergeVisibility(initialData?.sectionVisibility)
  )

  useEffect(() => {
    if (!initialData) return
    setName(initialData.name)
    setTitle(initialData.title)
    setAvatar(initialData.avatar)
    setBio(initialData.bio)
    setTags(initialData.tags)
    setLocation(initialData.location)
    setMetro(initialData.metro)
    setVk(initialData.socialLinks?.vk || "")
    setTelegram(initialData.socialLinks?.telegram || "")
    setInstagram(initialData.socialLinks?.instagram || "")
    setMax(initialData.socialLinks?.max || "")
    setBoosty(initialData.socialLinks?.boosty || "")
    setWebsite(initialData.socialLinks?.website || "")
    setSectionVisibility(mergeVisibility(initialData.sectionVisibility))
  }, [initialData])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = () => {
    const socialLinks = {
      vk: vk.trim() || undefined,
      telegram: telegram.trim() || undefined,
      instagram: instagram.trim() || undefined,
      max: max.trim() || undefined,
      boosty: boosty.trim() || undefined,
      website: website.trim() || undefined,
    }
    const data: MasterHeaderEditorSavePayload = {
      name,
      title,
      avatar,
      bio,
      tags,
      location,
      metro,
      socialLinks,
      sectionVisibility,
    }
    onSave?.(data)
    setOpen(false)
  }

  const handleCancel = () => {
    if (initialData) {
      setName(initialData.name)
      setTitle(initialData.title)
      setAvatar(initialData.avatar)
      setBio(initialData.bio)
      setTags(initialData.tags)
      setLocation(initialData.location)
      setMetro(initialData.metro)
      setVk(initialData.socialLinks?.vk || "")
      setTelegram(initialData.socialLinks?.telegram || "")
      setInstagram(initialData.socialLinks?.instagram || "")
      setMax(initialData.socialLinks?.max || "")
      setBoosty(initialData.socialLinks?.boosty || "")
      setWebsite(initialData.socialLinks?.website || "")
      setSectionVisibility(mergeVisibility(initialData.sectionVisibility))
    }
    setOpen(false)
  }

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
          Редактировать профиль мастера
        </Button>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-3 max-h-[min(85vh,920px)] overflow-y-auto rounded-xl border bg-card p-5 shadow-md sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Редактирование профиля</h2>
                <p className="text-sm text-muted-foreground">
                  Видно только вам как владельцу страницы мастера
                </p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <LayoutGrid className="size-4 shrink-0" />
                <span className="text-xs">Разделы и данные</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <Label className="text-base font-medium">Отображаемые разделы</Label>
                <p className="mb-4 text-sm text-muted-foreground">
                  Выберите, какие вкладки видят посетители вашей страницы
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SECTION_LABELS.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-background px-3 py-2"
                    >
                      <span className="text-sm font-medium">{label}</span>
                      <Switch
                        checked={sectionVisibility[key]}
                        onCheckedChange={checked =>
                          setSectionVisibility(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="relative shrink-0">
                  <Avatar className="size-24 ring-2 ring-border">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="text-2xl">{name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 size-8 rounded-full shadow-md"
                  >
                    <Camera className="size-4" />
                  </Button>
                </div>
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <Upload className="size-4" />
                  Загрузить фото
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ваше имя"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Специализация</Label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="например: Тату-мастер, Художник"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Город</Label>
                  <Input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Москва"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Метро / Район</Label>
                  <Input
                    value={metro}
                    onChange={e => setMetro(e.target.value)}
                    placeholder="м. Бауманская"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>О себе</Label>
                <Textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Расскажите о себе, вашем опыте и стиле работы..."
                  className="min-h-24 resize-none"
                  maxLength={500}
                />
                <p className="text-right text-xs text-muted-foreground">{bio.length}/500</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Теги и стили</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Добавить тег..."
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Link2 className="size-4" />
                  Ссылки
                </Label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>VK</Label>
                    <Input value={vk} onChange={e => setVk(e.target.value)} placeholder="https://vk.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Telegram</Label>
                    <Input
                      value={telegram}
                      onChange={e => setTelegram(e.target.value)}
                      placeholder="https://t.me/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={instagram}
                      onChange={e => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max</Label>
                    <Input value={max} onChange={e => setMax(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Boosty</Label>
                    <Input
                      value={boosty}
                      onChange={e => setBoosty(e.target.value)}
                      placeholder="https://boosty.to/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Сайт</Label>
                    <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Отмена
              </Button>
              <Button type="button" onClick={handleSave} className="gap-2">
                <Save className="size-4" />
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
