"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  X,
  Send,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface PhotoComment {
  id: string
  author: string
  authorAvatar: string
  text: string
  timeAgo: string
  likes: number
  isLiked?: boolean
}

export interface PhotoDetail {
  id: string
  imageUrl: string
  title: string
  description?: string
  author: string
  authorAvatar: string
  authorId?: string
  likes: number
  isLiked?: boolean
  isSaved?: boolean
  comments: PhotoComment[]
  timeAgo: string
  tags?: string[]
}

interface PhotoDetailModalProps {
  photo: PhotoDetail | null
  isOpen: boolean
  onClose: () => void
  onLike?: (photoId: string) => void
  onSave?: (photoId: string) => void
  onComment?: (photoId: string, text: string) => void
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export function PhotoDetailModal({ 
  photo, 
  isOpen, 
  onClose, 
  onLike,
  onSave,
  onComment,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false
}: PhotoDetailModalProps) {
  const [comment, setComment] = useState("")
  const [localLiked, setLocalLiked] = useState(photo?.isLiked ?? false)
  const [localSaved, setLocalSaved] = useState(photo?.isSaved ?? false)
  const [localLikes, setLocalLikes] = useState(photo?.likes ?? 0)

  if (!photo) return null

  const handleLike = () => {
    setLocalLiked(!localLiked)
    setLocalLikes(localLiked ? localLikes - 1 : localLikes + 1)
    onLike?.(photo.id)
  }

  const handleSave = () => {
    setLocalSaved(!localSaved)
    onSave?.(photo.id)
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      onComment?.(photo.id, comment)
      setComment("")
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[90vh] max-w-5xl gap-0 overflow-hidden p-0 sm:rounded-xl">
        <DialogTitle className="sr-only">{photo.title}</DialogTitle>
        
        <div className="flex h-full max-h-[90vh] flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative flex flex-1 items-center justify-center bg-black">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              width={800}
              height={800}
              className="max-h-[50vh] w-full object-contain md:max-h-[90vh]"
            />
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-white hover:bg-white/20 md:hidden"
              onClick={onClose}
            >
              <X className="size-5" />
            </Button>
            
            {/* Navigation arrows */}
            {hasPrevious && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-foreground hover:bg-white"
                onClick={onPrevious}
              >
                <ChevronLeft className="size-5" />
              </Button>
            )}
            
            {hasNext && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-foreground hover:bg-white"
                onClick={onNext}
              >
                <ChevronRight className="size-5" />
              </Button>
            )}
            
            {/* Double tap to like indicator */}
            <button
              className="absolute inset-0 focus:outline-none"
              onDoubleClick={handleLike}
              aria-label="Double tap to like"
            />
          </div>

          {/* Details Section */}
          <div className="flex w-full flex-col border-l border-border bg-background md:w-96">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <Link 
                href={photo.authorId ? `/profile/${photo.authorId}` : "#"}
                className="flex items-center gap-3"
              >
                <Avatar className="size-10">
                  <AvatarImage src={photo.authorAvatar} alt={photo.author} />
                  <AvatarFallback>{photo.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold hover:underline">{photo.author}</span>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Пожаловаться</DropdownMenuItem>
                  <DropdownMenuItem>Копировать ссылку</DropdownMenuItem>
                  <DropdownMenuItem>Поделиться</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Comments Section */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* Post description */}
                {photo.description && (
                  <div className="mb-4 flex gap-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src={photo.authorAvatar} alt={photo.author} />
                      <AvatarFallback>{photo.author.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">{photo.author}</span>{" "}
                        {photo.description}
                      </p>
                      {photo.tags && photo.tags.length > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {photo.tags.map(tag => `#${tag}`).join(" ")}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">{photo.timeAgo}</p>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Comments */}
                <div className="space-y-4">
                  {photo.comments.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      Пока нет комментариев. Будьте первым!
                    </p>
                  ) : (
                    photo.comments.map((commentItem) => (
                      <div key={commentItem.id} className="flex gap-3">
                        <Avatar className="size-8 shrink-0">
                          <AvatarImage src={commentItem.authorAvatar} alt={commentItem.author} />
                          <AvatarFallback>{commentItem.author.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold">{commentItem.author}</span>{" "}
                            {commentItem.text}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{commentItem.timeAgo}</span>
                            {commentItem.likes > 0 && (
                              <span>{formatNumber(commentItem.likes)} отметок</span>
                            )}
                            <button className="font-medium hover:text-foreground">
                              Ответить
                            </button>
                          </div>
                        </div>
                        <button className="shrink-0 text-muted-foreground hover:text-destructive">
                          <Heart className={cn(
                            "size-3",
                            commentItem.isLiked && "fill-destructive text-destructive"
                          )} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="border-t border-border">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    className="hover:scale-110"
                  >
                    <Heart className={cn(
                      "size-6 transition-all",
                      localLiked && "fill-destructive text-destructive scale-110"
                    )} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="size-6" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="size-6" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                >
                  <Bookmark className={cn(
                    "size-6 transition-all",
                    localSaved && "fill-foreground"
                  )} />
                </Button>
              </div>

              {/* Likes count */}
              <div className="px-4 pb-2">
                <p className="text-sm font-semibold">
                  {formatNumber(localLikes)} отметок «Нравится»
                </p>
              </div>

              {/* Comment input */}
              <form onSubmit={handleSubmitComment} className="flex items-center gap-2 border-t border-border p-3">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Добавьте комментарий..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon"
                  disabled={!comment.trim()}
                  className="text-primary disabled:opacity-50"
                >
                  <Send className="size-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
