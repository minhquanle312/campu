import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import {
  formatUserPayloadIssues,
  userPayloadSchema,
} from '@/lib/validations/user'
import User from '@/models/User'

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_USER_EMAIL.includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await dbConnect()
  const users = await User.find({})
  return Response.json({ users })
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
  const user = await User.create({
    name,
    email: email || undefined,
    avatar_url: avatar_url || undefined,
  })

  return NextResponse.json(user, { status: 201 })
}
