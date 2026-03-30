import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navigation } from '@/components/navigation'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: '--font-sans',
  weight: ['400', '500', '700']
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  variable: '--font-serif',
  weight: ['400', '600', '700']
});

export const metadata: Metadata = {
  title: '2年D組 先生へのメッセージ',
  description: '佐土原高校 情報技術科 2年D組より、甲斐先生・木下先生への感謝のメッセージ',
  generator: 'v0.app',
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

export const viewport: Viewport = {
  themeColor: '#fdf2f8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable} font-sans antialiased`}>
        <Navigation />
        <div className="pt-16">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
