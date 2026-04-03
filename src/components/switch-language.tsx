'use client'

import { cn } from '@/lib/utils'
import { useRouter, usePathname } from '@/i18n/navigation'
import { ClassValue } from 'clsx'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import React from 'react'

interface SwitchLanguageProps {
  className?: ClassValue
  buttonClassName?: ClassValue
  showLabel?: boolean
}

export const SwitchLanguage: React.FC<SwitchLanguageProps> = ({
  className,
  buttonClassName,
  showLabel = false,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const nextLocale = locale === 'en' ? 'vi' : 'en'
  const nextLanguageLabel = nextLocale === 'en' ? 'English' : 'Vietnamese'
  const actionLabel = `Switch to ${nextLanguageLabel}`

  const changeLanguage = (lang: 'vi' | 'en') => {
    router.replace(pathname, { locale: lang })
  }

  return (
    <div className={cn('flex gap-2', className)}>
      <button
        type="button"
        onClick={() => changeLanguage(nextLocale)}
        aria-label={actionLabel}
        title={actionLabel}
        className={cn(
          'flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-3 text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-slate-100 hover:shadow-lg active:scale-95 sm:min-h-10 sm:min-w-0 sm:px-4 sm:py-2.5',
          buttonClassName,
        )}
      >
        <div className="relative h-5 w-5 overflow-hidden rounded-full border border-slate-200">
          {locale === 'en' ? (
            <Image
              src="https://flagcdn.com/vn.svg"
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
          ) : (
            <Image
              src="https://flagcdn.com/us.svg"
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
          )}
        </div>
        {showLabel ? (
          <span className="hidden sm:inline">{nextLanguageLabel}</span>
        ) : null}
        <span className="sr-only">{actionLabel}</span>
      </button>
    </div>
  )
}
