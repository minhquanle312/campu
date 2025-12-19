'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

export default function WishesForm() {
  const t = useTranslations('')

  const [wishMessage, setWishMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [wishName, setWishName] = useState('')
  const [wishSending, setWishSending] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_error, setError] = useState<string | null>(null)

  const submit = () => {
    setWishSending(true)
    fetch(`/api/sheets/wishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wish: wishMessage,
        name: wishName,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log('Data submitted successfully:', data)
        setSubmitted(true)
      })
      .catch(error => {
        console.error('Error submitting data:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'An error occurred submitting the data',
        )
      })
      .finally(() => {
        setWishSending(false)
      })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  return !submitted ? (
    <form onSubmit={handleSubmit} className="bg-pink-50 rounded-lg p-4 mb-6">
      <h3 className="text-center text-pink-700 font-bold mb-4">
        {t('YourWishesForMe')}
      </h3>

      <div className="mb-4">
        <Label htmlFor="wishName" className="text-pink-700 mb-1 block">
          {t('YourNameLabel') || 'Your lovely name (so Pu knows who you are!)'}
        </Label>
        <input
          id="wishName"
          type="text"
          placeholder={t('YourNamePlaceholder') || 'Enter your name'}
          disabled={wishSending}
          value={wishName}
          onChange={e => setWishName(e.target.value)}
          className="w-full p-3 rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-pink-500 outline-none mb-2"
          required
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="wishMessage" className="text-pink-700 mb-1 block">
          {t('YourWishesForMe')}
        </Label>
        <div className="relative">
          <textarea
            id="wishMessage"
            placeholder={t('WishesDesc')}
            disabled={wishSending}
            value={wishMessage}
            onChange={e => setWishMessage(e.target.value)}
            className="w-full min-h-[100px] p-3 rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-pink-500 outline-none"
            required
          />
          <div className="absolute -bottom-1 -right-1 text-pink-400 opacity-20">
            <Heart className="h-12 w-12" fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          disabled={!wishMessage || wishSending}
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-full"
        >
          {wishSending ? t('YourWishIsSending') : t('SendYourWishes')}
        </Button>
      </div>
    </form>
  ) : (
    <div className="bg-pink-50 rounded-lg p-4 mb-6 text-center">
      <h3 className="text-pink-700 font-bold mb-2">
        {t('ThankYou')}, {wishName}!
      </h3>
      <p className="text-gray-600">{t('WishesSent')}</p>
      <div className="flex justify-center mt-2">
        <Heart
          className="text-pink-500 h-6 w-6 animate-pulse"
          fill="currentColor"
        />
      </div>
    </div>
  )
}
