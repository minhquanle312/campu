import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Trip from '@/models/Trip'
import TripCost from '@/models/TripCost'
import { createTripCostSchema } from '@/lib/validations/trip'
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

  const trip = await Trip.findById(id).lean()
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  const costs = await TripCost.find({ trip_id: id }).lean()

  const formatted = costs.map((cost: any) => ({
    id: cost._id.toString(),
    tripId: cost.trip_id.toString(),
    category: cost.category,
    amount: cost.amount,
    currency: cost.currency,
    note: cost.note || undefined,
  }))

  return NextResponse.json(formatted)
}

export async function POST(request: Request, { params }: Props) {
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

  const validationResult = createTripCostSchema.safeParse(body)

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid cost payload',
        issues: validationResult.error.issues.map(issue => ({
          message: issue.message,
          path: issue.path,
        })),
      },
      { status: 400 },
    )
  }

  await dbConnect()

  const trip = await Trip.findById(id).lean()
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  const cost = await TripCost.create({
    ...validationResult.data,
    trip_id: id,
  })

  return NextResponse.json(
    {
      id: cost._id.toString(),
      tripId: cost.trip_id.toString(),
      category: cost.category,
      amount: cost.amount,
      currency: cost.currency,
      note: cost.note || undefined,
    },
    { status: 201 },
  )
}
