"use client"

import { useCallback, useMemo, useState } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileCard } from "@/components/profile-card"
import { ProfileOffersSection } from "@/components/profile-offers-section"
import { PortfolioMasonry } from "@/components/portfolio-masonry"
import { MasterReviewsDrawer } from "@/components/master-reviews-drawer"
import { CalculatorCard } from "@/components/calculator-card"
import { DynamicTabs, type TabItem } from "@/components/dynamic-tabs"
import { MasterArticlesTab } from "@/components/master-articles-tab"
import { ShowcaseKindSwitch, type ShowcaseKindFilter } from "@/components/showcase-kind-switch"
import { normalizeShowcaseKind } from "@/components/showcase-kind-badge"
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
  type PortfolioItem,
  type SectionVisibility,
} from "@/lib/types"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface ArtistProfilePageProps {
  masterId?: string
}

function ProfileSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-7 md:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <Skeleton className="mx-auto size-28 shrink-0 rounded-full sm:size-36 md:size-40 lg:mx-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48 max-w-full sm:h-10 md:h-11 md:w-64" />
              <Skeleton className="h-4 w-40 max-w-full" />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-9 w-40 rounded-full sm:w-44" />
              <Skeleton className="size-9 shrink-0 rounded-full sm:size-10" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-36" />
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-x-10">
              <Skeleton className="h-24 w-full max-w-prose" />
              <div className="space-y-2 lg:w-52">
                <Skeleton className="h-3 w-28" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-16 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row">
            <Skeleton className="h-11 w-full rounded-xl sm:w-36" />
            <Skeleton className="h-11 w-full rounded-xl sm:w-40" />
            <Skeleton className="h-11 flex-1 rounded-xl sm:max-w-[12rem]" />
          </div>
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
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const [showcaseKindFilter, setShowcaseKindFilter] = useState<ShowcaseKindFilter>("all")
  const resolvedMasterId = masterId || user?.id
  const { data, error, isLoading, mutate } = useSWR<ArtistProfile>(
    resolvedMasterId ? `/api/artist/${resolvedMasterId}` : null,
    fetcher
  )
  
  // Check if the current user is the owner of this profile
  const isOwner = isAuthenticated && (!masterId || user?.id === masterId)

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

  const openReviews = useCallback(() => setReviewsOpen(true), [])

  const vitrinaItems = useMemo(() => {
    if (!data?.portfolio) return []
    return data.portfolio.filter((p: PortfolioItem) => {
      const k = normalizeShowcaseKind(p.showcaseKind)
      if (showcaseKindFilter === "all") return true
      return k === showcaseKindFilter
    })
  }, [data?.portfolio, showcaseKindFilter])

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

      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* Profile Section */}
        <section className="pb-8 md:pb-10">
          {isLoading ? (
            <ProfileSkeleton />
          ) : data ? (
            <ProfileCard artist={data.artist} showReport={!isOwner} onOpenReviews={openReviews} />
          ) : null}
        </section>

        {/* Tabs Section */}
        <section className="border-t border-border/70 pt-8 md:pt-10">
          {(() => {
            const visibility: SectionVisibility = {
              ...DEFAULT_SECTION_VISIBILITY,
              ...data?.artist.sectionVisibility,
            }

            const allTabs: TabItem[] = [
              {
                id: "portfolio",
                label: "Витрина",
                content: (
                  <div>
                    <SectionHeader
                      title="Витрина"
                      isOwner={isOwner}
                      onAdd={
                        <PortfolioItemEditor mode="add" onSave={handleAddPortfolioItem} />
                      }
                    />
                    {data ? (
                      <div className="mb-6">
                        <ShowcaseKindSwitch
                          value={showcaseKindFilter}
                          onChange={setShowcaseKindFilter}
                          stretch
                        />
                      </div>
                    ) : null}
                    {isLoading ? (
                      <PortfolioSkeleton />
                    ) : data ? (
                      <PortfolioMasonry
                        items={vitrinaItems}
                        masterId={data.artist.id}
                        artistName={data.artist.name}
                        isOwner={isOwner}
                      />
                    ) : null}
                  </div>
                )
              },
              {
                id: "offers",
                label: "Товары и услуги",
                content: (
                  <div>
                    <SectionHeader
                      title="Товары и услуги"
                      isOwner={isOwner}
                      onAdd={
                        isOwner ? (
                          <div className="flex flex-wrap gap-2">
                            <ServiceEditor mode="add" onSave={handleAddService} />
                            <ProductEditor mode="add" onSave={handleAddProduct} />
                          </div>
                        ) : undefined
                      }
                    />
                    {data ? (
                      <ProfileOffersSection
                        artist={{
                          id: data.artist.id,
                          name: data.artist.name,
                          avatar: data.artist.avatar,
                        }}
                        services={data.services}
                        products={products}
                        showServices={visibility.services !== false}
                        showProducts={visibility.products !== false}
                        isOwner={isOwner}
                      />
                    ) : null}
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
                id: "articles",
                label: "Статьи",
                content: data ? (
                  <div>
                    <SectionHeader title="Статьи" isOwner={isOwner} />
                    <MasterArticlesTab masterId={data.artist.id} masterName={data.artist.name} />
                  </div>
                ) : null
              }
            ]

            const tabs = allTabs.filter(tab => {
              if (tab.id === "offers") {
                return visibility.services !== false || visibility.products !== false
              }
              return visibility[tab.id as keyof SectionVisibility] !== false
            })

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
      
      {data ? (
        <MasterReviewsDrawer
          open={reviewsOpen}
          onOpenChange={setReviewsOpen}
          reviews={data.reviews}
          masterName={data.artist.name}
        />
      ) : null}

      <Footer />
    </div>
  )
}

