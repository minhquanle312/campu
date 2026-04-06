'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, LoaderCircle, Rocket } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type {
  GeneralConfigDeployErrorResponse,
  GeneralConfigDeployResponse,
} from '@/types/general-config'

type PublishFeedback = {
  tone: 'success' | 'error'
  title: string
  message: string
}

type InlinePublishPromptProps = {
  title?: string
  description: string
  className?: string
}

export function InlinePublishPrompt({
  title = 'Publish changes',
  description,
  className,
}: InlinePublishPromptProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [feedback, setFeedback] = useState<PublishFeedback | null>(null)

  const handlePublish = async () => {
    if (isPublishing) {
      return
    }

    setIsPublishing(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/general-config/deploy', {
        method: 'POST',
      })

      const data = (await response.json()) as
        | GeneralConfigDeployResponse
        | GeneralConfigDeployErrorResponse

      if (!response.ok) {
        throw new Error(
          'error' in data
            ? data.error
            : 'Failed to request publish. Please try again.',
        )
      }

      if (!('status' in data)) {
        throw new Error('Failed to request publish. Please try again.')
      }

      setFeedback({
        tone: 'success',
        title: 'Publish requested',
        message: data.message,
      })
    } catch (error) {
      console.error(error)
      setFeedback({
        tone: 'error',
        title: 'Publish request failed',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to request publish. Please try again.',
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <Button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing}
          className="min-w-44 rounded-full"
        >
          {isPublishing ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Requesting publish…
            </>
          ) : (
            <>
              <Rocket className="size-4" />
              Request publish
            </>
          )}
        </Button>
      </div>

      {feedback ? (
        <Alert
          className={cn(
            'mt-4 border',
            feedback.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 [&>svg]:text-emerald-600'
              : 'border-rose-200 bg-rose-50 text-rose-900 [&>svg]:text-rose-600',
          )}
        >
          {feedback.tone === 'success' ? (
            <CheckCircle2 aria-hidden="true" />
          ) : (
            <AlertCircle aria-hidden="true" />
          )}
          <AlertTitle>{feedback.title}</AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      ) : null}
    </section>
  )
}
