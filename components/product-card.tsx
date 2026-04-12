"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: string
    title: string
    description: string
    price: number
    originalPrice: number | null
    image: string
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
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount && (
          <Badge className="absolute left-3 top-3 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Badge variant="secondary" className="text-base">Нет в наличии</Badge>
          </div>
        )}
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={cn("size-4", isLiked && "fill-destructive text-destructive")} />
        </Button>
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

        {/* Seller */}
        <Link
          href={`/master/${product.seller.id}`}
          className="mt-3 flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Avatar className="size-6">
            <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
            <AvatarFallback>{product.seller.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{product.seller.name}</span>
        </Link>

        {/* Action */}
        <Button 
          className="mt-4 w-full gap-2" 
          disabled={!product.inStock}
        >
          <ShoppingCart className="size-4" />
          В корзину
        </Button>
      </div>
    </div>
  )
}
