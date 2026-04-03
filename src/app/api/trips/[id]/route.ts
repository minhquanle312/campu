import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Trip from '@/models/Trip'
import TripCost from '@/models/TripCost'
import '@/models/Province'
import '@/models/User'
import { mapTripDocToViewModel } from '@/lib/trip-mapper'
import { updateTripSchema } from '@/lib/validations/trip'
import mongoose from 'mongoose'

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid trip ID' }, { status: 400 })
  }

  await dbConnect()

  const trip = await Trip.findById(id)
    .populate('province_id', '-_id')
    .populate('participant_ids', '-_id')
    .lean()

  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  return NextResponse.json(mapTripDocToViewModel(trip))
}

export async function PUT(request: Request, { params }: Props) {
  const { id } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_USER_EMAIL.includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid trip ID' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body' },
      { status: 400 },
    )
  }

  const validationResult = updateTripSchema.safeParse(body)

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid trip payload',
        issues: validationResult.error.issues.map(issue => ({
          message: issue.message,
          path: issue.path,
        })),
      },
      { status: 400 },
    )
  }

  await dbConnect()

  const trip = await Trip.findByIdAndUpdate(id, validationResult.data, {
    new: true,
  })
    .populate('province_id', '-_id')
    .populate('participant_ids', '-_id')
    .lean()

  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  return NextResponse.json(mapTripDocToViewModel(trip))
}

export async function DELETE(_request: Request, { params }: Props) {
  const { id } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_USER_EMAIL.includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid trip ID' }, { status: 400 })
  }

  await dbConnect()

  const trip = await Trip.findByIdAndDelete(id)

  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  // Cascade delete associated trip costs
  await TripCost.deleteMany({ trip_id: id })

  return NextResponse.json({ success: true, message: 'Trip deleted' })
}
