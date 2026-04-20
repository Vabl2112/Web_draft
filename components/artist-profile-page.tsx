"use client"

import { useMemo, useState } from "react"
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
import {
  DEFAULT_SECTION_VISIBILITY,
  type ArtistProfile,
  type SectionVisibility,
} from "@/lib/types"

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
  const resolvedMasterId = masterId || user?.id
  const { data, error, isLoading, mutate } = useSWR<ArtistProfile>(
    resolvedMasterId ? `/api/artist/${resolvedMasterId}` : null,
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

  const headerEditorInitial = useMemo(() => {
    if (!data?.artist) return undefined
    const a = data.artist
    return {
      name: a.name,
      title: a.title,
      avatar: a.avatar,
      bio: a.about,
      tags: [...a.tags],
      location: a.location,
      metro: a.metro,
      socialLinks: a.socialLinks ? { ...a.socialLinks } : undefined,
      sectionVisibility: a.sectionVisibility ? { ...a.sectionVisibility } : undefined,
    }
  }, [data])

  const handleSaveHeader = (payload: {
    name: string
    title: string
    avatar: string
    bio: string
    tags: string[]
    location: string
    metro: string
    socialLinks?: ArtistProfile["artist"]["socialLinks"]
    sectionVisibility: SectionVisibility
  }) => {
    mutate((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        artist: {
          ...prev.artist,
          name: payload.name,
          title: payload.title,
          avatar: payload.avatar,
          about: payload.bio,
          tags: payload.tags,
          location: payload.location,
          metro: payload.metro,
          socialLinks: payload.socialLinks ?? prev.artist.socialLinks,
          sectionVisibility: payload.sectionVisibility,
        },
      }
    }, { revalidate: false })
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

      {isOwner && (
        <div className="border-b border-border bg-muted/20 shadow-sm">
          <div className="mx-auto max-w-6xl px-4 pb-3 pt-3">
            <MasterHeaderEditor initialData={headerEditorInitial} onSave={handleSaveHeader} />
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Profile Section */}
        <section className="border-b border-border pb-8">
          {isLoading ? (
            <ProfileSkeleton />
          ) : data ? (
            <ProfileCard artist={data.artist} />
          ) : null}
        </section>

        {/* Tabs Section */}
        <section className="pt-6">
          {(() => {
            const visibility: SectionVisibility = {
              ...DEFAULT_SECTION_VISIBILITY,
              ...data?.artist.sectionVisibility,
            }

            const allTabs: TabItem[] = [
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

            const tabs = allTabs.filter(
              tab => visibility[tab.id as keyof SectionVisibility] !== false
            )

            if (tabs.length === 0) {
              return (
                <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                  {isOwner
                    ? "Ни один раздел не отображается. Включите вкладки в «Редактировать профиль мастера»."
                    : "На этой странице пока нет разделов."}
                </p>
              )
            }

            return (
              <DynamicTabs
                key={tabs.map(t => t.id).join("-")}
                tabs={tabs}
              />
            )
          })()}
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

