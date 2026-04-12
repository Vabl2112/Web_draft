import { ServiceDetailPage } from "@/components/service-detail-page"

export default function ServicePage({ params }: { params: { id: string } }) {
  return <ServiceDetailPage serviceId={params.id} />
}
