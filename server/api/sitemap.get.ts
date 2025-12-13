import { setHeader } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const base = (config.public.siteUrl as string) || 'https://barisonurme.com'
  const today = new Date().toISOString().split('T')[0]

  const routes = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/works', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/', priority: '0.9', changefreq: 'weekly' }
  ]

  const urls = routes.map(r => 
    `  <url><loc>${base.replace(/\/$/, '')}${r.url}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  return xml
})
