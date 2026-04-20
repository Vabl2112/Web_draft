import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import './globals.css'

/**
 * Один источник правды для текста: переменная на <html>, на <body> только Tailwind font-sans
 * (см. app/globals.css --font-sans → var(--font-sans-app)). Так избегаем конфликта className + font-sans
 * и поломанной кириллицы из-за fallback-метрик.
 */
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans-app',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono-app',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
}

export const metadata: Metadata = {
  title: 'EGG - Платформа для творческих людей',
  description: 'Маркетплейс для художников, мастеров и ремесленников. Продавайте свои работы, услуги и товары ручной работы',
  generator: 'v0.app',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EGG',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className={cn(inter.variable, geistMono.variable)}>
      <body className={cn('font-sans antialiased')} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
