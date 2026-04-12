"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalculatorBuilder } from "@/components/calculator-builder"

export default function CalculatorBuilderPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <CalculatorBuilder />
      </main>
      <Footer />
    </div>
  )
}
