import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cẩm Pu’s Journey',
  description: 'Cẩm Pu’s memorable journey and adventures',
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="container mx-auto px-6 my-7">{children}</main>
}
