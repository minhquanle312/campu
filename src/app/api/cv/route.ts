import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import CV from '@/models/CV'
import { auth } from '@/lib/auth'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { headers } from 'next/headers'
import { emptyCVData } from '@/types/cv'

export async function GET() {
  await dbConnect()
  const cv = await CV.findOne({})

  if (!cv) {
    return NextResponse.json(emptyCVData)
  }

  return NextResponse.json(cv)
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (
    !session ||
    !session.user ||
    !ADMIN_USER_EMAIL.includes(session.user.email)
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()
  const body = await request.json()

  // Find the first CV and update it, or create if it doesn't exist
  const cv = await CV.findOneAndUpdate({}, body, { new: true, upsert: true })
  return NextResponse.json(cv)
}
