"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ImageCarousel } from "@/components/image-carousel"
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
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EntityShareMenuItems } from "@/components/entity-share-menu"
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
  images?: string[] // Support multiple images
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
  /** Витрина на странице мастера: без дублирования автора в шапке и в описании */
  hideAuthorHeader?: boolean
  /** Витрина: без ленты комментариев, поля ввода и лишних действий — только просмотр и лайк в шапке */
  showcaseMinimal?: boolean
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
  hasNext = false,
  hideAuthorHeader = false,
  showcaseMinimal = false,
}: PhotoDetailModalProps) {
  const [comment, setComment] = useState("")
  const [localLiked, setLocalLiked] = useState(photo?.isLiked ?? false)
  const [localSaved, setLocalSaved] = useState(photo?.isSaved ?? false)
  const [localLikes, setLocalLikes] = useState(photo?.likes ?? 0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [pageShareUrl, setPageShareUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageShareUrl(window.location.href)
    }
  }, [isOpen, photo?.id])

  // Sync local state when photo changes (e.g., when navigating between photos)
  useEffect(() => {
    if (photo) {
      setLocalLiked(photo.isLiked ?? false)
      setLocalSaved(photo.isSaved ?? false)
      setLocalLikes(photo.likes ?? 0)
      setCurrentImageIndex(0)
    }
  }, [photo?.id, photo?.isLiked, photo?.isSaved, photo?.likes])

  // Get all images (support both single imageUrl and images array)
  const allImages = photo?.images?.length ? photo.images : (photo?.imageUrl ? [photo.imageUrl] : [])
  const currentImage = allImages[currentImageIndex] || photo?.imageUrl || ""
  const hasMultipleImages = allImages.length > 1

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
    <Dialog open={isOpen && !!photo} onOpenChange={() => onClose()}>
      <DialogContent className="flex h-[92vh] max-h-[92vh] w-[96vw] max-w-[96vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-[96vw] sm:rounded-xl md:max-w-[1200px] md:flex-row" showCloseButton={false}>
        <DialogTitle className="sr-only">{photo?.title || "Фото"}</DialogTitle>
        <DialogDescription className="sr-only">
          {photo?.description || `Фото работы от ${photo?.author || "мастера"}`}
        </DialogDescription>
        
          {/* Image Section */}
          <div className="relative h-[48vh] w-full overflow-hidden bg-black md:h-full md:flex-1">
            {hasMultipleImages ? (
              <ImageCarousel
                images={allImages}
                alt={photo.title}
                fillContainer
                aspectRatio="auto"
                className="h-full md:min-h-0"
                imageClassName="object-cover object-center"
                showControls={false}
                selectedIndex={currentImageIndex}
                onSlideChange={setCurrentImageIndex}
              />
            ) : (
              <Image
                src={currentImage}
                alt={photo.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, calc(100vw - 380px)"
                priority
              />
            )}

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-20 text-white hover:bg-white/20 md:hidden"
              onClick={onClose}
            >
              <X className="size-5" />
            </Button>

            {showcaseMinimal ? (
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-14 z-30 size-10 rounded-full border-0 bg-background/90 shadow-md backdrop-blur-sm md:top-2"
                onClick={handleLike}
                aria-pressed={localLiked}
                aria-label={localLiked ? "Снять лайк" : "Нравится"}
              >
                <Heart className={cn("size-5", localLiked && "fill-destructive text-destructive")} />
              </Button>
            ) : null}

            {/* Previous/Next item navigation (for gallery browsing) */}
            {!hasMultipleImages && hasPrevious && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 text-foreground hover:bg-white"
                onClick={onPrevious}
              >
                <ChevronLeft className="size-5" />
              </Button>
            )}
            
            {!hasMultipleImages && hasNext && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 text-foreground hover:bg-white"
                onClick={onNext}
              >
                <ChevronRight className="size-5" />
              </Button>
            )}
            
            {!hasMultipleImages ? (
              <button
                className="absolute inset-0 z-10 focus:outline-none"
                onDoubleClick={handleLike}
                aria-label="Double tap to like"
              />
            ) : null}
          </div>

          {/* Details Section */}
          <div className="flex h-[44vh] w-full shrink-0 flex-col border-l border-border bg-background md:h-full md:w-[380px]">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-border p-4">
              {hideAuthorHeader ? (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-foreground">{photo.title}</p>
                  <p className="text-xs text-muted-foreground">Витрина</p>
                </div>
              ) : (
                <Link
                  href={photo.authorId ? `/profile/${photo.authorId}` : "#"}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage src={photo.authorAvatar} alt={photo.author} />
                    <AvatarFallback>{photo.author.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate font-semibold hover:underline">{photo.author}</span>
                </Link>
              )}

              <div className="flex shrink-0 items-center gap-1">
                {!showcaseMinimal ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EntityShareMenuItems
                        sharePath={pageShareUrl || "/gallery"}
                        shareTitle={photo?.title}
                        reportKind="публикация на витрине"
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}

                {/* Close button - visible on desktop, hidden on mobile (mobile has one on image) */}
                <Button variant="ghost" size="icon" className="hidden md:flex" onClick={onClose}>
                  <X className="size-5" />
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* Post description */}
                {photo.description && (
                  <div className={cn("mb-4", !hideAuthorHeader && "flex gap-3")}>
                    {!hideAuthorHeader ? (
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage src={photo.authorAvatar} alt={photo.author} />
                        <AvatarFallback>{photo.author.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-sm">
                        {hideAuthorHeader ? null : (
                          <>
                            <span className="font-semibold">{photo.author}</span>{" "}
                          </>
                        )}
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

                {!showcaseMinimal ? (
                  <>
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
                  </>
                ) : null}
              </div>
            </ScrollArea>

            {/* Actions */}
            {!showcaseMinimal ? (
              <div className="border-t border-border">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleLike} className="hover:scale-110">
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
                  <Button variant="ghost" size="icon" onClick={handleSave}>
                    <Bookmark className={cn(
                      "size-6 transition-all",
                      localSaved && "fill-foreground"
                    )} />
                  </Button>
                </div>

                <div className="px-4 pb-2">
                  <p className="text-sm font-semibold">
                    {formatNumber(localLikes)} отметок «Нравится»
                  </p>
                </div>

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
            ) : null}
          </div>
      </DialogContent>
    </Dialog>
  )
}
