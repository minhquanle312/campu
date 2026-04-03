import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import { createImageKitHomepageUploadAuth } from '@/lib/imagekit-server'

export async function GET() {
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

  return NextResponse.json(createImageKitHomepageUploadAuth())
}
