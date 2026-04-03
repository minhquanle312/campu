'use client'

import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Calendar,
  Users,
  Image as ImageIcon,
  Eye,
  Pencil,
  Camera,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PROVINCES_GEO_MAPPING } from '@/config/province'
import {
  MediaViewerModal,
  type MediaItem,
} from '@/components/media-viewer-modal'
import { Trip } from '@/models/trips.model'

interface ProvinceDetailSheetProps {
  provinceId: number | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trips: Trip[]
  isAdmin?: boolean
}

export function ProvinceDetailSheet({
  provinceId,
  isOpen,
  onOpenChange,
  trips,
  isAdmin = false,
}: ProvinceDetailSheetProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  const selectedTrips = trips.filter(t => t.provinceId === provinceId)

  const provinceName =
    provinceId !== null
      ? PROVINCES_GEO_MAPPING[provinceId as keyof typeof PROVINCES_GEO_MAPPING]
      : ''

  // Province stats
  const totalParticipants = new Set(
    selectedTrips.flatMap(t => t.participants.map(p => p.id || p.name)),
  ).size
  const dates = selectedTrips.map(t => new Date(t.date).getTime())
  const dateRange =
    dates.length > 0
      ? {
          earliest: new Date(Math.min(...dates)).toLocaleDateString(),
          latest: new Date(Math.max(...dates)).toLocaleDateString(),
        }
      : null

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <MapPin className="h-6 w-6 text-primary" />
            {provinceName}
          </SheetTitle>
          <SheetDescription>
            {selectedTrips.length > 0 ? (
              <span className="flex flex-wrap gap-3">
                <span>
                  {selectedTrips.length} trip
                  {selectedTrips.length > 1 ? 's' : ''}
                </span>
                <span>
                  {totalParticipants} participant
                  {totalParticipants === 1 ? '' : 's'}
                </span>
                {dateRange && (
                  <span>
                    {dateRange.earliest === dateRange.latest
                      ? dateRange.earliest
                      : `${dateRange.earliest} — ${dateRange.latest}`}
                  </span>
                )}
              </span>
            ) : (
              'No trips recorded for this province yet.'
            )}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <ScrollArea className="flex-1 h-full p-6 pt-4">
          <div className="space-y-6 pb-8">
            {selectedTrips.map(trip => (
              <div
                key={trip.id}
                className="rounded-lg border border-border p-4 space-y-4 hover:shadow-sm transition-shadow"
              >
                {/* Cover image or first image */}
                {(trip.coverImage || trip.images[0]) && (
                  <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                    <Image
                      src={trip.coverImage || trip.images[0]}
                      alt={trip.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{trip.title}</h3>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-3 w-3" />
                      {new Date(trip.date).toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {trip.summary}
                  </p>
                </div>

                {/* Quick info badges */}
                <div className="flex flex-wrap gap-2">
                  {trip.details?.difficulty && (
                    <Badge variant="secondary">{trip.details.difficulty}</Badge>
                  )}
                  {trip.details?.vibe && (
                    <Badge variant="secondary">{trip.details.vibe}</Badge>
                  )}
                  {trip.details?.durationDays && (
                    <Badge variant="secondary">
                      {trip.details.durationDays} day
                      {trip.details.durationDays > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {trip.images.length > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      {trip.images.length} photo
                      {trip.images.length === 1 ? '' : 's'}
                    </Badge>
                  )}
                </div>

                {/* Participants */}
                {trip.participants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      With:
                    </span>
                    <div className="flex -space-x-2">
                      {trip.participants.map(p => (
                        <Avatar
                          key={p.id || p.name}
                          className="border-2 border-background w-8 h-8"
                        >
                          <AvatarImage src={p.avatarUrl} alt={p.name} />
                          <AvatarFallback>{p.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <Link href={`/journey/${trip.id}`}>
                    <Button type="button" variant="outline" size="sm">
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href={`/journey/${trip.id}/edit`}>
                      <Button type="button" variant="ghost" size="sm">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                  )}
                </div>

                <Separator className="mt-2" />
              </div>
            ))}

            {selectedTrips.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-4">
                <div className="bg-muted p-4 rounded-full">
                  <ImageIcon className="h-8 w-8 opacity-50" />
                </div>
                <p>We haven&apos;t visited here yet!</p>
                <p className="text-xs">
                  Maybe this will be our next adventure 🌟
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
      <MediaViewerModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </Sheet>
  )
}
