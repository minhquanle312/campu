'use client'

import { useMemo, useRef, useState } from 'react'
import { Home, LayoutTemplate, LogIn, PencilLine } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { Link } from '@/i18n/navigation'
import { SwitchLanguage } from '@/components/switch-language'
import { CVDownloadButton } from '@/components/cv-download-button'
import {
  CVDesktopLayout,
  CVSimpleLayout,
  type CVMessages,
} from '@/components/cv/cv-layouts'
import { InterviewChatWidget } from '@/components/interview-chat-widget'
import { signIn, useSession } from '@/lib/auth-client'
import type { CVData, Locale } from '@/types/cv'

type LayoutMode = 'current' | 'simple'

type Props = {
  cv: CVData
  isAdmin: boolean
  locale: Locale
  messages: CVMessages
}

function getInitialLayoutMode(): LayoutMode {
  if (typeof window === 'undefined') {
    return 'current'
  }

  return window.matchMedia('(min-width: 768px)').matches ? 'current' : 'simple'
}

export function CVPageShell({ cv, isAdmin, locale, messages }: Props) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(getInitialLayoutMode)
  const printRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const isDesktopLayout = layoutMode === 'current'
  const secondaryControlClassName =
    'flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 px-3 py-3 text-sm font-medium text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-slate-100 hover:shadow-lg active:scale-95 sm:min-h-10 sm:min-w-0 sm:gap-2 sm:px-4 sm:py-2.5'
  const primaryControlClassName =
    'print:hidden flex min-h-11 min-w-11 items-center justify-center rounded-full border border-transparent bg-rose-500 px-3 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-rose-600 hover:shadow-lg active:scale-95 sm:min-h-10 sm:min-w-0 sm:gap-2 sm:px-4 sm:py-2.5'
  const documentTitle = `${(cv.personalInfo?.name || 'cv').replace(/\s+/g, '-').toLowerCase()}-${locale}`

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle,
    pageStyle: `\n      @page { size: A4; margin: 12mm; }\n      @media print {\n        html, body { background: white !important; }\n        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }\n        .cv-print-root {\n          display: block !important;\n          height: auto !important;\n          overflow: visible !important;\n          position: static !important;\n        }\n      }\n    `,
  })

  const activeLayout = useMemo(
    () =>
      isDesktopLayout ? (
        <>
          <div className="hidden overflow-x-auto pb-4 md:block">
            <CVDesktopLayout
              cv={cv}
              locale={locale}
              messages={messages}
              documentId="cv-document"
              desktopMinWidthClassName="min-w-[960px]"
            />
          </div>
          <div className="md:hidden">
            <CVSimpleLayout cv={cv} locale={locale} messages={messages} />
          </div>
        </>
      ) : (
        <CVSimpleLayout cv={cv} locale={locale} messages={messages} />
      ),
    [cv, isDesktopLayout, locale, messages],
  )

  const handleLogin = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: `/${locale}/cv`,
    })
  }

  const layoutLabel =
    layoutMode === 'current' ? messages.minimalLayout : messages.fullLayout

  return (
    <main className="min-h-screen bg-slate-100 px-2 py-12 print:bg-white print:px-0 print:py-0 relative">
      <div className="fixed left-4 top-4 z-50 flex flex-col items-start gap-2 print:hidden sm:left-6 sm:top-6">
        <Link
          href="/"
          className={`${secondaryControlClassName} group`}
          aria-label="Back to Home"
          title="Back to Home"
        >
          <Home
            className="h-5 w-5 transition-colors group-hover:text-amber-500 sm:h-4 sm:w-4"
            aria-hidden="true"
          />
          <span className="hidden sm:inline">Home</span>
          <span className="sr-only">Back to Home</span>
        </Link>
        <button
          type="button"
          onClick={() =>
            setLayoutMode(current =>
              current === 'current' ? 'simple' : 'current',
            )
          }
          aria-label={layoutLabel}
          title={layoutLabel}
          className={secondaryControlClassName}
        >
          <LayoutTemplate
            className="h-5 w-5 sm:h-4 sm:w-4"
            aria-hidden="true"
          />
          <span className="hidden sm:inline">{layoutLabel}</span>
          <span className="sr-only">{layoutLabel}</span>
        </button>
        <SwitchLanguage showLabel buttonClassName={secondaryControlClassName} />
        <CVDownloadButton
          label={messages.downloadPdf}
          action={handlePrint}
          iconOnlyBelowSm
          className={primaryControlClassName}
        />
        {!session ? (
          <button
            type="button"
            onClick={handleLogin}
            aria-label="Login with Google"
            title="Login with Google"
            className={secondaryControlClassName}
          >
            <LogIn className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Login</span>
            <span className="sr-only">Login with Google</span>
          </button>
        ) : null}
        {isAdmin ? (
          <Link
            href="/cv/edit"
            aria-label="Edit CV"
            title="Edit CV"
            className={secondaryControlClassName}
          >
            <PencilLine className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Edit</span>
            <span className="sr-only">Edit CV</span>
          </Link>
        ) : null}
      </div>

      <div className="mx-auto max-w-[1200px]">{activeLayout}</div>

      <div
        ref={printRef}
        className="cv-print-root pointer-events-none h-0 overflow-hidden"
        aria-hidden="true"
      >
        <CVDesktopLayout cv={cv} locale={locale} messages={messages} />
      </div>

      <InterviewChatWidget
        locale={locale}
        title={messages.hrAssistant}
        description={messages.hrAssistantDescription}
      />
    </main>
  )
}
