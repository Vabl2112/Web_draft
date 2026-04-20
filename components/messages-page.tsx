"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  ArrowLeft, 
  MoreVertical,
  Check,
  CheckCheck,
  Trash2,
  Archive,
  Pin
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "other"
  timestamp: Date
  status: "sent" | "delivered" | "read"
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  online: boolean
  messages: Message[]
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Мария Иванова",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Здравствуйте, хотела уточнить по поводу записи на следующую неделю",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    online: true,
    messages: [
      {
        id: "m1",
        text: "Добрый день! Меня интересует татуировка в стиле минимализм",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: "read",
      },
      {
        id: "m2",
        text: "Здравствуйте! Конечно, расскажите подробнее о вашей идее",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
        status: "read",
      },
      {
        id: "m3",
        text: "Хочу небольшой цветок на запястье, примерно 3-4 см",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
        status: "read",
      },
      {
        id: "m4",
        text: "Отличный выбор! Могу предложить несколько эскизов. Когда вам удобно прийти на консультацию?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
        status: "read",
      },
      {
        id: "m5",
        text: "Здравствуйте, хотела уточнить по поводу записи на следующую неделю",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: "read",
      },
    ],
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Спасибо за работу! Очень доволен результатом",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
    online: false,
    messages: [
      {
        id: "m1",
        text: "Привет! Хочу записаться на сеанс",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        status: "read",
      },
      {
        id: "m2",
        text: "Привет! Свободные слоты есть в четверг и пятницу",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
        status: "read",
      },
      {
        id: "m3",
        text: "Спасибо за работу! Очень доволен результатом",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        status: "read",
      },
    ],
  },
  {
    id: "3",
    name: "Анна Петрова",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Когда можно записаться на коррекцию?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    unreadCount: 0,
    online: true,
    messages: [
      {
        id: "m1",
        text: "Здравствуйте! Нужна коррекция татуировки",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        status: "read",
      },
      {
        id: "m2",
        text: "Добрый день! Пришлите фото, пожалуйста",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 30),
        status: "read",
      },
      {
        id: "m3",
        text: "Когда можно записаться на коррекцию?",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        status: "read",
      },
    ],
  },
  {
    id: "4",
    name: "Игорь Новиков",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Понял, спасибо за информацию!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    unreadCount: 0,
    online: false,
    messages: [
      {
        id: "m1",
        text: "Сколько стоит рукав?",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
        status: "read",
      },
      {
        id: "m2",
        text: "Зависит от сложности, примерно от 50 000 руб. Нужна консультация",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 30),
        status: "read",
      },
      {
        id: "m3",
        text: "Понял, спасибо за информацию!",
        sender: "other",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        status: "read",
      },
    ],
  },
]

export function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [conversationsList, setConversationsList] = useState(conversations)
  const [newMessage, setNewMessage] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom()
    }
  }, [selectedConversation])

  const filteredConversations = conversationsList.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Вчера"
    } else if (days < 7) {
      return date.toLocaleDateString("ru-RU", { weekday: "short" })
    } else {
      return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
    }
  }

  const formatMessageTime = (date: Date) => {
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

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    }

    setConversationsList((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: new Date(),
            }
          : conv
      )
    )

    setSelectedConversation((prev) =>
      prev ? { ...prev, messages: [...prev.messages, message] } : null
    )

    setNewMessage("")
    setTimeout(scrollToBottom, 100)
  }

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    // Mark as read
    setConversationsList((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    )
  }

  const groupedMessages = selectedConversation?.messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, Message[]>)

  const showChatList = !isMobileView || !selectedConversation

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex flex-1 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex w-full max-w-7xl flex-1">
          {/* Conversations List */}
          {showChatList && (
            <div className={cn(
              "flex flex-col border-r border-border",
              isMobileView ? "w-full" : "w-80 shrink-0 lg:w-96"
            )}>
              {/* Search Header */}
              <div className="border-b border-border p-4">
                <h1 className="mb-4 text-xl font-bold">Сообщения</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-muted-foreground">Диалоги не найдены</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={cn(
                        "flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50",
                        selectedConversation?.id === conv.id && "bg-muted"
                      )}
                    >
                      <div className="relative">
                        <Avatar className="size-12">
                          <AvatarImage src={conv.avatar} alt={conv.name} />
                          <AvatarFallback>{conv.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-background bg-green-500" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{conv.name}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm text-muted-foreground">
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge className="flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Chat Area */}
          {(!isMobileView || selectedConversation) && (
            <div className="flex flex-1 flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      {isMobileView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedConversation(null)}
                        >
                          <ArrowLeft className="size-5" />
                        </Button>
                      )}
                      <Avatar className="size-10">
                        <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                        <AvatarFallback>{selectedConversation.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">{selectedConversation.name}</h2>
                        <p className="text-xs text-muted-foreground">
                          {selectedConversation.online ? "В сети" : "Был(а) недавно"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreVertical className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pin className="mr-2 size-4" />
                            Закрепить
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="mr-2 size-4" />
                            В архив
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 size-4" />
                            Удалить чат
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {groupedMessages && Object.entries(groupedMessages).map(([date, dateMessages]) => (
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
                              {message.sender === "other" && (
                                <Avatar className="mr-2 size-8 shrink-0">
                                  <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                                  <AvatarFallback>{selectedConversation.name.slice(0, 2)}</AvatarFallback>
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
                                  <span className="text-[10px]">{formatMessageTime(message.timestamp)}</span>
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

                  {/* Input - with safe area for mobile keyboards */}
                  <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
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
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-muted p-6">
                    <MessageSquare className="size-12 text-muted-foreground" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">Выберите диалог</h2>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Выберите диалог из списка слева, чтобы начать общение
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {!selectedConversation && <Footer />}
    </div>
  )
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
