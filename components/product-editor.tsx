"use client"

import { useState } from "react"
import { Plus, Save } from "lucide-react"
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

const categoryOptions = [
  { value: "accessories", label: "Аксессуары" },
  { value: "care", label: "Уход" },
  { value: "clothing", label: "Одежда" },
  { value: "art", label: "Арт-принты" },
  { value: "merch", label: "Мерч" },
  { value: "other", label: "Другое" },
]

interface ProductEditorProps {
  mode: "add" | "edit"
  initialData?: {
    id?: string
    title: string
    description: string
    price: number
    originalPrice: number | null
    category: string
    inStock: boolean
    images: { id: string; url: string }[]
  }
  onSave: (data: {
    id?: string
    title: string
    description: string
    price: number
    originalPrice: number | null
    category: string
    inStock: boolean
    images: { id: string; url: string }[]
  }) => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProductEditor({ 
  mode = "add", 
  initialData,
  onSave,
  trigger,
  open: controlledOpen,
  onOpenChange
}: ProductEditorProps) {
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
  const [price, setPrice] = useState(initialData?.price?.toString() || "")
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice?.toString() || "")
  const [category, setCategory] = useState(initialData?.category || "accessories")
  const [inStock, setInStock] = useState(initialData?.inStock ?? true)
  const [images, setImages] = useState<{ id: string; url: string }[]>(
    initialData?.images || []
  )

  const handleSave = () => {
    if (!title.trim() || !price || images.length === 0) return
    
    onSave({
      id: initialData?.id,
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      category,
      inStock,
      images,
    })
    
    // Reset form if adding new
    if (mode === "add") {
      setTitle("")
      setDescription("")
      setPrice("")
      setOriginalPrice("")
      setCategory("accessories")
      setInStock(true)
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
      Добавить товар
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
            {mode === "add" ? "Добавить товар" : "Редактировать товар"}
          </DialogTitle>
          <DialogDescription>
            Заполните информацию о товаре
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Images */}
          <div className="space-y-3">
            <Label>Фотографии товара</Label>
            <SortableImageList
              images={images}
              onReorder={handleReorderImages}
              onRemove={handleRemoveImage}
              onAdd={handleAddImage}
              maxImages={8}
            />
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <Label>Название товара</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="например: Футболка с принтом"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label>Описание</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание товара..."
              className="min-h-20 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-right text-muted-foreground">
              {description.length}/500
            </p>
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <Label>Категория</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Цена</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500"
              />
            </div>
            <div className="space-y-2">
              <Label>Старая цена (необязательно)</Label>
              <Input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="2000"
              />
            </div>
          </div>
          
          {/* In Stock */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label className="text-sm font-medium">В наличии</Label>
            <Switch
              checked={inStock}
              onCheckedChange={setInStock}
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim() || !price || images.length === 0}
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
