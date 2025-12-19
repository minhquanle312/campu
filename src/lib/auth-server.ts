import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Get the current session from server component
 * @returns Session data or null if not authenticated
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session
}

/**
 * Get the current user from server component
 * @returns User data or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

/**
 * Require authentication - throws error if not authenticated
 * Use this to protect server actions or pages
 */
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}
