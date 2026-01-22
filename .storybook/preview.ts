import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/en',
        query: {},
      },
    },
    options: {
      storySort: (a, b) => {
        const idA = (a.id ?? a.title ?? '').toLowerCase()
        const idB = (b.id ?? b.title ?? '').toLowerCase()
        if (idA.startsWith('introduction')) return -1
        if (idB.startsWith('introduction')) return 1
        return idA.localeCompare(idB)
      },
    },
  },
}

export default preview
