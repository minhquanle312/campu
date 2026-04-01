'use client'

import { useMemo, useRef, useState } from 'react'
import { Home } from 'lucide-react'
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
import type { CVData, Locale } from '@/types/cv'

type LayoutMode = 'current' | 'simple'

type Props = {
  cv: CVData
  locale: Locale
  messages: CVMessages
}

export function CVPageShell({ cv, locale, messages }: Props) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('current')
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${(cv.personalInfo?.name || 'cv').replace(/\s+/g, '-').toLowerCase()}-${locale}`,
    pageStyle: `
      @page { size: A4; margin: 12mm; }
      @media print {
        html, body { background: white !important; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  })

  const activeLayout = useMemo(() => {
    if (layoutMode === 'simple') {
      return <CVSimpleLayout cv={cv} locale={locale} messages={messages} />
    }

    return (
      <div className="overflow-x-auto pb-4">
        <CVDesktopLayout
          cv={cv}
          locale={locale}
          messages={messages}
          documentId="cv-document"
          desktopMinWidthClassName="min-w-[960px]"
        />
      </div>
    )
  }, [cv, layoutMode, locale, messages])

  return (
    <main className="min-h-screen bg-slate-100 px-2 py-12 print:bg-white print:px-0 print:py-0 relative">
      <div className="fixed top-4 left-4 z-50 print:hidden sm:left-6 sm:top-6">
        <Link
          href="/"
          className="group flex flex-col items-center justify-center rounded-full border border-slate-200 bg-white/90 p-3 text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-slate-100 hover:shadow-lg active:scale-95 sm:px-4 sm:py-2.5"
          title="Back to Home"
        >
          <Home className="h-5 w-5 transition-colors group-hover:text-amber-500 sm:h-4 sm:w-4" />
        </Link>
      </div>

      <div className="fixed right-4 top-4 z-50 flex flex-wrap items-center justify-end gap-2 print:hidden sm:right-6 sm:top-6">
        <SwitchLanguage />
        <button
          type="button"
          onClick={() =>
            setLayoutMode(current =>
              current === 'current' ? 'simple' : 'current',
            )
          }
          className="rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-slate-100 hover:shadow-lg active:scale-95"
        >
          {layoutMode === 'current'
            ? messages.simpleLayout
            : messages.currentLayout}
        </button>
        <CVDownloadButton
          label={messages.downloadPdf}
          onDownload={handlePrint}
        />
      </div>

      <div className="mx-auto max-w-[1200px]">{activeLayout}</div>

      <div
        className="pointer-events-none fixed left-0 top-0 opacity-0"
        aria-hidden="true"
      >
        <div ref={printRef} className="bg-white p-4">
          <CVDesktopLayout cv={cv} locale={locale} messages={messages} />
        </div>
      </div>

      <InterviewChatWidget
        locale={locale}
        title={messages.interviewAssistant}
        description={messages.interviewAssistantDescription}
      />
    </main>
  )
}
