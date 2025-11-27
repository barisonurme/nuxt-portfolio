import { setHeader } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const base = (config.public.siteUrl as string) || 'https://barisonurme.com'

  const routes = ['/', '/about', '/works', '/contact', '/blog/']

  const urls = routes.map(r => `  <url><loc>${base.replace(/\/$/, '')}${r}</loc><changefreq>monthly</changefreq></url>`).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  return xml
})
