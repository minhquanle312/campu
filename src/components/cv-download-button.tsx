'use client'

import { cn } from '@/lib/utils'
import { Download } from 'lucide-react'

type Props = {
  label: string
  action: () => void
  className?: string
  iconOnlyBelowSm?: boolean
}

export function CVDownloadButton({
  label,
  action,
  className,
  iconOnlyBelowSm = false,
}: Props) {
  return (
    <button
      type="button"
      onClick={action}
      aria-label={label}
      title={label}
      className={cn(
        'print:hidden flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-rose-500 px-3 py-3 font-medium text-white shadow-md transition-all hover:bg-rose-600 hover:shadow-lg active:scale-95 sm:min-h-10 sm:min-w-0 sm:px-4 sm:py-2.5',
        className,
      )}
    >
      <Download className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
      {iconOnlyBelowSm ? (
        <>
          <span className="hidden sm:inline">{label}</span>
          <span className="sr-only">{label}</span>
        </>
      ) : (
        label
      )}
    </button>
  )
}
