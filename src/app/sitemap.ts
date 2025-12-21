import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = 'https://www.campu.love'
  const lastModified = new Date()
  const URLs = [
    '/',
    '/vi/',
    '/en/',
    '/vi/journey/',
    '/en/journey/',
    '/en/wish-for-pu/',
    '/vi/wish-for-pu/',
  ]

  return URLs.map(path => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: path.includes('journey') ? 'monthly' : 'yearly',
    priority: path === '/' || path === '/vi/' || path === '/en/' ? 1 : 0.8,
  }))
}
