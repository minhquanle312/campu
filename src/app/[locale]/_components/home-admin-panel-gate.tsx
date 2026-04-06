'use client'

import { useSession } from '@/lib/auth-client'
import type { GeneralConfig } from '@/types/general-config'

import HomeInlineAdminPanel from './home-inline-admin-panel'

type HomeAdminPanelGateProps = {
  initialConfig: GeneralConfig
}

export default function HomeAdminPanelGate({
  initialConfig,
}: HomeAdminPanelGateProps) {
  const { data: session } = useSession()

  if (!session?.user?.isAdmin) {
    return null
  }

  return <HomeInlineAdminPanel initialConfig={initialConfig} />
}
