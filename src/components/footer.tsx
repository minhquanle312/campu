import { Compass, Heart, MapPinned } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('Footer')

  return (
    <footer className="border-t border-white/70 bg-white/60 py-8 backdrop-blur-sm">
      <div className="container flex flex-col gap-5 text-center sm:text-left lg:flex-row lg:items-center lg:justify-between">
        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-primary uppercase shadow-sm">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            Campu
          </div>
          <p className="text-lg font-semibold text-foreground">
            {t('Blessing')}
          </p>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {t('Description')}
          </p>
          <a
            href="https://www.minhquanle.com"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Hidden author link"
            title="Hidden author link"
            className="absolute left-1/2 top-9 h-5 w-5 -translate-x-1/2 rounded-full opacity-0 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span className="sr-only">Minh Quan Le</span>
          </a>
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:min-w-88 lg:justify-items-end">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/10 bg-white/80 px-4 py-2 shadow-sm sm:justify-start">
            <MapPinned className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{t('Promise')}</span>
          </div>
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/10 bg-white/80 px-4 py-2 shadow-sm sm:justify-start">
            <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{t('Signature')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
