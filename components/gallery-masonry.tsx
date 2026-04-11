"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { GalleryImage } from "@/lib/types"

interface GalleryMasonryProps {
  images: GalleryImage[]
}

export function GalleryMasonry({ images }: GalleryMasonryProps) {
  const getHeightClass = (height: "small" | "medium" | "large") => {
    switch (height) {
      case "small":
        return "h-48 md:h-56"
      case "medium":
        return "h-64 md:h-72"
      case "large":
        return "h-80 md:h-96"
      default:
        return "h-64"
    }
  }

  // Distribute images across columns for masonry effect
  const columns = [[], [], [], []] as GalleryImage[][]
  images.forEach((image, index) => {
    columns[index % 4].push(image)
  })

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-4">
          {column.map((image) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-xl ${getHeightClass(image.height)}`}
            >
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8 border-2 border-white">
                    <AvatarImage src={image.authorAvatar} />
                    <AvatarFallback className="text-xs">
                      {image.author.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-white">
                    {image.author}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
