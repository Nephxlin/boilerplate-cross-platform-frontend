import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'
import createNextIntlPlugin from 'next-intl/plugin'

// Usar caminho relativo para compatibilidade com Turbopack
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  output: process.env.TAURI_ENV_TARGET ? 'export' : undefined,
  images: {
    unoptimized: process.env.TAURI_ENV_TARGET ? true : false,
  },
}

export default withNextIntl(withSerwist(nextConfig))
