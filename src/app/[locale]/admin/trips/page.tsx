import { headers } from 'next/headers'
import { MapIcon, PencilLine, Plus } from 'lucide-react'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { Link, redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { mapTripDocToViewModel } from '@/lib/trip-mapper'
import dbConnect from '@/lib/mongodb'
import '@/models/Province'
import '@/models/User'
import Trip from '@/models/Trip'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminTripsPage({ params }: Props) {
  const { locale } = await params
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

  const tripDocs = await Trip.find({})
    .populate('province_id')
    .populate('participant_ids', '-_id')
    .sort({ date: -1 })
    .lean()

  const trips = tripDocs.map(mapTripDocToViewModel)

  return (
    <main className="space-y-6">
      <Card className="border-slate-200/80 bg-white/90 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            <MapIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Admin module
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Trips management
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-6 text-slate-500">
              Review the current trip catalog from the private admin area, then
              branch into creating a new trip or editing an existing one.
            </CardDescription>
          </div>
          <div>
            <Button asChild className="rounded-full">
              <Link href="/admin/trips/new">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create trip
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-slate-200/80 bg-white/90 shadow-sm">
        <Table className="min-w-[880px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 py-4">Title</TableHead>
              <TableHead className="px-6 py-4">Province</TableHead>
              <TableHead className="px-6 py-4">Date</TableHead>
              <TableHead className="px-6 py-4">Participants</TableHead>
              <TableHead className="px-6 py-4">Summary</TableHead>
              <TableHead className="px-6 py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map(trip => {
              const formattedDate = new Date(trip.date).toLocaleDateString(
                locale,
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                },
              )

              return (
                <TableRow key={trip.id}>
                  <TableCell className="px-6 py-4 font-medium whitespace-normal text-slate-900">
                    {trip.title}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-normal text-slate-600">
                    {trip.provinceName || 'No province'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-slate-600">
                    {formattedDate}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-slate-600">
                    {trip.participants.length}
                  </TableCell>
                  <TableCell className="px-6 py-4 max-w-md whitespace-normal text-slate-500">
                    {trip.summary}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href={`/admin/trips/${trip.id}/edit`}>
                        <PencilLine className="h-4 w-4" aria-hidden="true" />
                        Edit trip
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </main>
  )
}
