export type Locale = 'en' | 'pt-BR'

// Re-export notification types
export * from './notification'

export interface User {
  id: string
  email: string
  name: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
}
