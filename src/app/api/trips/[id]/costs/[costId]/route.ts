import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import TripCost from '@/models/TripCost'
import { updateTripCostSchema } from '@/lib/validations/trip'
import mongoose from 'mongoose'

type Props = {
  params: Promise<{ id: string; costId: string }>
}

export async function PUT(request: Request, { params }: Props) {
  const { id, costId } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_USER_EMAIL.includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(costId)
  ) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
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

  const validationResult = updateTripCostSchema.safeParse(body)

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

  const cost = await TripCost.findOneAndUpdate(
    { _id: costId, trip_id: id },
    validationResult.data,
    { returnDocument: 'after' },
  ).lean()

  if (!cost) {
    return NextResponse.json({ error: 'Cost not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: (cost as any)._id.toString(),
    tripId: (cost as any).trip_id.toString(),
    category: (cost as any).category,
    amount: (cost as any).amount,
    currency: (cost as any).currency,
    note: (cost as any).note || undefined,
  })
}

export async function DELETE(_request: Request, { params }: Props) {
  const { id, costId } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_USER_EMAIL.includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(costId)
  ) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  await dbConnect()

  const cost = await TripCost.findOneAndDelete({
    _id: costId,
    trip_id: id,
  })

  if (!cost) {
    return NextResponse.json({ error: 'Cost not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, message: 'Cost deleted' })
}
