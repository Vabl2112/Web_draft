"use client"

import { useState } from "react"
import Image from "next/image"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SortableImageItemProps {
  id: string
  url: string
  onRemove: (id: string) => void
}

function SortableImageItem({ id, url, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted",
        isDragging && "z-50 ring-2 ring-primary shadow-lg"
      )}
    >
      <Image
        src={url}
        alt="Image"
        fill
        className="object-cover"
        sizes="(max-width: 640px) 33vw, 25vw"
      />
      
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 flex size-7 cursor-grab items-center justify-center rounded-md bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-background active:cursor-grabbing"
      >
        <GripVertical className="size-4 text-foreground" />
      </button>
      
      {/* Delete Button */}
      <Button
        variant="destructive"
        size="icon"
        className="absolute right-2 top-2 size-7 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => onRemove(id)}
      >
        <Trash2 className="size-3.5" />
      </Button>
      
      {/* Overlay when dragging */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10" />
      )}
    </div>
  )
}

interface SortableImageListProps {
  images: { id: string; url: string }[]
  onReorder: (images: { id: string; url: string }[]) => void
  onRemove: (id: string) => void
  onAdd: () => void
  maxImages?: number
  className?: string
}

export function SortableImageList({
  images,
  onReorder,
  onRemove,
  onAdd,
  maxImages = 10,
  className,
}: SortableImageListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)
      onReorder(arrayMove(images, oldIndex, newIndex))
    }
  }

  const canAddMore = images.length < maxImages

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((img) => img.id)}
        strategy={rectSortingStrategy}
      >
        <div className={cn("grid grid-cols-3 gap-3 sm:grid-cols-4", className)}>
          {images.map((image) => (
            <SortableImageItem
              key={image.id}
              id={image.id}
              url={image.url}
              onRemove={onRemove}
            />
          ))}
          
          {/* Add new image button */}
          {canAddMore && (
            <button
              onClick={onAdd}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-foreground/50 hover:bg-muted"
            >
              <Upload className="size-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Добавить</span>
            </button>
          )}
        </div>
      </SortableContext>
      
      {images.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Перетащите изображения для изменения порядка. Первое фото будет обложкой.
        </p>
      )}
    </DndContext>
  )
}
