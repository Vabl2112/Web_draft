import { Pencil, Clock, RefreshCw } from "lucide-react"
import type { Service } from "@/lib/types"

interface ServicesCardProps {
  services: Service[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  pencil: Pencil,
  clock: Clock,
  refresh: RefreshCw,
}

export function ServicesCard({ services }: ServicesCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Услуги и цены</h2>
      <div className="flex flex-col gap-4">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon] || Pencil
          return (
            <div key={service.id} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <IconComponent className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{service.title}</p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>
              <p className="whitespace-nowrap font-semibold text-foreground">{service.price}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
