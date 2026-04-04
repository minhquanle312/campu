import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Trip from '@/models/Trip'
import '@/models/Province'
import '@/models/User'
import { mapTripDocToViewModel } from '@/lib/trip-mapper'
import { createTripSchema } from '@/lib/validations/trip'

export async function GET() {
  await dbConnect()

  const trips = await Trip.find({})
    .populate('province_id', '-_id')
    .populate('participant_ids', '-_id')
    .lean()

  const formatted = trips.map(mapTripDocToViewModel)
  return NextResponse.json(formatted)
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_USER_EMAIL.includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

  const validationResult = createTripSchema.safeParse(body)

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
  const trip = await Trip.create(validationResult.data)

  const populated = await Trip.findById(trip._id)
    .populate('province_id')
    .populate('participant_ids', '-_id')
    .lean()

  return NextResponse.json(mapTripDocToViewModel(populated), { status: 201 })
}
