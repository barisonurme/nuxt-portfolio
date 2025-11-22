import tailwindcss from "@tailwindcss/vite";
import { presetIcons } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  vite: {
    plugins: [  tailwindcss()]
  },

  runtimeConfig: {
    public: {
      sanityProjectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID,
      sanityDataset: process.env.NUXT_PUBLIC_SANITY_DATASET,
    }
  },

  modules: [
    '@unocss/nuxt',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  css: ['./app/assets/css/main.css'],

unocss: {
  presets: [
    presetIcons({
      collections: {
        custom: FileSystemIconLoader(
          './assets/icons',
          svg => {
            console.log('Loading SVG...'); // This will show in terminal
            return svg.replace(/^<svg /, '<svg fill="currentColor" ')
          }
        )
      }
    })
  ]
}
});
