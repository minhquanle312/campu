'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Heart, Map, Home } from 'lucide-react'
import { SwitchLanguage } from './switch-language'
import { signIn, useSession } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from '@/i18n/navigation'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/wish-for-pu',
    label: 'Wishes',
    icon: Heart,
  },
  {
    href: '/journey',
    label: 'Journey',
    icon: Map,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleLogin = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    })
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center px-6">
      {session ? (
        <Avatar>
          <AvatarImage
            src={session?.user?.image || ''}
            alt={session?.user?.name || 'User avatar'}
          />
          <AvatarFallback>{session?.user?.name?.[0] || '😜'}</AvatarFallback>
        </Avatar>
      ) : (
        <button onClick={handleLogin} title="Login" type="button">
          🍀
        </button>
      )}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16 gap-2">
          {navItems.map(item => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300',
                  'hover:bg-rose-50 hover:scale-105',
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200'
                    : 'text-gray-600 hover:text-rose-600',
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
      <SwitchLanguage />
    </nav>
  )
}
