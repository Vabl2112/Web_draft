import { notFound } from "next/navigation"
import { BriefDetailPage } from "@/components/briefs/brief-detail-page"

export default async function BriefByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trimmed = id.trim()
  if (!/^\d+$/.test(trimmed)) notFound()
  const n = parseInt(trimmed, 10)
  if (n < 1) notFound()
  return <BriefDetailPage briefId={n} />
}
