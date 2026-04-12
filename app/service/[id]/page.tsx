import { ServiceDetailPage } from "@/components/service-detail-page"

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ServiceDetailPage serviceId={id} />
}
