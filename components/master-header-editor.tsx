"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Plus, Save, Settings, Upload, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"

interface MasterHeaderEditorProps {
  initialData?: {
    name: string
    title: string
    avatar: string
    bio: string
    tags: string[]
    location: string
    metro: string
  }
  onSave?: (data: {
    name: string
    title: string
    avatar: string
    bio: string
    tags: string[]
    location: string
    metro: string
  }) => void
}

export function MasterHeaderEditor({ initialData, onSave }: MasterHeaderEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const [name, setName] = useState(initialData?.name || "")
  const [title, setTitle] = useState(initialData?.title || "")
  const [avatar, setAvatar] = useState(initialData?.avatar || "")
  const [bio, setBio] = useState(initialData?.bio || "")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [location, setLocation] = useState(initialData?.location || "")
  const [metro, setMetro] = useState(initialData?.metro || "")
  const [newTag, setNewTag] = useState("")
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
  
  const handleSave = async () => {
    const data = { name, title, avatar, bio, tags, location, metro }
    onSave?.(data)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="size-4" />
          Редактировать профиль
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Редактирование профиля</SheetTitle>
          <SheetDescription>
            Настройте основную информацию о себе
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="size-24 ring-2 ring-border">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="text-2xl">{name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 size-8 rounded-full shadow-md"
              >
                <Camera className="size-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="size-4" />
              Загрузить фото
            </Button>
          </div>
          
          <Separator />
          
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Имя</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Специализация</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="например: Тату-мастер, Художник"
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Location */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Город</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Москва"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Метро / Район</Label>
              <Input
                value={metro}
                onChange={(e) => setMetro(e.target.value)}
                placeholder="м. Бауманская"
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Bio */}
          <div className="space-y-2">
            <Label>О себе</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Расскажите о себе, вашем опыте и стиле работы..."
              className="min-h-24 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-right text-muted-foreground">{bio.length}/500</p>
          </div>
          
          <Separator />
          
          {/* Tags */}
          <div className="space-y-3">
            <Label>Теги и стили</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
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
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Добавить тег..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button variant="outline" onClick={handleAddTag}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Отмена</Button>
          </SheetClose>
          <Button onClick={handleSave} className="gap-2">
            <Save className="size-4" />
            Сохранить
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
