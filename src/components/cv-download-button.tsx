'use client'

import { Download } from 'lucide-react'

type Props = {
  label: string
  onDownload: () => void
}

export function CVDownloadButton({ label, onDownload }: Props) {
  return (
    <button
      type="button"
      onClick={onDownload}
      className="print:hidden flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  )
}
