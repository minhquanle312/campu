import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import mongoose from 'mongoose'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import {
  formatUserPayloadIssues,
  userPayloadSchema,
} from '@/lib/validations/user'
import User from '@/models/User'

type Props = {
  params: Promise<{ id: string }>
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
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
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

  const validationResult = userPayloadSchema.safeParse(body)

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid user payload',
        issues: formatUserPayloadIssues(validationResult.error),
      },
      { status: 400 },
    )
  }

  await dbConnect()

  const { name, email, avatar_url } = validationResult.data
  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      email: email || undefined,
      avatar_url: avatar_url || undefined,
    },
    { returnDocument: 'after' },
  ).lean()

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}
