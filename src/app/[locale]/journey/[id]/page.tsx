import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import Trip from '@/models/Trip'
import TripCost from '@/models/TripCost'
import '@/models/Province'
import '@/models/User'
import { mapTripDocToViewModel } from '@/lib/trip-mapper'
import { getSession } from '@/lib/auth-server'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import mongoose from 'mongoose'
import { TripDetailClient } from './_components/trip-detail-client'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { title: 'Trip Not Found' }
  }

  await dbConnect()
  const trip = await Trip.findById(id).lean()

  if (!trip) {
    return { title: 'Trip Not Found' }
  }

  return {
    title: (trip as any).title,
    description: (trip as any).summary,
    openGraph: {
      title: (trip as any).title,
      description: (trip as any).summary,
      images: (trip as any).cover_image
        ? [(trip as any).cover_image]
        : (trip as any).images?.length > 0
          ? [(trip as any).images[0]]
          : [],
    },
  }
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound()
  }

  await dbConnect()

  const [tripDoc, costDocs, session] = await Promise.all([
    Trip.findById(id)
      .populate('province_id', '-_id')
      .populate('participant_ids', '-_id')
      .lean(),
    TripCost.find({ trip_id: id }).lean(),
    getSession(),
  ])

  if (!tripDoc) {
    notFound()
  }

  const trip = mapTripDocToViewModel(tripDoc)

  const costs = costDocs.map((cost: any) => ({
    id: cost._id.toString(),
    tripId: cost.trip_id.toString(),
    category: cost.category,
    amount: cost.amount,
    currency: cost.currency,
    note: cost.note || undefined,
  }))

  const isAdmin = ADMIN_USER_EMAIL.includes(session?.user?.email || '')

  return <TripDetailClient trip={trip} costs={costs} isAdmin={isAdmin} />
}
