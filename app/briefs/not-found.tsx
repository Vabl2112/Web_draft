import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BriefsNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-xl font-semibold">Страница не найдена</h1>
      <p className="mt-2 text-sm text-muted-foreground">Такого брифа или адреса в разделе нет.</p>
      <Button asChild className="mt-6">
        <Link href="/briefs">К списку брифов</Link>
      </Button>
    </div>
  )
}
