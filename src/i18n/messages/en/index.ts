import common from './common.json'
import auth from './auth.json'
import validation from './validation.json'
import home from './home.json'
import notifications from './notifications.json'
import featuresIndex from './features/index.json'
import nextjs from './features/nextjs.json'
import typescript from './features/typescript.json'
import tailwindcss from './features/tailwindcss.json'
import zustand from './features/zustand.json'
import nextIntl from './features/next-intl.json'
import betterAuth from './features/better-auth.json'
import reactHookForm from './features/react-hook-form.json'
import serwist from './features/serwist.json'
import tauri from './features/tauri.json'
import storybook from './features/storybook.json'
import playwright from './features/playwright.json'

const messages = {
  common,
  auth,
  validation,
  home,
  notifications,
  features: {
    ...featuresIndex,
    nextjs,
    typescript,
    tailwindcss,
    zustand,
    'next-intl': nextIntl,
    'better-auth': betterAuth,
    'react-hook-form': reactHookForm,
    serwist,
    tauri,
    storybook,
    playwright,
  },
}

export default messages
