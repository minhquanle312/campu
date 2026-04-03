import JourneyClient from './journey-client'
import { generateSiteMetadata } from '@/lib/metadata'
import { Metadata } from 'next'
import dbConnect from '@/lib/mongodb'
import '@/models/Province'
import '@/models/User'
import Trip from '@/models/Trip'
import { mapTripDocToViewModel } from '@/lib/trip-mapper'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  return generateSiteMetadata({
    title: locale === 'vi' ? 'Hành trình của tôi' : 'My Journey',
    description:
      locale === 'vi'
        ? 'Khám phá những kỷ niệm khắp Việt Nam. Nhấp vào tỉnh thành được tô sáng để xem những câu chuyện.'
        : 'Explore the memories across Vietnam. Click on a highlighted province to see the stories.',
    locale,
    path: `/${locale}/journey`,
  })
}

// export const dynamic = 'force-dynamic'

export default async function Page() {
  await dbConnect()

  const dbTrips = await Trip.find({})
    .populate('province_id', '-_id')
    .populate('participant_ids', '-_id')
    .lean()

  const formattedTrips = dbTrips.map(mapTripDocToViewModel)

  return (
    <main className="container py-8 min-h-screen flex flex-col gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700">
          My Journey Map
        </h1>
        <p className="text-pink-700">
          Explore the memories across Vietnam. Click on a highlighted province
          to see the stories.
        </p>
      </div>

      <JourneyClient trips={formattedTrips} />
    </main>
  )
}
