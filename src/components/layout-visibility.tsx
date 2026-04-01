'use client'

import { usePathname } from '@/i18n/navigation'

export function LayoutVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Hide layout elements if we are on any /cv route
  const isCVRoute = pathname === '/cv' || pathname.startsWith('/cv/')
  
  if (isCVRoute) {
    return null
  }
  
  return <>{children}</>
}
