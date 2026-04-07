'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

import { useSession } from '@/lib/auth-client'
import type { GeneralConfig } from '@/types/general-config'
import {
  getDeployPendingExpiryTime,
  GENERAL_CONFIG_DEPLOY_BANNER_MESSAGE,
  GENERAL_CONFIG_DEPLOY_UPDATED_EVENT,
  isDeployPendingActive,
} from '@/types/general-config'

export function PendingPublishBanner() {
  const { data: session } = useSession()
  const isAdmin = Boolean(session?.user?.isAdmin)
  const [isPending, setIsPending] = useState(false)
  const expiryTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const clearExpiryTimeout = () => {
      if (expiryTimeoutRef.current !== null) {
        window.clearTimeout(expiryTimeoutRef.current)
        expiryTimeoutRef.current = null
      }
    }

    if (!isAdmin) {
      clearExpiryTimeout()
      setIsPending(false)
      return
    }

    let isCancelled = false

    const scheduleExpiryRefresh = (requestedAt: string | null) => {
      clearExpiryTimeout()

      const expiresAt = getDeployPendingExpiryTime(requestedAt)

      if (expiresAt === null) {
        return
      }

      const delay = Math.max(expiresAt - Date.now(), 0)

      expiryTimeoutRef.current = window.setTimeout(() => {
        if (!isCancelled) {
          setIsPending(false)
        }
        expiryTimeoutRef.current = null
      }, delay)
    }

    const syncDeployState = async () => {
      try {
        const response = await fetch('/api/general-config', {
          cache: 'no-store',
        })

        if (!response.ok) {
          clearExpiryTimeout()
          return
        }

        const config = (await response.json()) as GeneralConfig
        const pending = isDeployPendingActive(config.deploy)

        if (!isCancelled) {
          setIsPending(pending)
          if (pending) {
            scheduleExpiryRefresh(config.deploy.requestedAt)
          } else {
            clearExpiryTimeout()
          }
        }
      } catch {
        if (!isCancelled) {
          clearExpiryTimeout()
        }
      }
    }

    void syncDeployState()

    const handleRefresh = () => {
      void syncDeployState()
    }

    window.addEventListener(GENERAL_CONFIG_DEPLOY_UPDATED_EVENT, handleRefresh)

    return () => {
      isCancelled = true
      clearExpiryTimeout()
      window.removeEventListener(
        GENERAL_CONFIG_DEPLOY_UPDATED_EVENT,
        handleRefresh,
      )
    }
  }, [isAdmin])

  if (!isAdmin || !isPending) {
    return null
  }

  return (
    <div className="border-b border-amber-300/70 bg-amber-100/95 px-4 py-3 text-amber-950 shadow-sm backdrop-blur print:hidden">
      <div className="container flex items-start gap-3 text-sm">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-semibold">Deploy requested</p>
          <p>{GENERAL_CONFIG_DEPLOY_BANNER_MESSAGE}</p>
        </div>
      </div>
    </div>
  )
}
