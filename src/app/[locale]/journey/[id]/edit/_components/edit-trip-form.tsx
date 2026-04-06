'use client'

import { useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
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
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Province } from '@/models/province.model'

interface EditTripFormProps {
  trip: Trip
  costs: TripCost[]
  provinces: Province[]
}

type UploadAuthResponse = {
  token: string
  expire: number
  signature: string
  publicKey: string
  folder: string
}

type ImageKitUploadResponse = {
  fileId?: string
  url?: string
  name?: string
  filePath?: string
  width?: number
  height?: number
  thumbnailUrl?: string
  message?: string
}

async function uploadFileToImageKit(file: File): Promise<string> {
  const authResponse = await fetch('/api/imagekit/upload-auth')
  if (!authResponse.ok) {
    throw new Error('Unable to get upload authorization')
  }

  const uploadAuth = (await authResponse.json()) as UploadAuthResponse
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', file.name)
  formData.append('publicKey', uploadAuth.publicKey)
  formData.append('signature', uploadAuth.signature)
  formData.append('expire', String(uploadAuth.expire))
  formData.append('token', uploadAuth.token)
  formData.append('folder', '/journey/')

  const uploadResponse = await fetch(
    'https://upload.imagekit.io/api/v1/files/upload',
    { method: 'POST', body: formData },
  )

  const uploadData = (await uploadResponse.json()) as ImageKitUploadResponse

  if (!uploadResponse.ok || !uploadData.url) {
    throw new Error(uploadData.message || 'ImageKit upload failed')
  }

  return uploadData.url
}

export function EditTripForm({
  trip,
  costs: initialCosts,
  provinces,
}: EditTripFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [uploading, setUploading] = useState<'cover' | 'images' | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const imagesInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = useState(trip.title)
  const [date, setDate] = useState(
    new Date(trip.date).toISOString().split('T')[0],
  )
  const [summary, setSummary] = useState(trip.summary)
  const [provinceId, setProvinceId] = useState(trip.provinceId.toString())
  const [imagesList, setImagesList] = useState<string[]>(trip.images)
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

  // const provinces = Object.entries(PROVINCES_GEO_MAPPING).map(([id, name]) => ({
  //   id,
  //   name,
  // }))

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading('cover')
    try {
      const url = await uploadFileToImageKit(file)
      setCoverImage(url)
      toast.success('Cover image uploaded')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading('images')
    try {
      const urls = await Promise.all(
        Array.from(files).map(uploadFileToImageKit),
      )
      setImagesList(prev => [...prev, ...urls])
      toast.success(`${urls.length} image(s) uploaded`)
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(null)
      if (imagesInputRef.current) imagesInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImagesList(prev => prev.filter((_, i) => i !== index))
  }

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
        province_id: provinceId,
        images: imagesList,
        videos: videos
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
      }

      if (coverImage) body.cover_image = coverImage
      else body.cover_image = null
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
    if (
      !confirm(
        'Are you sure you want to delete this trip? This cannot be undone.',
      )
    )
      return

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
              <Label>Scenery Quality (1-5)</Label>
              <Select value={sceneryQuality} onValueChange={setSceneryQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate scenery" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={String(n)}>
                      {'\u2605'.repeat(n)}
                      {'\u2606'.repeat(5 - n)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cuisine Experience (1-5)</Label>
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
                      {'\u2605'.repeat(n)}
                      {'\u2606'.repeat(5 - n)}
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

      {/* Media - Cover Image */}
      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {coverImage && (
            <div className="relative aspect-video max-w-md rounded-lg overflow-hidden bg-muted">
              <Image
                src={coverImage}
                alt="Cover preview"
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => setCoverImage('')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-3">
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading === 'cover'}
            >
              {uploading === 'cover' ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading === 'cover' ? 'Uploading...' : 'Upload Cover'}
            </Button>
            <span className="text-sm text-muted-foreground self-center">
              or
            </span>
            <Input
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="Paste image URL"
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media - Trip Images */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {imagesList.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {imagesList.map((img, idx) => (
                <div
                  key={img}
                  className="relative aspect-video rounded-md overflow-hidden bg-muted group"
                >
                  <Image
                    src={img}
                    alt={`Trip image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(idx)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <input
              ref={imagesInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => imagesInputRef.current?.click()}
              disabled={uploading === 'images'}
            >
              {uploading === 'images' ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading === 'images' ? 'Uploading...' : 'Upload Images'}
            </Button>
            <p className="text-sm text-muted-foreground self-center">
              {imagesList.length} image{imagesList.length === 1 ? '' : 's'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Videos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="videos">Video URLs (one per line)</Label>
          <Textarea
            id="videos"
            value={videos}
            onChange={e => setVideos(e.target.value)}
            placeholder="https://video1.mp4"
            className="min-h-20 font-mono text-sm"
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
                    <th className="text-left p-3 text-sm font-medium">
                      Category
                    </th>
                    <th className="text-right p-3 text-sm font-medium">
                      Amount
                    </th>
                    <th className="text-left p-3 text-sm font-medium">Note</th>
                    <th className="p-3 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {costs.map(cost => (
                    <tr key={cost.id} className="border-b last:border-0">
                      <td className="p-3 text-sm capitalize">
                        {cost.category}
                      </td>
                      <td className="p-3 text-sm text-right font-mono">
                        {cost.amount.toLocaleString()} {cost.currency}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {cost.note || '\u2014'}
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
              <Select
                value={newCostCategory}
                onValueChange={setNewCostCategory}
              >
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
