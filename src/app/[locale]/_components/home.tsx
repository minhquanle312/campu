import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { Camera, Heart, MapPin, Plane } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

const stats = [
  { icon: MapPin, labelKey: 'Stats.ProvincesVisited', value: '10+' },
  { icon: Camera, labelKey: 'Stats.PhotosTaken', value: '500+' },
  { icon: Heart, labelKey: 'Stats.MemoriesMade', value: 'Countless' },
  { icon: Plane, labelKey: 'Stats.DistanceTotal', value: '10,000+' },
]

export default async function HomePage() {
  const t = await getTranslations('Home')

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl mb-6">{t('Title')}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t('Description')}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="journey">
                <Button size="lg">{t('ExploreJourney')}</Button>
              </Link>
              <Button size="lg" variant="outline">
                {t('ContactMe')}
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-bounce [animation-duration:2s]">
          ✈️
        </div>
        <div className="absolute bottom-20 right-10 text-6xl animate-bounce delay-100 [animation-duration:2s]">
          🏖️
        </div>
        <div className="absolute top-1/2 right-20 text-6xl animate-bounce delay-200 [animation-duration:2s]">
          ⛰️
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.labelKey}>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <stat.icon className="size-10 mx-auto mb-4 text-pink-500" />
                  <h3 className="mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{t(stat.labelKey)}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-linear-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  fill
                  src="/for-pu/avatar.jpg"
                  alt="Travel memories"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <div>
              <h2 className="mb-6">{t('JourneyStory.Title')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('JourneyStory.Paragraph1')}
              </p>
              <p className="text-muted-foreground mb-4">
                {t('JourneyStory.Paragraph2')}
              </p>
              <p className="text-muted-foreground mb-6">
                {t('JourneyStory.Paragraph3')}
              </p>
              <Link href="journey">
                <Button>{t('ViewAllTrips')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">{t('MyPurpose.Title')}</h2>
            <p className="text-muted-foreground mb-12">
              {t('MyPurpose.Description')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="mb-2">{t('MyPurpose.Explore')}</h3>
                <p className="text-muted-foreground">
                  {t('MyPurpose.ExploreDesc')}
                </p>
              </Card>
              <Card className="p-6">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="mb-2">{t('MyPurpose.Capture')}</h3>
                <p className="text-muted-foreground">
                  {t('MyPurpose.CaptureDesc')}
                </p>
              </Card>
              <Card className="p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="mb-2">{t('MyPurpose.Connect')}</h3>
                <p className="text-muted-foreground">
                  {t('MyPurpose.ConnectDesc')}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-pink-500 to-rose-500 text-white mb-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-white">{t('ReadyToStart.Title')}</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            {t('ReadyToStart.Description')}
          </p>
          <Link href="journey">
            <Button size="lg" variant="secondary" className="cursor-pointer">
              {t('ExploreMap')}
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
