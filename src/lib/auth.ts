import { betterAuth } from 'better-auth'
import { customSession } from 'better-auth/plugins'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'

export const auth = betterAuth({
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    customSession(async ({ session, user }) => ({
      session,
      user: {
        ...user,
        isAdmin: Boolean(user.email && ADMIN_USER_EMAIL.includes(user.email)),
      },
    })),
  ],
})
