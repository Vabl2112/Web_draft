"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Image as ImageIcon, X, Check, CheckCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "artist"
  timestamp: Date
  status: "sent" | "delivered" | "read"
}

interface MessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  artist: {
    id: string
    name: string
    avatar: string
  }
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Здравствуйте! Интересует запись на татуировку.",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "read",
  },
  {
    id: "2",
    text: "Добрый день! Конечно, расскажите подробнее о вашей идее. Какой стиль и размер вы рассматриваете?",
    sender: "artist",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    status: "read",
  },
  {
    id: "3",
    text: "Хочу небольшую татуировку в стиле минимализм, примерно 5-7 см. Есть референс.",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: "read",
  },
]

export function MessageDialog({ open, onOpenChange, artist }: MessageDialogProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (open) {
      scrollToBottom()
    }
  }, [open, messages])

  const handleSend = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate status updates
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === message.id ? { ...m, status: "delivered" as const } : m))
      )
    }, 1000)

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === message.id ? { ...m, status: "read" as const } : m))
      )
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера"
    } else {
      return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
    }
  }

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check className="size-3.5 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="size-3.5 text-muted-foreground" />
      case "read":
        return <CheckCheck className="size-3.5 text-foreground" />
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, Message[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-h-[700px] flex-col gap-0 p-0 sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center gap-3 border-b border-border p-4">
          <Avatar className="size-10">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback>{artist.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <DialogTitle className="text-left text-base font-semibold">
              {artist.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Диалог с мастером {artist.name}
            </DialogDescription>
            <span className="text-xs text-muted-foreground">был(а) в сети 5 мин назад</span>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="sticky top-0 z-10 my-4 flex justify-center">
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {date}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {dateMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex max-w-[80%]",
                      message.sender === "user" ? "ml-auto" : "mr-auto"
                    )}
                  >
                    {message.sender === "artist" && (
                      <Avatar className="mr-2 size-8 shrink-0">
                        <AvatarImage src={artist.avatar} alt={artist.name} />
                        <AvatarFallback>{artist.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5",
                        message.sender === "user"
                          ? "rounded-br-md bg-foreground text-background"
                          : "rounded-bl-md bg-muted text-foreground"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1",
                          message.sender === "user" ? "text-background/70" : "text-muted-foreground"
                        )}
                      >
                        <span className="text-[10px]">{formatTime(message.timestamp)}</span>
                        {message.sender === "user" && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
              <Paperclip className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
              <ImageIcon className="size-5" />
            </Button>
            <Input
              placeholder="Написать сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
