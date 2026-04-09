import { notFound } from 'next/navigation'
import mongoose from 'mongoose'
import { MapIcon } from 'lucide-react'
import { headers } from 'next/headers'

import { redirect } from '@/i18n/navigation'
import dbConnect from '@/lib/mongodb'
import Trip from '@/models/Trip'
import TripCost from '@/models/TripCost'
import Province from '@/models/Province'
import '@/models/User'
import { mapTripDocToViewModel } from '@/lib/trip-mapper'
import { auth } from '@/lib/auth'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'

import { AdminPageShell } from '../../../_components/admin-page-shell'
import { EditTripForm } from '@/app/[locale]/journey/[id]/edit/_components/edit-trip-form'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

type TripCostListItem = {
  _id: mongoose.Types.ObjectId
  trip_id: mongoose.Types.ObjectId
  category: string
  amount: number
  currency: string
  note?: string | null
}

export default async function AdminEditTripPage({ params }: Props) {
  const { id, locale } = await params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound()
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (
    !session ||
    !session.user ||
    !ADMIN_USER_EMAIL.includes(session.user.email)
  ) {
    redirect({ locale, href: '/' })
  }

  await dbConnect()

  const [tripDoc, costDocs, provinceDocs] = await Promise.all([
    Trip.findById(id)
      .populate('province_id')
      .populate('participant_ids', '-_id')
      .lean(),
    TripCost.find({ trip_id: id }).lean(),
    Province.find().lean(),
  ])

  if (!tripDoc) {
    notFound()
  }

  const trip = mapTripDocToViewModel(tripDoc)

  const costs = costDocs.map((cost: TripCostListItem) => ({
    id: cost._id.toString(),
    tripId: cost.trip_id.toString(),
    category: cost.category,
    amount: cost.amount,
    currency: cost.currency,
    note: cost.note || '',
  }))

  const provinces = provinceDocs.map(p => ({
    id: p._id.toString(),
    name: p.name,
    code: p.code,
  }))

  return (
    <AdminPageShell
      badgeLabel="Trips module"
      title="Edit trip"
      description="Update this trip from within the Trips admin module so edits stay aligned with the shared shell and parent-module navigation state."
      icon={MapIcon}
      sectionTitle="Trip editing workspace"
      sectionDescription="The existing trip editor is reused below so this route keeps Trips context without introducing page-local navigation."
    >
      <EditTripForm trip={trip} provinces={provinces} costs={costs} />
    </AdminPageShell>
  )
}
