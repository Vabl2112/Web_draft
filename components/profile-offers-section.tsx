"use client"

import { useMemo, useState } from "react"
import { CatalogOfferCard } from "@/components/catalog-offer-card"
import { ListingKindSwitch, type ListingKindValue } from "@/components/listing-kind-switch"
import { ProductEditor } from "@/components/product-editor"
import { ServiceEditor } from "@/components/service-editor"
import type { Service } from "@/lib/types"
import type { CatalogOfferItem } from "@/lib/types"
import { profileProductToCatalogOffer, profileServiceToCatalogOffer } from "@/lib/catalog-listing"

type ProfileProduct = {
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
  seller: { id: string; name: string; avatar: string }
}

interface ProfileOffersSectionProps {
  artist: { id: string; name: string; avatar: string }
  services: Service[]
  products: ProfileProduct[]
  showServices: boolean
  showProducts: boolean
  isOwner?: boolean
  onEditProduct?: (product: ProfileProduct) => void
  onDeleteProduct?: (id: string) => void
  onEditService?: (service: Service) => void
  onDeleteService?: (id: string) => void
}

export function ProfileOffersSection({
  artist,
  services,
  products,
  showServices,
  showProducts,
  isOwner,
  onEditProduct,
  onDeleteProduct,
  onEditService,
  onDeleteService,
}: ProfileOffersSectionProps) {
  const [typeFilter, setTypeFilter] = useState<ListingKindValue>("all")
  const [productEditorOpen, setProductEditorOpen] = useState(false)
  const [serviceEditorOpen, setServiceEditorOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProfileProduct | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const items: CatalogOfferItem[] = useMemo(() => {
    const out: CatalogOfferItem[] = []
    if (showServices) {
      out.push(...services.map(s => profileServiceToCatalogOffer(s, artist)))
    }
    if (showProducts) {
      out.push(...products.map(p => profileProductToCatalogOffer(p, artist)))
    }
    return out
  }, [artist, services, products, showServices, showProducts])

  const filtered = useMemo(() => {
    if (typeFilter === "all") return items
    return items.filter(i => i.kind === typeFilter)
  }, [items, typeFilter])

  const openProductEditor = (p: ProfileProduct) => {
    setEditingProduct(p)
    setProductEditorOpen(true)
  }

  const openServiceEditor = (s: Service) => {
    setEditingService(s)
    setServiceEditorOpen(true)
  }

  if (!showServices && !showProducts) {
    return null
  }

  return (
    <div>
      <ListingKindSwitch
        value={typeFilter}
        onChange={setTypeFilter}
        disableProducts={!showProducts}
        disableServices={!showServices}
        stretch
        className="mb-4 w-full"
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          {items.length === 0
            ? "Пока нет товаров и услуг"
            : "Нет предложений для выбранного типа — смените фильтр"}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(item => {
            const profileProduct =
              item.kind === "product" ? products.find(p => p.id === item.id) : undefined
            const profileService =
              item.kind === "service" ? services.find(s => s.id === item.id) : undefined

            return (
              <CatalogOfferCard
                key={`${item.kind}-${item.id}`}
                item={item}
                viewMode="grid"
                hideSellerRow
                profileOwner={
                  isOwner
                    ? {
                        onEdit: () => {
                          if (item.kind === "product" && profileProduct) openProductEditor(profileProduct)
                          if (item.kind === "service" && profileService) openServiceEditor(profileService)
                        },
                        onDelete:
                          item.kind === "product"
                            ? onDeleteProduct
                              ? () => onDeleteProduct(item.id)
                              : undefined
                            : onDeleteService
                              ? () => onDeleteService(item.id)
                              : undefined,
                        deleteTitle: item.kind === "product" ? "Удалить товар?" : "Удалить услугу?",
                        deleteDescription:
                          item.kind === "product"
                            ? "Товар будет удалён из профиля."
                            : "Услуга будет удалена из профиля.",
                      }
                    : undefined
                }
              />
            )
          })}
        </div>
      )}

      <ProductEditor
        mode="edit"
        open={productEditorOpen}
        onOpenChange={open => {
          setProductEditorOpen(open)
          if (!open) setEditingProduct(null)
        }}
        initialData={
          editingProduct
            ? {
                ...editingProduct,
                images: editingProduct.images.map((url, i) => ({ id: String(i), url })),
              }
            : undefined
        }
        onSave={data => {
          if (!editingProduct) return
          onEditProduct?.({
            ...editingProduct,
            ...data,
            images: data.images.map(img => img.url),
          })
          setProductEditorOpen(false)
          setEditingProduct(null)
        }}
      />

      <ServiceEditor
        mode="edit"
        open={serviceEditorOpen}
        onOpenChange={open => {
          setServiceEditorOpen(open)
          if (!open) setEditingService(null)
        }}
        initialData={
          editingService
            ? {
                ...editingService,
                images: editingService.images?.map((url, i) => ({ id: String(i), url })) ?? [],
              }
            : undefined
        }
        onSave={data => {
          if (!editingService) return
          onEditService?.({
            ...editingService,
            ...data,
            images: data.images?.map(img => img.url),
          })
          setServiceEditorOpen(false)
          setEditingService(null)
        }}
      />
    </div>
  )
}
