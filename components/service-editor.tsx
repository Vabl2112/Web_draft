"use client"

import { useState } from "react"
import { Plus, Save, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { SortableImageList } from "@/components/sortable-image-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const iconOptions = [
  { value: "pencil", label: "Карандаш" },
  { value: "clock", label: "Часы" },
  { value: "refresh", label: "Обновление" },
  { value: "star", label: "Звезда" },
  { value: "heart", label: "Сердце" },
  { value: "check", label: "Галочка" },
]

interface ServiceEditorProps {
  mode: "add" | "edit"
  initialData?: {
    id?: string
    icon: string
    title: string
    description: string
    price: string
    images?: { id: string; url: string }[]
  }
  onSave: (data: {
    id?: string
    icon: string
    title: string
    description: string
    price: string
    images?: { id: string; url: string }[]
  }) => void
  trigger?: React.ReactNode
}

export function ServiceEditor({ 
  mode = "add", 
  initialData,
  onSave,
  trigger
}: ServiceEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [icon, setIcon] = useState(initialData?.icon || "pencil")
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [price, setPrice] = useState(initialData?.price || "")
  const [showImages, setShowImages] = useState(!!initialData?.images?.length)
  const [images, setImages] = useState<{ id: string; url: string }[]>(
    initialData?.images || []
  )

  const handleSave = () => {
    if (!title.trim() || !price.trim()) return
    
    onSave({
      id: initialData?.id,
      icon,
      title: title.trim(),
      description: description.trim(),
      price: price.trim(),
      images: showImages ? images : undefined,
    })
    
    // Reset form if adding new
    if (mode === "add") {
      setIcon("pencil")
      setTitle("")
      setDescription("")
      setPrice("")
      setShowImages(false)
      setImages([])
    }
    
    setIsOpen(false)
  }

  const handleAddImage = () => {
    const newImage = {
      id: `img-${Date.now()}`,
      url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400&h=400&fit=crop`,
    }
    setImages([...images, newImage])
  }

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
  }

  const handleReorderImages = (newImages: { id: string; url: string }[]) => {
    setImages(newImages)
  }

  const defaultTrigger = mode === "add" ? (
    <Button variant="outline" size="sm" className="gap-2">
      <Plus className="size-4" />
      Добавить услугу
    </Button>
  ) : (
    <Button variant="ghost" size="sm">
      Редактировать
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Добавить услугу" : "Редактировать услугу"}
          </DialogTitle>
          <DialogDescription>
            Заполните информацию об услуге
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Icon */}
          <div className="space-y-2">
            <Label>Иконка</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <Label>Название услуги</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="например: Разработка эскиза"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание услуги..."
              className="min-h-16 resize-none"
              maxLength={200}
            />
          </div>
          
          {/* Price */}
          <div className="space-y-2">
            <Label>Цена</Label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="от 3000 ₽"
            />
          </div>
          
          {/* Optional Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Добавить фото</Label>
              </div>
              <Switch
                checked={showImages}
                onCheckedChange={setShowImages}
              />
            </div>
            
            {showImages && (
              <SortableImageList
                images={images}
                onReorder={handleReorderImages}
                onRemove={handleRemoveImage}
                onAdd={handleAddImage}
                maxImages={5}
              />
            )}
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim() || !price.trim()}
            className="gap-2"
          >
            <Save className="size-4" />
            {mode === "add" ? "Добавить" : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
