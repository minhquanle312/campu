import { generateStructuredData, StructuredDataProps } from '@/lib/metadata'

export function StructuredData(props: StructuredDataProps) {
  const structuredData = generateStructuredData(props)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
