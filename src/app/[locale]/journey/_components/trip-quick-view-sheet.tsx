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
  Eye,
  Pencil,
  Car,
  Clock,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MediaViewerModal,
  type MediaItem,
} from '@/components/media-viewer-modal'
import { Trip } from '@/models/trips.model'

interface TripQuickViewSheetProps {
  trip: Trip | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isAdmin?: boolean
}

export function TripQuickViewSheet({
  trip,
  isOpen,
  onOpenChange,
  isAdmin = false,
}: TripQuickViewSheetProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  if (!trip) return null

  const previewImages = trip.images.slice(0, 4)

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            {trip.title}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {trip.provinceName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(trip.date).toLocaleDateString()}
            </span>
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <ScrollArea className="flex-1 h-full p-6 pt-4">
          <div className="space-y-6 pb-8">
            {/* Summary */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {trip.summary}
            </p>

            {/* Quick info badges */}
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
                  <Badge variant="secondary">
                    {trip.details.vibe}
                  </Badge>
                )}
              </div>
            )}

            {/* Participants */}
            {trip.participants.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">With:</span>
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

            {/* Image preview - 2x2 grid */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {previewImages.map((img, idx) => (
                  <button
                    key={`img-${trip.id}-${idx}`}
                    type="button"
                    className="relative aspect-video rounded-md overflow-hidden bg-muted group cursor-pointer"
                    onClick={() =>
                      setSelectedMedia({
                        type: 'image',
                        src: img,
                        alt: trip.title,
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
                {trip.images.length > 4 && (
                  <p className="text-xs text-muted-foreground col-span-2 text-center">
                    +{trip.images.length - 4} more photos
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Link href={`/journey/${trip.id}`} className="flex-1">
                <Button type="button" className="w-full" variant="default">
                  <Eye className="h-4 w-4" />
                  View Full Details
                </Button>
              </Link>
              {isAdmin && (
                <Link href={`/journey/${trip.id}/edit`}>
                  <Button type="button" variant="outline">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              )}
            </div>
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
