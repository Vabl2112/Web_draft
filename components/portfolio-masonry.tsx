"use client"

import { useState } from "react"
import Image from "next/image"
import type { PortfolioItem } from "@/lib/types"

interface PortfolioMasonryProps {
  items: PortfolioItem[]
}

export function PortfolioMasonry({ items }: PortfolioMasonryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const getHeightClass = (height: PortfolioItem["height"]) => {
    switch (height) {
      case "small":
        return "h-48 sm:h-56"
      case "medium":
        return "h-64 sm:h-72"
      case "large":
        return "h-80 sm:h-96"
      default:
        return "h-64"
    }
  }

  // Split items into columns for masonry effect
  const columns = [[], [], [], []] as PortfolioItem[][]
  items.forEach((item, index) => {
    columns[index % 4].push(item)
  })

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-3">
          {column.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-xl ${getHeightClass(item.height)}`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div
                className={`absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity duration-300 ${
                  hoveredId === item.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-sm font-medium text-white">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
