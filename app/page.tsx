"use client"

import { useAuth } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing-page"
import { ArtistProfilePage } from "@/components/artist-profile-page"
import { ProfilePage } from "@/components/profile-page"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="size-12 rounded-full" />
      </div>
    )
  }

  // Unauthenticated users see landing page
  if (!isAuthenticated) {
    return <LandingPage />
  }

  // Master users see their artist profile page (editable)
  if (user?.role === "master") {
    return <ArtistProfilePage />
  }

  // Regular users see their profile page
  return <ProfilePage />
}
