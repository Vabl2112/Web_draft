"use client"

import { useAuth } from "@/lib/auth-context"
import { HomeNewsFeed } from "@/components/home-news-feed"
import { LandingPage } from "@/components/landing-page"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="size-12 rounded-full" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <HomeNewsFeed />
  }

  return <LandingPage />
}
