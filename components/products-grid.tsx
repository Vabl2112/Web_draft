"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ShoppingCart, Heart, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageCarousel } from "@/components/image-carousel"
import { ProductEditor } from "@/components/product-editor"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  images: string[]
  category: string
  inStock: boolean
  rating: number
  reviewsCount: number
  seller: {
    id: string
    name: string
    avatar: string
  }
}

interface ProductsGridProps {
  products: Product[]
  isOwner?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (id: string) => void
}

function ProductCard({ 
  product, 
  isOwner,
  onEdit,
  onDelete
}: { 
  product: Product
  isOwner?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (id: string) => void
}) {
  const [isLiked, setIsLiked] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg">
      {/* Image Carousel */}
      <div className="relative">
        <ImageCarousel
          images={product.images}
          alt={product.title}
          aspectRatio="square"
          className="rounded-none rounded-t-2xl"
        />
        
        {discount && (
          <Badge className="absolute left-3 top-3 z-10 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Badge variant="secondary" className="text-base">Нет в наличии</Badge>
          </div>
        )}
        
        {/* Like button */}
        {!isOwner && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-3 z-10 size-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("size-4", isLiked && "fill-destructive text-destructive")} />
          </Button>
        )}
        
        {/* Actions menu for owner */}
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute right-3 top-3 z-10 size-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit2 className="mr-2 size-4" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Edit dialog */}
        <ProductEditor
          mode="edit"
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          initialData={{
            ...product,
            images: product.images.map((url, i) => ({ id: String(i), url }))
          }}
          onSave={(data) => {
            onEdit?.({ 
              ...product, 
              ...data, 
              images: data.images.map(img => img.url) 
            })
            setEditDialogOpen(false)
          }}
        />

        {/* Delete confirmation dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Товар будет удален из вашего профиля.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete?.(product.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-foreground">
          {product.title}
        </h3>
        
        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviewsCount})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            {product.price.toLocaleString("ru-RU")} &#8381;
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice.toLocaleString("ru-RU")} &#8381;
            </span>
          )}
        </div>

        {/* Action */}
        {!isOwner && (
          <Button 
            className="mt-4 w-full gap-2" 
            disabled={!product.inStock}
          >
            <ShoppingCart className="size-4" />
            В корзину
          </Button>
        )}
      </div>
    </div>
  )
}

export function ProductsGrid({ 
  products, 
  isOwner,
  onEdit,
  onDelete
}: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Товаров пока нет</p>
        {isOwner && (
          <p className="mt-1 text-sm text-muted-foreground">
            Добавьте первый товар, нажав кнопку выше
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isOwner={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
