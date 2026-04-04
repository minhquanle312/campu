'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PROVINCES_GEO_MAPPING } from '@/config/province'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  provinceId: z.string().min(1, 'Province is required'),
  images: z.string().optional(),
  videos: z.string().optional(),
  coverImage: z.string().optional(),
  vehicle: z.string().optional(),
  article: z.string().optional(),
  difficulty: z.string().optional(),
  vibe: z.string().optional(),
  preparation: z.string().optional(),
  sceneryQuality: z.string().optional(),
  cuisineExperience: z.string().optional(),
  disadvantages: z.string().optional(),
  durationDays: z.string().optional(),
  bestSeason: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function AddTripForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      date: '',
      summary: '',
      provinceId: '',
      images: '',
      videos: '',
      coverImage: '',
      vehicle: '',
      article: '',
      difficulty: '',
      vibe: '',
      preparation: '',
      sceneryQuality: '',
      cuisineExperience: '',
      disadvantages: '',
      durationDays: '',
      bestSeason: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    try {
      const details: Record<string, any> = {}
      if (values.vehicle) details.vehicle = values.vehicle
      if (values.article) details.article = values.article
      if (values.difficulty) details.difficulty = values.difficulty
      if (values.vibe) details.vibe = values.vibe
      if (values.preparation) details.preparation = values.preparation
      if (values.sceneryQuality)
        details.scenery_quality = Number(values.sceneryQuality)
      if (values.cuisineExperience)
        details.cuisine_experience = Number(values.cuisineExperience)
      if (values.disadvantages) details.disadvantages = values.disadvantages
      if (values.durationDays)
        details.duration_days = Number(values.durationDays)
      if (values.bestSeason) details.best_season = values.bestSeason

      const body: Record<string, any> = {
        title: values.title,
        date: values.date,
        summary: values.summary,
        province_id: values.provinceId,
        participant_ids: [],
        images: (values.images || '')
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
        videos: (values.videos || '')
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
      }

      if (values.coverImage) body.cover_image = values.coverImage
      if (Object.keys(details).length > 0) body.details = details

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create trip')
      }

      toast.success('Trip created successfully!')
      router.push('/journey')
    } catch (err: any) {
      toast.error(err.message || 'Failed to create trip')
    } finally {
      setSubmitting(false)
    }
  }

  const provinces = Object.entries(PROVINCES_GEO_MAPPING).map(([id, name]) => ({
    id,
    name,
  }))

  const articleValue = form.watch('article')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter trip title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="provinceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.map(province => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your trip..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share your experience and highlights
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Motorcycle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="extreme">Extreme</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vibe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vibe</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Adventurous" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bestSeason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Best Season</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Oct-Dec" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preparation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparation Tips</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What to prepare..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disadvantages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disadvantages</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any downsides..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URLs (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="https://image1.jpg"
                      className="min-h-24 font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URLs (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="https://video1.mp4"
                      className="min-h-20 font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Article */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Article (Markdown)</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4" /> Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> Show Preview
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="article"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Write your trip story in markdown..."
                      className="min-h-48 font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showPreview && articleValue && (
              <div className="rounded-lg border p-4">
                <MarkdownRenderer
                  content={articleValue}
                  className="prose prose-pink dark:prose-invert max-w-none"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Trip'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/journey')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
