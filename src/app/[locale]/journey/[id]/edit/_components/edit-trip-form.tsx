'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trip, TripCost } from '@/models/trips.model'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { PROVINCES_GEO_MAPPING } from '@/config/province'
import { ArrowLeft, Eye, EyeOff, Plus, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface EditTripFormProps {
  trip: Trip
  rawTrip: any
  costs: TripCost[]
}

export function EditTripForm({ trip, rawTrip, costs: initialCosts }: EditTripFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Form state
  const [title, setTitle] = useState(trip.title)
  const [date, setDate] = useState(
    new Date(trip.date).toISOString().split('T')[0],
  )
  const [summary, setSummary] = useState(trip.summary)
  const [provinceId, setProvinceId] = useState(
    rawTrip.province_id?._id?.toString() || rawTrip.province_id?.toString() || '',
  )
  const [images, setImages] = useState(trip.images.join('\n'))
  const [videos, setVideos] = useState(trip.videos.join('\n'))
  const [coverImage, setCoverImage] = useState(trip.coverImage || '')

  // Details
  const [vehicle, setVehicle] = useState(trip.details?.vehicle || '')
  const [article, setArticle] = useState(trip.details?.article || '')
  const [difficulty, setDifficulty] = useState(trip.details?.difficulty || '')
  const [vibe, setVibe] = useState(trip.details?.vibe || '')
  const [preparation, setPreparation] = useState(
    trip.details?.preparation || '',
  )
  const [sceneryQuality, setSceneryQuality] = useState(
    trip.details?.sceneryQuality?.toString() || '',
  )
  const [cuisineExperience, setCuisineExperience] = useState(
    trip.details?.cuisineExperience?.toString() || '',
  )
  const [disadvantages, setDisadvantages] = useState(
    trip.details?.disadvantages || '',
  )
  const [durationDays, setDurationDays] = useState(
    trip.details?.durationDays?.toString() || '',
  )
  const [bestSeason, setBestSeason] = useState(trip.details?.bestSeason || '')

  // Costs
  const [costs, setCosts] = useState<TripCost[]>(initialCosts)
  const [newCostCategory, setNewCostCategory] = useState('')
  const [newCostAmount, setNewCostAmount] = useState('')
  const [newCostNote, setNewCostNote] = useState('')

  const provinces = Object.entries(PROVINCES_GEO_MAPPING).map(([id, name]) => ({
    id,
    name,
  }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const details: Record<string, any> = {}
      if (vehicle) details.vehicle = vehicle
      if (article) details.article = article
      if (difficulty) details.difficulty = difficulty
      if (vibe) details.vibe = vibe
      if (preparation) details.preparation = preparation
      if (sceneryQuality) details.scenery_quality = Number(sceneryQuality)
      if (cuisineExperience)
        details.cuisine_experience = Number(cuisineExperience)
      if (disadvantages) details.disadvantages = disadvantages
      if (durationDays) details.duration_days = Number(durationDays)
      if (bestSeason) details.best_season = bestSeason

      const body: Record<string, any> = {
        title,
        date,
        summary,
        images: images
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
        videos: videos
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
      }

      if (coverImage) body.cover_image = coverImage
      if (Object.keys(details).length > 0) body.details = details

      const res = await fetch(`/api/trips/${trip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }

      toast.success('Trip updated successfully')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save trip')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCost = async () => {
    if (!newCostCategory || !newCostAmount) return

    try {
      const res = await fetch(`/api/trips/${trip.id}/costs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCostCategory,
          amount: Number(newCostAmount),
          currency: 'VND',
          note: newCostNote || undefined,
        }),
      })

      if (!res.ok) throw new Error('Failed to add cost')

      const newCost = await res.json()
      setCosts(prev => [...prev, newCost])
      setNewCostCategory('')
      setNewCostAmount('')
      setNewCostNote('')
      toast.success('Cost added')
    } catch {
      toast.error('Failed to add cost')
    }
  }

  const handleDeleteCost = async (costId: string) => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/costs/${costId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete cost')

      setCosts(prev => prev.filter(c => c.id !== costId))
      toast.success('Cost deleted')
    } catch {
      toast.error('Failed to delete cost')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trip? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/trips/${trip.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Trip deleted')
      router.push('/journey')
    } catch {
      toast.error('Failed to delete trip')
    }
  }

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <Link href={`/journey/${trip.id}`}>
        <Button type="button" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Trip
        </Button>
      </Link>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Trip title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Select value={provinceId} onValueChange={setProvinceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary *</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Trip summary"
              className="min-h-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trip Details */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Input
                id="vehicle"
                value={vehicle}
                onChange={e => setVehicle(e.target.value)}
                placeholder="e.g. Motorcycle, Bus"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="extreme">Extreme</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vibe">Vibe</Label>
              <Input
                id="vibe"
                value={vibe}
                onChange={e => setVibe(e.target.value)}
                placeholder="e.g. Adventurous, Relaxing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationDays">Duration (days)</Label>
              <Input
                id="durationDays"
                type="number"
                value={durationDays}
                onChange={e => setDurationDays(e.target.value)}
                placeholder="e.g. 3"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sceneryQuality">Scenery Quality (1-5)</Label>
              <Select value={sceneryQuality} onValueChange={setSceneryQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate scenery" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={String(n)}>
                      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuisineExperience">Cuisine Experience (1-5)</Label>
              <Select
                value={cuisineExperience}
                onValueChange={setCuisineExperience}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={String(n)}>
                      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bestSeason">Best Season</Label>
            <Input
              id="bestSeason"
              value={bestSeason}
              onChange={e => setBestSeason(e.target.value)}
              placeholder="e.g. Spring, Oct-Dec"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preparation">Preparation Tips</Label>
            <Textarea
              id="preparation"
              value={preparation}
              onChange={e => setPreparation(e.target.value)}
              placeholder="What to prepare or bring..."
              className="min-h-20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disadvantages">Disadvantages / Warnings</Label>
            <Textarea
              id="disadvantages"
              value={disadvantages}
              onChange={e => setDisadvantages(e.target.value)}
              placeholder="Any downsides or things to watch out for..."
              className="min-h-20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Image URLs (one per line)</Label>
            <Textarea
              id="images"
              value={images}
              onChange={e => setImages(e.target.value)}
              placeholder="https://image1.jpg\nhttps://image2.jpg"
              className="min-h-24 font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videos">Video URLs (one per line)</Label>
            <Textarea
              id="videos"
              value={videos}
              onChange={e => setVideos(e.target.value)}
              placeholder="https://video1.mp4"
              className="min-h-20 font-mono text-sm"
            />
          </div>
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
          <Textarea
            value={article}
            onChange={e => setArticle(e.target.value)}
            placeholder="Write your trip story in markdown..."
            className="min-h-48 font-mono text-sm"
          />
          {showPreview && article && (
            <div className="rounded-lg border p-4">
              <MarkdownRenderer
                content={article}
                className="prose prose-pink dark:prose-invert max-w-none"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Costs */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {costs.length > 0 && (
            <div className="rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Category</th>
                    <th className="text-right p-3 text-sm font-medium">Amount</th>
                    <th className="text-left p-3 text-sm font-medium">Note</th>
                    <th className="p-3 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {costs.map(cost => (
                    <tr key={cost.id} className="border-b last:border-0">
                      <td className="p-3 text-sm capitalize">{cost.category}</td>
                      <td className="p-3 text-sm text-right font-mono">
                        {cost.amount.toLocaleString()} {cost.currency}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {cost.note || '—'}
                      </td>
                      <td className="p-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteCost(cost.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Separator />

          <div className="flex gap-2 items-end">
            <div className="space-y-1 flex-1">
              <Label>Category</Label>
              <Select value={newCostCategory} onValueChange={setNewCostCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 w-32">
              <Label>Amount</Label>
              <Input
                type="number"
                value={newCostAmount}
                onChange={e => setNewCostAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1 flex-1">
              <Label>Note</Label>
              <Input
                value={newCostNote}
                onChange={e => setNewCostNote(e.target.value)}
                placeholder="Optional note"
              />
            </div>
            <Button type="button" variant="outline" onClick={handleAddCost}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete Trip
        </Button>
        <Button type="button" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
