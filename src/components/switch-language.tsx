'use client'

import { cn } from '@/lib/utils'
import { useRouter, usePathname } from '@/i18n/navigation'
import { ClassValue } from 'clsx'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import React from 'react'

interface SwitchLanguageProps {
  className?: ClassValue
}

export const SwitchLanguage: React.FC<SwitchLanguageProps> = ({
  className,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const changeLanguage = (lang: 'vi' | 'en') => {
    router.replace(pathname, { locale: lang })
  }

  return (
    <div className={cn('flex gap-2', className)}>
      <div
        className={
          'w-6 h-6 rounded-full relative overflow-hidden cursor-pointer'
        }
      >
        {locale === 'en' ? (
          <Image
            src="https://flagcdn.com/us.svg"
            alt="Switch to English"
            fill
            className="object-cover"
            onClick={() => changeLanguage('vi')}
          />
        ) : (
          <Image
            src="https://flagcdn.com/vn.svg"
            alt="Switch to Vietnamese"
            fill
            className="object-cover"
            onClick={() => changeLanguage('en')}
          />
        )}
      </div>
    </div>
  )
}
