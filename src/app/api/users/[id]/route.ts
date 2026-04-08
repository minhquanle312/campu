import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import mongoose from 'mongoose'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

type ParsedUserPayload = {
  name: string
  email: string
  avatar_url: string
}

function parseUserPayload(body: unknown):
  | { success: true; data: ParsedUserPayload }
  | {
      success: false
      issues: Array<{ message: string; path: string[] }>
    } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      success: false,
      issues: [{ message: 'Payload must be an object', path: [] }],
    }
  }

  const payload = body as Record<string, unknown>
  const allowedKeys = ['name', 'email', 'avatar_url']
  const issues: Array<{ message: string; path: string[] }> = []

  for (const key of Object.keys(payload)) {
    if (!allowedKeys.includes(key)) {
      issues.push({ message: 'Unknown field', path: [key] })
    }
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  const avatar_url =
    typeof payload.avatar_url === 'string' ? payload.avatar_url.trim() : ''

  if (!name) {
    issues.push({ message: 'Name is required', path: ['name'] })
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    issues.push({ message: 'Invalid email', path: ['email'] })
  }

  if (avatar_url) {
    try {
      new URL(avatar_url)
    } catch {
      issues.push({ message: 'Invalid avatar URL', path: ['avatar_url'] })
    }
  }

  if (issues.length > 0) {
    return { success: false, issues }
  }

  return {
    success: true,
    data: { name, email, avatar_url },
  }
}

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

  const validationResult = parseUserPayload(body)

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid user payload',
        issues: validationResult.issues.map(issue => ({
          message: issue.message,
          path: issue.path,
        })),
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
