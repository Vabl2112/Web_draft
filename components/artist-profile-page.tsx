"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileCard } from "@/components/profile-card"
import { ServicesCard } from "@/components/services-card"
import { ProductsGrid } from "@/components/products-grid"
import { PortfolioMasonry } from "@/components/portfolio-masonry"
import { ReviewsCard } from "@/components/reviews-card"
import { CalculatorCard } from "@/components/calculator-card"
import { DynamicTabs, type TabItem } from "@/components/dynamic-tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MasterHeaderEditor } from "@/components/master-header-editor"
import { PortfolioItemEditor } from "@/components/portfolio-item-editor"
import { ServiceEditor } from "@/components/service-editor"
import { ProductEditor } from "@/components/product-editor"
import { CalculatorEditor } from "@/components/calculator-editor"
import { useAuth } from "@/lib/auth-context"
import type { ArtistProfile } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface ArtistProfilePageProps {
  masterId?: string
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <Skeleton className="size-36 shrink-0 rounded-full sm:size-44" />
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-16 w-full max-w-lg" />
        <Skeleton className="h-12 w-52" />
      </div>
      <div className="flex flex-col items-end gap-4">
        <Skeleton className="h-6 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function PortfolioSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton
          key={i}
          className={`rounded-xl ${i % 3 === 0 ? "h-80" : i % 3 === 1 ? "h-64" : "h-48"}`}
        />
      ))}
    </div>
  )
}

// Section Header with Add button for owners
function SectionHeader({ 
  title, 
  isOwner, 
  onAdd 
}: { 
  title: string
  isOwner: boolean
  onAdd?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {isOwner && onAdd}
    </div>
  )
}

export function ArtistProfilePage({ masterId }: ArtistProfilePageProps) {
  const { user, isAuthenticated } = useAuth()
  const { data, error, isLoading, mutate } = useSWR<ArtistProfile>(
    `/api/artist/${masterId || "1"}`, 
    fetcher
  )
  
  // Check if the current user is the owner of this profile
  const isOwner = isAuthenticated && user?.role === "master" && (!masterId || user.id === masterId)

  // Mock products data - in real app this would come from API
  const [products] = useState([
    {
      id: "1",
      title: "Картина на холсте",
      description: "Авторская работа, акрил на холсте",
      price: 15000,
      originalPrice: 18000,
      images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop"],
      category: "art",
      inStock: true,
      rating: 4.8,
      reviewsCount: 12,
      seller: { id: "1", name: "Алексей", avatar: "" }
    },
    {
      id: "2",
      title: "Набор керамической посуды",
      description: "Ручная работа, обжиг в муфельной печи",
      price: 8500,
      originalPrice: null,
      images: ["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop"],
      category: "ceramics",
      inStock: true,
      rating: 4.9,
      reviewsCount: 45,
      seller: { id: "1", name: "Алексей", avatar: "" }
    },
  ])

  // Handlers for adding/editing items
  const handleAddPortfolioItem = (item: any) => {
    console.log("[v0] Adding portfolio item:", item)
    // In real app: POST to API and mutate
  }

  const handleAddService = (service: any) => {
    console.log("[v0] Adding service:", service)
    // In real app: POST to API and mutate
  }

  const handleAddProduct = (product: any) => {
    console.log("[v0] Adding product:", product)
    // In real app: POST to API and mutate
  }

  const handleAddCalculator = (calculator: any) => {
    console.log("[v0] Adding calculator:", calculator)
    // In real app: POST to API and mutate
  }

  const handleSaveHeader = (data: any) => {
    console.log("[v0] Saving header:", data)
    // In real app: PUT to API and mutate
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Ошибка загрузки данных</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Profile Section */}
        <section className="border-b border-border pb-8">
          {isOwner && (
            <div className="mb-6 flex justify-end">
              <MasterHeaderEditor 
                initialData={data?.artist ? {
                  name: data.artist.name,
                  title: data.artist.title,
                  avatar: data.artist.avatar,
                  bio: data.artist.about,
                  tags: data.artist.tags,
                  location: data.artist.location,
                  metro: data.artist.metro,
                } : undefined}
                onSave={handleSaveHeader}
              />
            </div>
          )}
          {isLoading ? (
            <ProfileSkeleton />
          ) : data ? (
            <ProfileCard artist={data.artist} />
          ) : null}
        </section>

        {/* Tabs Section */}
        <section className="pt-6">
          {(() => {
            const tabs: TabItem[] = [
              {
                id: "portfolio",
                label: "Портфолио",
                content: (
                  <div>
                    <SectionHeader 
                      title="Работы" 
                      isOwner={isOwner}
                      onAdd={
                        <PortfolioItemEditor 
                          mode="add" 
                          onSave={handleAddPortfolioItem}
                        />
                      }
                    />
                    {isLoading ? (
                      <PortfolioSkeleton />
                    ) : data ? (
                      <PortfolioMasonry 
                        items={data.portfolio} 
                        isOwner={isOwner}
                      />
                    ) : null}
                  </div>
                )
              },
              {
                id: "services",
                label: "Услуги",
                content: (
                  <div>
                    <SectionHeader 
                      title="Услуги" 
                      isOwner={isOwner}
                      onAdd={
                        <ServiceEditor 
                          mode="add" 
                          onSave={handleAddService}
                        />
                      }
                    />
                    {data ? (
                      <ServicesCard 
                        services={data.services} 
                        isOwner={isOwner}
                      />
                    ) : null}
                  </div>
                )
              },
              {
                id: "products",
                label: "Товары",
                content: (
                  <div>
                    <SectionHeader 
                      title="Товары" 
                      isOwner={isOwner}
                      onAdd={
                        <ProductEditor 
                          mode="add" 
                          onSave={handleAddProduct}
                        />
                      }
                    />
                    <ProductsGrid 
                      products={products}
                      isOwner={isOwner}
                    />
                  </div>
                )
              },
              {
                id: "calculator",
                label: "Калькулятор",
                content: (
                  <div>
                    <SectionHeader 
                      title="Калькуляторы цен" 
                      isOwner={isOwner}
                      onAdd={
                        <CalculatorEditor 
                          mode="add" 
                          onSave={handleAddCalculator}
                        />
                      }
                    />
                    <CalculatorCard 
                      artistId={data?.artist.id} 
                      isOwner={isOwner}
                    />
                  </div>
                )
              },
              {
                id: "reviews",
                label: "Отзывы",
                content: data ? <ReviewsCard reviews={data.reviews} /> : null
              }
            ]
            return (
              <DynamicTabs 
                tabs={tabs} 
                defaultEnabled={["portfolio", "services", "products", "calculator", "reviews"]} 
              />
            )
          })()}
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
