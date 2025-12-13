import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  vite: {
    plugins: [ svgLoader(), tailwindcss(),]
  },

  runtimeConfig: {
    /* Captcha */
    captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,  

    public: {
      /* Sanity */
      sanityProjectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID,
      sanityDataset: process.env.NUXT_PUBLIC_SANITY_DATASET,

      /* Firebase */
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,

      /* Captcha */
      captchaSiteKey: process.env.NUXT_PUBLIC_CAPTCHA_SITE_KEY,
      /* Site */
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://barisonurme.com'
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    'nuxt-toast',
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Barış Önurme',
      titleTemplate: '%s | Barış Önurme',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: 'Portfolio of Barış Önurme — developer & designer.' },
        { name: 'theme-color', content: '#ffffff' },
        { property: 'og:site_name', content: 'Barış Önurme' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://barisonurme.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'sitemap', href: '/api/sitemap' }
      ]
    }
  },
  css: ['./app/assets/css/main.css'],

  

});
