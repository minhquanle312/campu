'use client'

import { Download } from 'lucide-react'

export function CVDownloadButton({ label }: { targetId: string, label: string }) {
  const handleDownload = () => {
    // Calling the native browser print which will export native PDF and understand tailwind oklch correctly
    window.print()
  }

  return (
    <button 
      onClick={handleDownload}
      className="print:hidden flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  )
}
