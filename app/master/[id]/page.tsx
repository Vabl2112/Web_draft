import { ArtistProfilePage } from "@/components/artist-profile-page"

export const metadata = {
  title: "Профиль мастера - EGG",
  description: "Страница профиля тату-мастера",
}

export default async function MasterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ArtistProfilePage masterId={id} />
}
