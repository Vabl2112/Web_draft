"use client"

import { useAuth } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing-page"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="size-12 rounded-full" />
      </div>
    )
  }

  return <LandingPage />
}
