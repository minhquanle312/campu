import { Metadata } from 'next'

export const SITE_CONFIG = {
  name: 'Cẩm Pu',
  url: 'https://www.campu.love',
  ogImage: 'https://www.campu.love/og-image.jpg',
  description: {
    en: 'A passionate traveler exploring the hidden gems and breathtaking landscapes of Vietnam. Join me on this incredible journey of discovery, adventure, and unforgettable moments.',
    vi: 'Một người đam mê du lịch đang khám phá những viên ngọc ẩn và những phong cảnh ngoạn mục của Việt Nam. Hãy tham gia cùng tôi trong hành trình đáng kinh ngạc của sự khám phá, phiêu lưu và những khoảnh khắc không thể nào quên này.',
  },
  keywords: [
    'Vietnam travel',
    'Du lịch Việt Nam',
    'travel blog',
    'adventure',
    'photography',
    'Vietnamese destinations',
    'Cẩm Pu',
  ],
  author: 'Minh Quân Lê',
}

type MetadataProps = {
  title?: string
  description?: string
  locale?: string
  path?: string
  ogImage?: string
  noIndex?: boolean
}

export function generateSiteMetadata({
  title,
  description,
  locale = 'en',
  path = '',
  ogImage,
  noIndex = false,
}: MetadataProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name
  const pageDescription =
    description ||
    SITE_CONFIG.description[locale as keyof typeof SITE_CONFIG.description] ||
    SITE_CONFIG.description.en
  const pageUrl = `${SITE_CONFIG.url}${path}`
  const pageOgImage = ogImage || SITE_CONFIG.ogImage

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.author,
    robots: noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${SITE_CONFIG.url}/en${path.replace(/^\/[^/]+/, '')}`,
        vi: `${SITE_CONFIG.url}/vi${path.replace(/^\/[^/]+/, '')}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: pageOgImage,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageOgImage],
      creator: '@campu',
    },
    verification: {
      google: 'your-google-verification-code', // Add your Google Search Console verification
    },
  }
}

export type StructuredDataProps = {
  type: 'person' | 'article' | 'website' | 'breadcrumb'
  locale?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>
}

export function generateStructuredData({
  type,
  locale = 'en',
  data = {},
}: StructuredDataProps) {
  const baseUrl = SITE_CONFIG.url

  switch (type) {
    case 'person':
      return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: SITE_CONFIG.author,
        url: baseUrl,
        image: `${baseUrl}/for-pu/avatar.jpg`,
        description:
          locale === 'vi'
            ? 'Blogger du lịch Việt Nam'
            : 'Vietnam Travel Blogger',
        jobTitle: 'Travel Blogger',
        knowsAbout: ['Travel', 'Photography', 'Vietnam', 'Adventure'],
      }

    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: baseUrl,
        description:
          SITE_CONFIG.description[
            locale as keyof typeof SITE_CONFIG.description
          ],
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.author,
        },
        inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
      }

    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image || SITE_CONFIG.ogImage,
        datePublished: data.datePublished || new Date().toISOString(),
        dateModified: data.dateModified || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.author,
        },
        publisher: {
          '@type': 'Person',
          name: SITE_CONFIG.author,
        },
      }

    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items?.map(
          (item: { name: string; url: string }, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
          }),
        ),
      }

    default:
      return {}
  }
}
