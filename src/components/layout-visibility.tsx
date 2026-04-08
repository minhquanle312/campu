'use client'

import type { ReactNode } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'

type LayoutVisibilityProps = {
  banner?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  floating?: ReactNode
  children: ReactNode
}

export function LayoutVisibility({
  banner,
  header,
  footer,
  floating,
  children,
}: LayoutVisibilityProps) {
  const segments = useSelectedLayoutSegments()
  const isAdminRoute = segments.includes('admin')
  const shouldHideSharedShell = isAdminRoute

  return (
    <>
      {shouldHideSharedShell ? null : banner}
      {shouldHideSharedShell ? null : header}
      {children}
      {shouldHideSharedShell ? null : floating}
      {shouldHideSharedShell ? null : footer}
    </>
  )
}
