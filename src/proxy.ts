import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ADMIN_USER_EMAIL } from './config/admin-user'

const handleI18nRouting = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request)

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const { user } = session || {}

  // Additional rewrite when NEW_PROFILE cookie is set
  if (response.ok) {
    // (not for errors or redirects)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, _locale, ...rest] = new URL(
      response.headers.get('x-middleware-rewrite') || request.url,
    ).pathname.split('/')
    const pathname = '/' + rest.join('/')

    if (
      pathname === '/journey/add' &&
      !ADMIN_USER_EMAIL.includes(user?.email || '')
    ) {
      return NextResponse.redirect(new URL('/journey', request.url))
    }
  }

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … `/journey/add`
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)', '/journey/add'],
}
