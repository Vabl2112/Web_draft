import { Suspense } from "react"
import { CatalogPage } from "@/components/catalog-page"

export const metadata = {
  title: "Товары и услуги - EGG",
  description: "Изделия, материалы и услуги мастеров в одном каталоге",
}

export default function Products() {
  return (
    <Suspense fallback={null}>
      <CatalogPage preset="all" />
    </Suspense>
  )
}
