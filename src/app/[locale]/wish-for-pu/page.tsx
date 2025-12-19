import { Card } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import WishesForm from './_components/wishes-form'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('')

  return (
    <div className="flex items-center justify-center mt-5 relative">
      <Card className="w-full max-w-md mx-auto overflow-hidden relative bg-white shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20">
          <div className="w-40 h-40 rounded-full bg-pink-100 absolute -top-20 -left-20"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20">
          <div className="w-40 h-40 rounded-full bg-pink-100 absolute -bottom-20 -right-20"></div>
        </div>

        {/* Top decorative border */}
        <div className="h-3 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300"></div>

        {/* Card content */}
        <div className="p-6 relative z-10">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Heart className="text-pink-500 h-10 w-10 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-pink-700 mb-1">
              {t('InvitationTitle')}
            </h1>
            <p className="text-pink-600 font-medium">
              {t('InvitationSubTitle')}
            </p>
          </div>

          {/* Girlfriend's Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-pink-300">
              <Image
                src="/for-pu/avatar.jpg"
                alt="Girlfriend's Photo"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-pink-800 mb-2">
                {t('GraduationCeremony')}
              </h2>
              <p className="text-gray-600">{t('InvitationDescription')}</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-pink-700 italic mb-2">
              &quot;{t('Quote')}&quot;
            </p>
            <p className="text-gray-600">With love,</p>
            <p className="text-pink-600 font-bold text-lg">Cẩm Pu</p>
          </div>

          <WishesForm />
        </div>

        {/* Bottom decorative elements */}
        <div className="flex justify-center -mb-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-pink-300"></div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
