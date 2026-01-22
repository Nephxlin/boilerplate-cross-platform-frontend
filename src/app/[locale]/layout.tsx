import type { Metadata, Viewport } from 'next'
import {  Poppins, Roboto } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/_UI/components/organisms/Header'
import '../globals.css'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
 weight: ["400", "500", "600", "700"],
   variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: 'Boilerplate App',
  description: 'A modern full-stack application boilerplate',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Boilerplate App',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${roboto.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
