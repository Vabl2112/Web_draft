import { Header } from "@/components/header"

export default function BriefsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-8">{children}</div>
    </div>
  )
}
