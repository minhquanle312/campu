import { User } from './users.model'

export interface TripDetails {
  vehicle?: string
  article?: string
  difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme'
  vibe?: string
  preparation?: string
  sceneryQuality?: number
  cuisineExperience?: number
  disadvantages?: string
  durationDays?: number
  bestSeason?: string
}

export interface TripCost {
  id: string
  tripId: string
  category: string
  amount: number
  currency: string
  note?: string
}

export interface Trip {
  id: string
  title: string
  date: string
  summary: string
  provinceName: string
  provinceId: string
  provinceCode: number
  participants: User[]
  participantIds: string[]
  images: string[]
  videos: string[]
  coverImage?: string
  details?: TripDetails
}
