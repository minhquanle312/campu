import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getUploadAuthParams } from '@imagekit/next/server'

import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'

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

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
    // token: "random-token", // Optional, a unique token for request
  })

  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  })

  // return NextResponse.json(createImageKitHomepageUploadAuth())
}
