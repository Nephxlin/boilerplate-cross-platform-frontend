export interface Feature {
    slug: string
    icon: string
    url: string
    docsUrl: string
    githubUrl?: string
  }
  
  export const features: Feature[] = [
    {
      slug: 'nextjs',
      icon: '▲',
      url: 'https://nextjs.org',
      docsUrl: 'https://nextjs.org/docs',
      githubUrl: 'https://github.com/vercel/next.js',
    },
    {
      slug: 'typescript',
      icon: '📘',
      url: 'https://www.typescriptlang.org',
      docsUrl: 'https://www.typescriptlang.org/docs',
      githubUrl: 'https://github.com/microsoft/TypeScript',
    },
    {
      slug: 'tailwindcss',
      icon: '🎨',
      url: 'https://tailwindcss.com',
      docsUrl: 'https://tailwindcss.com/docs',
      githubUrl: 'https://github.com/tailwindlabs/tailwindcss',
    },
    {
      slug: 'zustand',
      icon: '🐻',
      url: 'https://zustand-demo.pmnd.rs',
      docsUrl: 'https://docs.pmnd.rs/zustand/getting-started/introduction',
      githubUrl: 'https://github.com/pmndrs/zustand',
    },
    {
      slug: 'next-intl',
      icon: '🌍',
      url: 'https://next-intl.dev',
      docsUrl: 'https://next-intl.dev/docs/getting-started',
      githubUrl: 'https://github.com/amannn/next-intl',
    },
    {
      slug: 'better-auth',
      icon: '🔐',
      url: 'https://better-auth.com',
      docsUrl: 'https://better-auth.com/docs',
      githubUrl: 'https://github.com/better-auth/better-auth',
    },
    {
      slug: 'react-hook-form',
      icon: '📝',
      url: 'https://react-hook-form.com',
      docsUrl: 'https://react-hook-form.com/get-started',
      githubUrl: 'https://github.com/react-hook-form/react-hook-form',
    },
    {
      slug: 'serwist',
      icon: '📱',
      url: 'https://serwist.pages.dev',
      docsUrl: 'https://serwist.pages.dev/docs',
      githubUrl: 'https://github.com/serwist/serwist',
    },
    {
      slug: 'tauri',
      icon: '🦀',
      url: 'https://v2.tauri.app',
      docsUrl: 'https://v2.tauri.app/start',
      githubUrl: 'https://github.com/tauri-apps/tauri',
    },
    {
      slug: 'storybook',
      icon: '📖',
      url: 'https://storybook.js.org',
      docsUrl: 'https://storybook.js.org/docs',
      githubUrl: 'https://github.com/storybookjs/storybook',
    },
    {
      slug: 'playwright',
      icon: '🎭',
      url: 'https://playwright.dev',
      docsUrl: 'https://playwright.dev/docs/intro',
      githubUrl: 'https://github.com/microsoft/playwright',
    },
  ]
  
  export function getFeatureBySlug(slug: string): Feature | undefined {
    return features.find((f) => f.slug === slug)
  }
  
  export function getAllFeatureSlugs(): string[] {
    return features.map((f) => f.slug)
  }
  