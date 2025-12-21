import { User } from './users.model'

export interface Trip {
  id: string
  title: string
  date: string
  summary: string
  provinceName: string
  provinceId: number
  participants: User[]
  participantIds: string[]
  images: string[]
  videos: string[]
}
