'use client'

import React, { useState } from 'react'
import { Trip, TripCost } from '@/models/trips.model'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import {
  MediaViewerModal,
  type MediaItem,
} from '@/components/media-viewer-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Calendar,
  Car,
  Clock,
  MapPin,
  Pencil,
  Sparkles,
  Star,
  Users,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface TripDetailClientProps {
  trip: Trip
  costs: TripCost[]
  isAdmin?: boolean
}

function StarRating({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency || 'VND',
  }).format(amount)
}

export function TripDetailClient({
  trip,
  costs,
  isAdmin = false,
}: TripDetailClientProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  const heroImage = trip.coverImage || trip.images[0]
  const totalCost = costs.reduce((sum, c) => sum + c.amount, 0)

  return (
    <main className="container py-8 min-h-screen space-y-8 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/journey">
          <Button type="button" variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Journey
          </Button>
        </Link>
        {isAdmin && (
          <Link href={`/journey/${trip.id}/edit`}>
            <Button type="button" variant="outline" size="sm">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        )}
      </div>

      {/* Hero Section */}
      {heroImage && (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
          <Image
            src={heroImage}
            alt={trip.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{trip.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-white/80">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {trip.provinceName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(trip.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Title without hero */}
      {!heroImage && (
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">{trip.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {trip.provinceName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(trip.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Summary */}
      <p className="text-lg text-muted-foreground leading-relaxed">
        {trip.summary}
      </p>

      {/* Quick Info Bar */}
      {trip.details && (
        <div className="flex flex-wrap gap-2">
          {trip.details.difficulty && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {trip.details.difficulty}
            </Badge>
          )}
          {trip.details.durationDays && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {trip.details.durationDays} day
              {trip.details.durationDays > 1 ? 's' : ''}
            </Badge>
          )}
          {trip.details.vehicle && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Car className="h-3 w-3" />
              {trip.details.vehicle}
            </Badge>
          )}
          {trip.details.vibe && (
            <Badge variant="secondary">{trip.details.vibe}</Badge>
          )}
          {trip.details.bestSeason && (
            <Badge variant="secondary">Best: {trip.details.bestSeason}</Badge>
          )}
        </div>
      )}

      {/* Ratings */}
      {trip.details &&
        (trip.details.sceneryQuality || trip.details.cuisineExperience) && (
          <div className="flex flex-wrap gap-6">
            {trip.details.sceneryQuality && (
              <StarRating value={trip.details.sceneryQuality} label="Scenery" />
            )}
            {trip.details.cuisineExperience && (
              <StarRating
                value={trip.details.cuisineExperience}
                label="Cuisine"
              />
            )}
          </div>
        )}

      {/* Article */}
      {trip.details?.article && (
        <>
          <Separator />
          <MarkdownRenderer
            content={trip.details.article}
            className="prose prose-pink dark:prose-invert max-w-none"
          />
        </>
      )}

      {/* Preparation */}
      {trip.details?.preparation && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              Preparation Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-800 dark:text-green-300 whitespace-pre-wrap">
              {trip.details.preparation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disadvantages */}
      {trip.details?.disadvantages && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Things to Watch Out For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-800 dark:text-amber-300 whitespace-pre-wrap">
              {trip.details.disadvantages}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Photo Gallery */}
      {trip.images.length > 0 && (
        <>
          <Separator />
          <h2 className="text-2xl font-bold">Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {trip.images.map((img, idx) => (
              <button
                key={`gallery-${trip.id}-${idx}`}
                type="button"
                className="relative aspect-video rounded-md overflow-hidden bg-muted cursor-pointer"
                onClick={() =>
                  setSelectedMedia({
                    type: 'image',
                    src: img,
                    alt: `${trip.title} photo ${idx + 1}`,
                    caption: trip.title,
                  })
                }
              >
                <Image
                  src={img}
                  alt={`Trip photo ${idx + 1}`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Videos */}
      {trip.videos.length > 0 && (
        <>
          <Separator />
          <h2 className="text-2xl font-bold">Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trip.videos.map((video, idx) => (
              <div
                key={`video-${trip.id}-${idx}`}
                className="relative aspect-video rounded-md overflow-hidden bg-muted"
              >
                <video
                  src={video}
                  controls
                  className="w-full h-full object-cover"
                >
                  <track kind="captions" />
                </video>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Cost Breakdown */}
      {costs.length > 0 && (
        <>
          <Separator />
          <h2 className="text-2xl font-bold">Cost Breakdown</h2>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium">
                    Category
                  </th>
                  <th className="text-right p-3 text-sm font-medium">Amount</th>
                  <th className="text-left p-3 text-sm font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {costs.map(cost => (
                  <tr key={cost.id} className="border-b last:border-0">
                    <td className="p-3 text-sm capitalize">{cost.category}</td>
                    <td className="p-3 text-sm text-right font-mono">
                      {formatCurrency(cost.amount, cost.currency)}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {cost.note || '—'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/50 font-semibold">
                  <td className="p-3 text-sm">Total</td>
                  <td className="p-3 text-sm text-right font-mono">
                    {formatCurrency(totalCost, costs[0]?.currency || 'VND')}
                  </td>
                  <td className="p-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Participants */}
      {trip.participants.length > 0 && (
        <>
          <Separator />
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Travelers
          </h2>
          <div className="flex flex-wrap gap-4">
            {trip.participants.map(p => (
              <div
                key={p.id || p.name}
                className="flex items-center gap-3 rounded-full bg-muted pl-1 pr-4 py-1"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={p.avatarUrl} alt={p.name} />
                  <AvatarFallback>{p.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{p.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <MediaViewerModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </main>
  )
}
