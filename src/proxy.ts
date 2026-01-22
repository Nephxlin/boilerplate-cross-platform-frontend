import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createIntlMiddleware(routing)

export const config = {
  matcher: ['/', '/(en|pt-BR)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
