import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cẩm Pu Portfolio Website',
    short_name: 'Cẩm Pu Blog',
    description:
      'Cẩm Pu Portfolio Website, includes blog, travel and my journey',
    start_url: '/',
    display: 'standalone',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
