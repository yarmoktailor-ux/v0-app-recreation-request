import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  variable: '--font-cairo'
});

export const metadata: Metadata = {
  title: 'اليرموك - خياطة وتفصيل',
  description: 'تطبيق إدارة مقاسات الخياطة والتفصيل',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#d4af37',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
