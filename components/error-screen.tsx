"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorScreenProps {
  error?: Error & { digest?: string }
  reset?: () => void
  title?: string
  description?: string
  showHomeButton?: boolean
  showBackButton?: boolean
}

export function ErrorScreen({ 
  error, 
  reset,
  title = "Что-то пошло не так",
  description = "Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.",
  showHomeButton = true,
  showBackButton = true
}: ErrorScreenProps) {
  useEffect(() => {
    // Log error to console for debugging
    if (error) {
      console.error("[v0] Error:", error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          {/* Error Icon */}
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
          
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error?.message && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-mono text-muted-foreground break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-muted-foreground">
                  ID ошибки: {error.digest}
                </p>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          {reset && (
            <Button onClick={reset} className="w-full gap-2">
              <RefreshCw className="size-4" />
              Попробовать снова
            </Button>
          )}
          
          <div className="flex w-full gap-3">
            {showBackButton && (
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="size-4" />
                Назад
              </Button>
            )}
            
            {showHomeButton && (
              <Button variant="outline" className="flex-1 gap-2" asChild>
                <Link href="/">
                  <Home className="size-4" />
                  На главную
                </Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 size-1/2 rounded-full bg-destructive/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 size-1/2 rounded-full bg-muted/50 blur-3xl" />
      </div>
    </div>
  )
}

// 404 Not Found variant
export function NotFoundScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4">
            <span className="text-8xl font-bold text-muted-foreground/30">404</span>
          </div>
          
          <CardTitle className="text-2xl">Страница не найдена</CardTitle>
          <CardDescription className="text-base">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </CardDescription>
        </CardHeader>
        
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full gap-2" asChild>
            <Link href="/">
              <Home className="size-4" />
              На главную
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="size-4" />
            Вернуться назад
          </Button>
        </CardFooter>
      </Card>
      
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 size-1/2 rounded-full bg-muted/50 blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 size-1/2 rounded-full bg-muted/30 blur-3xl" />
      </div>
    </div>
  )
}

// Network/Connection Error variant
export function ConnectionErrorScreen({ reset }: { reset?: () => void }) {
  return (
    <ErrorScreen
      title="Ошибка соединения"
      description="Не удалось подключиться к серверу. Проверьте интернет-соединение и попробуйте снова."
      reset={reset}
    />
  )
}

// Server Error variant  
export function ServerErrorScreen({ reset }: { reset?: () => void }) {
  return (
    <ErrorScreen
      title="Ошибка сервера"
      description="Сервер временно недоступен. Пожалуйста, подождите немного и попробуйте снова."
      reset={reset}
    />
  )
}
