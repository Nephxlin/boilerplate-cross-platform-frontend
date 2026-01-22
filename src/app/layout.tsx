import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Boilerplate App',
  description: 'A modern full-stack application boilerplate',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
