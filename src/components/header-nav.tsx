'use client'

import { useState } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { signIn, useSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import {
  Compass,
  FileText,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  MapIcon,
  Menu,
  Sparkles,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SwitchLanguage } from './switch-language'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

const navItems = [
  {
    href: '/',
    labelKey: 'Home',
    icon: Home,
  },
  {
    href: '/wish-for-pu',
    labelKey: 'Wishes',
    icon: Heart,
  },
  {
    href: '/journey',
    labelKey: 'Journey',
    icon: MapIcon,
  },
  {
    href: '/cv',
    labelKey: 'CV',
    icon: FileText,
  },
] as const

export function HeaderNav() {
  const t = useTranslations('HeaderNav')
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAdmin = Boolean(session?.user?.isAdmin)
  const userName = session?.user?.name?.trim() || t('Traveler')
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')

  const handleLogin = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/85 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="container flex min-h-18 items-center gap-3 py-3">
        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-linear-to-br from-rose-100 via-white to-amber-50 text-primary shadow-sm">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[0.18em] text-foreground/90 uppercase">
              Campu
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {t('Tagline')}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="hidden items-center justify-center gap-2 md:flex">
            {navItems.map(item => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      isActive
                        ? 'text-primary-foreground'
                        : 'text-primary/80 group-hover:text-primary',
                    )}
                    aria-hidden="true"
                  />
                  <span>{t(item.labelKey)}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-10 rounded-full border-primary/15 bg-white/90 text-foreground shadow-sm transition-colors duration-200 hover:border-primary/30 hover:bg-accent/70 hover:text-accent-foreground motion-reduce:transition-none md:hidden"
              >
                <Menu aria-hidden="true" />
                <span className="sr-only">{t('OpenMenu')}</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full border-l-0 bg-white/95 px-0 sm:max-w-sm md:hidden"
            >
              <SheetHeader className="border-b border-border/60 px-6 pb-5">
                <SheetTitle>{t('NavigationTitle')}</SheetTitle>
                <SheetDescription>
                  {t('NavigationDescription')}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-2 px-4 py-6">
                {navItems.map(item => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group inline-flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-foreground hover:bg-accent/80 hover:text-accent-foreground',
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isActive
                            ? 'text-primary-foreground'
                            : 'text-primary/80 group-hover:text-primary',
                        )}
                        aria-hidden="true"
                      />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  )
                })}

                {isAdmin ? (
                  <Link
                    href="/admin"
                    aria-current={pathname === '/admin' ? 'page' : undefined}
                    className={cn(
                      'group inline-flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
                      pathname === '/admin'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-accent/80 hover:text-accent-foreground',
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard
                      className={cn(
                        'h-5 w-5',
                        pathname === '/admin'
                          ? 'text-primary-foreground'
                          : 'text-primary/80 group-hover:text-primary',
                      )}
                      aria-hidden="true"
                    />
                    <span>{t('Admin')}</span>
                  </Link>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>

          <SwitchLanguage
            buttonClassName="min-h-10 rounded-full border-primary/10 bg-white/90 px-3 text-foreground shadow-sm hover:bg-accent/70 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 active:scale-100"
            showLabel
          />

          {session ? (
            <div className="flex items-center gap-2 px-1">
              {isAdmin ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden h-10 rounded-full border-primary/15 bg-white/90 px-4 text-foreground shadow-sm transition-colors duration-200 hover:border-primary/30 hover:bg-accent/70 hover:text-accent-foreground motion-reduce:transition-none sm:inline-flex"
                >
                  <Link href="/admin">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    {t('Admin')}
                  </Link>
                </Button>
              ) : null}
              <Avatar className="h-10 w-10 border border-primary/10">
                <AvatarImage src={session.user.image || ''} alt={userName} />
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {initials || 'CP'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-medium text-foreground">
                  {userName}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                  {t('SignedIn')}
                </p>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogin}
              className="h-10 rounded-full border-primary/15 bg-white/90 px-4 text-foreground shadow-sm transition-colors duration-200 hover:border-primary/30 hover:bg-accent/70 hover:text-accent-foreground motion-reduce:transition-none"
            >
              <LogIn className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="hidden sm:inline">{t('Login')}</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
