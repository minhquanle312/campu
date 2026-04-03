'use client'

import type { ReactNode } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'

type LayoutVisibilityProps = {
  banner?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

export function LayoutVisibility({
  banner,
  header,
  footer,
  children,
}: LayoutVisibilityProps) {
  const segments = useSelectedLayoutSegments()
  const isCVRoute = segments.includes('cv')

  return (
    <>
      {isCVRoute ? null : banner}
      {isCVRoute ? null : header}
      {children}
      {isCVRoute ? null : footer}
    </>
  )
}
