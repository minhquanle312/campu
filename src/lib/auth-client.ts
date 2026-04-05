import { createAuthClient } from 'better-auth/react'
import { customSessionClient } from 'better-auth/client/plugins'
import type { auth } from '@/lib/auth'

export const { signIn, signOut, useSession } = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
})
