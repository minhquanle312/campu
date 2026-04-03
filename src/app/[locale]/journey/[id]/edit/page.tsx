import { redirect } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import Trip from '@/models/Trip'
import TripCost from '@/models/TripCost'
import '@/models/Province'
import '@/models/User'
import { mapTripDocToViewModel } from '@/lib/trip-mapper'
import { getSession } from '@/lib/auth-server'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import mongoose from 'mongoose'
import { notFound } from 'next/navigation'
import { EditTripForm } from './_components/edit-trip-form'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditTripPage({ params }: Props) {
  const { id, locale } = await params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound()
  }

  const session = await getSession()
  const isAdmin = ADMIN_USER_EMAIL.includes(session?.user?.email || '')

  if (!isAdmin) {
    redirect(`/${locale}/journey/${id}`)
  }

  await dbConnect()

  const [tripDoc, costDocs] = await Promise.all([
    Trip.findById(id)
      .populate('province_id', '-_id')
      .populate('participant_ids', '-_id')
      .lean(),
    TripCost.find({ trip_id: id }).lean(),
  ])

  if (!tripDoc) {
    notFound()
  }

  const trip = mapTripDocToViewModel(tripDoc)
  const rawTrip = JSON.parse(JSON.stringify(tripDoc))

  const costs = costDocs.map((cost: any) => ({
    id: cost._id.toString(),
    tripId: cost.trip_id.toString(),
    category: cost.category,
    amount: cost.amount,
    currency: cost.currency,
    note: cost.note || '',
  }))

  return (
    <main className="container py-8 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Trip</h1>
      <EditTripForm trip={trip} rawTrip={rawTrip} costs={costs} />
    </main>
  )
}
