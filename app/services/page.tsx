import { Suspense } from "react"
import { CatalogPage } from "@/components/catalog-page"

export const metadata = {
  title: "Услуги - EGG",
  description: "Услуги мастеров — тот же каталог с фильтром по типу",
}

export default function Services() {
  return (
    <Suspense fallback={null}>
      <CatalogPage preset="services" />
    </Suspense>
  )
}
