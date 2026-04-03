import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import type { GeneralConfig, GeneralConfigAsset } from '@/types/general-config'
import {
  ArrowRight,
  Camera,
  Compass,
  Heart,
  MapIcon,
  MapPin,
  NotebookPen,
  Plane,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import HomeInlineAdminPanel from './home-inline-admin-panel'

const STATIC_FALLBACK_IMAGE = '/for-pu/avatar.jpg'

const stats = [
  { icon: MapPin, labelKey: 'Stats.ProvincesVisited', value: '10+' },
  { icon: Camera, labelKey: 'Stats.PhotosTaken', value: '500+' },
  { icon: Heart, labelKey: 'Stats.MemoriesMade', value: 'Countless' },
  { icon: Plane, labelKey: 'Stats.DistanceTotal', value: '10,000+' },
] as const

const purposeCards = [
  {
    icon: Compass,
    titleKey: 'MyPurpose.Explore',
    descriptionKey: 'MyPurpose.ExploreDesc',
  },
  {
    icon: Camera,
    titleKey: 'MyPurpose.Capture',
    descriptionKey: 'MyPurpose.CaptureDesc',
  },
  {
    icon: NotebookPen,
    titleKey: 'MyPurpose.Connect',
    descriptionKey: 'MyPurpose.ConnectDesc',
  },
] as const

type HomePageProps = {
  locale: string
  isAdmin: boolean
  initialConfig: GeneralConfig
  primaryImage: GeneralConfigAsset | null
  secondaryImage: GeneralConfigAsset | null
}

export default function HomePage({
  locale,
  isAdmin,
  initialConfig,
  primaryImage,
  secondaryImage,
}: HomePageProps) {
  const t = useTranslations('Home')
  const heroImageSrc = primaryImage?.url || STATIC_FALLBACK_IMAGE
  const journeyStoryImageSrc = secondaryImage?.url || STATIC_FALLBACK_IMAGE

  return (
    <>
      <section className="relative overflow-hidden pb-18 pt-16 sm:pb-24 sm:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.16),transparent_30%)]" />

        <div className="container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="max-w-2xl space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                <MapIcon className="h-4 w-4" aria-hidden="true" />
                <span>{t('Eyebrow')}</span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  {t('Title')}
                </h1>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  {t('Description')}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full px-6 shadow-lg shadow-primary/15"
                >
                  <Link href="/journey">
                    {t('ExploreJourney')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-primary/15 bg-white/80 px-6 shadow-sm hover:bg-accent/80"
                >
                  <Link href="/wish-for-pu">{t('ContactMe')}</Link>
                </Button>
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                {t('HeroNote')}
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-8 hidden h-28 w-28 rounded-full bg-amber-200/40 blur-2xl md:block" />
              <div className="absolute -right-5 bottom-12 hidden h-36 w-36 rounded-full bg-rose-200/50 blur-3xl md:block" />

              <div className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/75 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                  <Image
                    fill
                    priority
                    src={heroImageSrc}
                    alt={t('HeroImageAlt')}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
                </div>

                <div className="absolute inset-x-7 bottom-7 rounded-[1.4rem] border border-white/30 bg-black/45 p-5 text-white shadow-lg backdrop-blur-md">
                  <p className="text-xs font-semibold tracking-[0.22em] text-white/70 uppercase">
                    {t('FeatureCard.Kicker')}
                  </p>
                  <p className="mt-2 text-xl font-semibold leading-tight">
                    {t('FeatureCard.Title')}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {t('FeatureCard.Description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isAdmin ? (
        <HomeInlineAdminPanel initialConfig={initialConfig} key={locale} />
      ) : null}

      <section className="pb-18 sm:pb-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(stat => (
              <div key={stat.labelKey}>
                <Card className="h-full rounded-3xl border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-shadow duration-200 hover:shadow-lg motion-reduce:transition-none">
                  <div className="mb-5 inline-flex rounded-2xl border border-primary/10 bg-accent/70 p-3 text-primary">
                    <stat.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t(stat.labelKey)}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-18 sm:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <div className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/70 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.1)] backdrop-blur-sm">
                <div className="absolute left-6 top-6 z-10 rounded-full border border-white/40 bg-black/35 px-4 py-2 text-xs font-medium tracking-[0.16em] text-white uppercase backdrop-blur-md">
                  {t('JourneyStory.Badge')}
                </div>
                <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
                  <Image
                    fill
                    src={journeyStoryImageSrc}
                    alt={t('JourneyStory.ImageAlt')}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                {t('JourneyStory.Kicker')}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t('JourneyStory.Title')}
              </h2>
              <p className="mt-6 text-base leading-7 text-muted-foreground">
                {t('JourneyStory.Paragraph1')}
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {t('JourneyStory.Paragraph2')}
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {t('JourneyStory.Paragraph3')}
              </p>
              <div className="mt-8">
                <Button asChild className="rounded-full px-5 shadow-sm">
                  <Link href="/journey">{t('ViewAllTrips')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-18 sm:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-primary uppercase">
              {t('MyPurpose.Kicker')}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('MyPurpose.Title')}
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              {t('MyPurpose.Description')}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {purposeCards.map(card => (
              <Card
                key={card.titleKey}
                className="h-full rounded-[1.75rem] border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-5 inline-flex rounded-2xl border border-primary/10 bg-accent/70 p-3 text-primary">
                  <card.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t(card.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {t(card.descriptionKey)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 pt-6 sm:pb-24">
        <div className="container">
          <div className="overflow-hidden rounded-4xl bg-linear-to-r from-rose-500 via-pink-500 to-amber-400 px-6 py-12 text-white shadow-[0_24px_80px_rgba(219,39,119,0.24)] sm:px-10 lg:px-14">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-white/75 uppercase">
                  {t('ReadyToStart.Kicker')}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {t('ReadyToStart.Title')}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
                  {t('ReadyToStart.Description')}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:justify-end">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-12 rounded-full border border-white/20 bg-white text-primary shadow-sm hover:bg-white/90"
                >
                  <Link href="/journey">{t('ExploreMap')}</Link>
                </Button>
                <p className="text-sm leading-6 text-white/80">
                  {t('ReadyToStart.SupportingNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
