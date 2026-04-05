import { z } from 'zod'

const tripDetailsSchema = z
  .object({
    vehicle: z.string().optional(),
    article: z.string().optional(),
    difficulty: z.enum(['easy', 'moderate', 'hard', 'extreme']).optional(),
    vibe: z.string().optional(),
    preparation: z.string().optional(),
    scenery_quality: z.number().min(1).max(5).optional(),
    cuisine_experience: z.number().min(1).max(5).optional(),
    disadvantages: z.string().optional(),
    duration_days: z.number().optional(),
    best_season: z.string().optional(),
  })
  .strict()

export const createTripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  summary: z.string().min(1, 'Summary is required'),
  province_id: z.string().min(1, 'Province is required'),
  participant_ids: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  cover_image: z.string().optional(),
  details: tripDetailsSchema.optional(),
})

export const updateTripSchema = z.object({
  title: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  province_id: z.string().min(1).optional(),
  participant_ids: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  cover_image: z.string().nullable().optional(),
  details: tripDetailsSchema.optional(),
})

export const createTripCostSchema = z.object({
  category: z.enum(['transport', 'food', 'accommodation', 'activity', 'other']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('VND'),
  note: z.string().optional(),
})

export const updateTripCostSchema = z.object({
  category: z
    .enum(['transport', 'food', 'accommodation', 'activity', 'other'])
    .optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  note: z.string().nullable().optional(),
})
