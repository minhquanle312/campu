import { Trip, TripDetails } from '@/models/trips.model'

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapDetails(details: any): TripDetails | undefined {
  if (!details) return undefined

  const mapped: TripDetails = {}

  if (details.vehicle) mapped.vehicle = details.vehicle
  if (details.article) mapped.article = details.article
  if (details.difficulty) mapped.difficulty = details.difficulty
  if (details.vibe) mapped.vibe = details.vibe
  if (details.preparation) mapped.preparation = details.preparation
  if (details.scenery_quality != null)
    mapped.sceneryQuality = details.scenery_quality
  if (details.cuisine_experience != null)
    mapped.cuisineExperience = details.cuisine_experience
  if (details.disadvantages) mapped.disadvantages = details.disadvantages
  if (details.duration_days != null) mapped.durationDays = details.duration_days
  if (details.best_season) mapped.bestSeason = details.best_season

  return Object.keys(mapped).length > 0 ? mapped : undefined
}

export function mapTripDocToViewModel(doc: any): Trip {
  const participants = doc.participant_ids ?? []

  return {
    id: doc._id?.toString() ?? doc.id,
    title: doc.title,
    date: doc.date,
    summary: doc.summary,
    provinceName: doc.province_id?.name ?? '',
    provinceId: doc.province_id?._id?.toString() || undefined,
    provinceCode:
      typeof doc.province_id?.code === 'number'
        ? doc.province_id.code
        : Number(doc.province_id?.code) || undefined,
    participants: participants.map((p: any) => ({
      id: p._id?.toString() ?? p.id,
      name: p.name ?? '',
      avatarUrl: p.avatar_url ?? '',
      email: p.email ?? '',
    })),
    participantIds: participants
      .map((p: any) => p._id?.toString() ?? p.id)
      .filter(Boolean),
    images: doc.images ?? [],
    videos: doc.videos ?? [],
    coverImage: doc.cover_image || undefined,
    details: mapDetails(doc.details),
  }
}
