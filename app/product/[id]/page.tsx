import { ProductDetailPage } from "@/components/product-detail-page"

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailPage productId={params.id} />
}
