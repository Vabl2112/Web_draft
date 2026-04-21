"use client"

import { useState } from "react"
import { Plus, Save, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface PortfolioItemEditorProps {
  mode: "add" | "edit"
  initialData?: {
    id?: string
    title: string
    description?: string
    images: { id: string; url: string }[]
  }
  onSave: (data: {
    id?: string
    title: string
    description?: string
    images: { id: string; url: string }[]
  }) => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PortfolioItemEditor({ 
  mode = "add", 
  initialData,
  onSave,
  trigger,
  open: controlledOpen,
  onOpenChange
}: PortfolioItemEditorProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  // Use controlled or uncontrolled mode
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value)
    } else {
      setInternalOpen(value)
    }
  }
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [images, setImages] = useState<{ id: string; url: string }[]>(
    initialData?.images || []
  )

  const handleSave = () => {
    if (!title.trim() || images.length === 0) return
    
    onSave({
      id: initialData?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      images,
    })
    
    // Reset form if adding new
    if (mode === "add") {
      setTitle("")
      setDescription("")
      setImages([])
    }
    
    setIsOpen(false)
  }

  const handleAddImage = () => {
    // Placeholder - in real app, open file picker
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
      Добавить работу
    </Button>
  ) : (
    <Button variant="ghost" size="sm">
      Редактировать
    </Button>
  )

  const isControlled = controlledOpen !== undefined
  const showDialogTrigger = !isControlled || trigger != null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {showDialogTrigger && (
        <DialogTrigger asChild>
          {trigger ?? defaultTrigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Добавить в портфолио" : "Редактировать работу"}
          </DialogTitle>
          <DialogDescription>
            Загрузите фотографии и добавьте описание работы
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Images */}
          <div className="space-y-3">
            <Label>Фотографии</Label>
            <SortableImageList
              images={images}
              onReorder={handleReorderImages}
              onRemove={handleRemoveImage}
              onAdd={handleAddImage}
              maxImages={10}
            />
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <Label>Название работы</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="например: Японский дракон"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label>Описание (необязательно)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите о работе..."
              className="min-h-20 resize-none"
              maxLength={300}
            />
            <p className="text-xs text-right text-muted-foreground">
              {description.length}/300
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim() || images.length === 0}
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
