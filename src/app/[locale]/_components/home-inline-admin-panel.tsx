'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import {
  Check,
  ExternalLink,
  LoaderCircle,
  Settings2,
  Upload,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/i18n/navigation'
import type { GeneralConfig, GeneralConfigAsset } from '@/types/general-config'

type HomeInlineAdminPanelProps = {
  initialConfig: GeneralConfig
}

type HomeImageSlot = 'primaryImage' | 'secondaryImage'

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

const STATIC_FALLBACK_IMAGE = '/for-pu/avatar.jpg'

const imageSlotMeta: Array<{
  slot: HomeImageSlot
  title: string
  description: string
}> = [
  {
    slot: 'primaryImage',
    title: 'Primary hero image',
    description: 'Used in the top hero card on the homepage.',
  },
  {
    slot: 'secondaryImage',
    title: 'Secondary story image',
    description: 'Used in the Journey Story section lower on the homepage.',
  },
]

function resolvePreviewSource(asset: GeneralConfigAsset | null) {
  return asset?.url || STATIC_FALLBACK_IMAGE
}

function mapUploadToAsset(
  upload: ImageKitUploadResponse,
  fallbackName: string,
): GeneralConfigAsset {
  if (!upload.fileId || !upload.url || !upload.filePath) {
    throw new Error(
      upload.message || 'Image upload did not return a usable asset',
    )
  }

  return {
    fileId: upload.fileId,
    url: upload.url,
    name: upload.name || fallbackName,
    filePath: upload.filePath,
    width: typeof upload.width === 'number' ? upload.width : undefined,
    height: typeof upload.height === 'number' ? upload.height : undefined,
    thumbnailUrl:
      typeof upload.thumbnailUrl === 'string' ? upload.thumbnailUrl : undefined,
  }
}

export default function HomeInlineAdminPanel({
  initialConfig,
}: HomeInlineAdminPanelProps) {
  const router = useRouter()
  const fileInputRefs = useRef<Record<HomeImageSlot, HTMLInputElement | null>>({
    primaryImage: null,
    secondaryImage: null,
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingSlot, setUploadingSlot] = useState<HomeImageSlot | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [liveConfig, setLiveConfig] = useState<GeneralConfig>(initialConfig)
  const [draftHomepage, setDraftHomepage] = useState(initialConfig.homepage)

  const hasDraftChanges = useMemo(() => {
    return JSON.stringify(draftHomepage) !== JSON.stringify(liveConfig.homepage)
  }, [draftHomepage, liveConfig.homepage])

  const resetDrafts = () => {
    setDraftHomepage(liveConfig.homepage)
    setErrorMessage(null)
    setSuccessMessage(null)

    for (const slot of ['primaryImage', 'secondaryImage'] as const) {
      const input = fileInputRefs.current[slot]

      if (input) {
        input.value = ''
      }
    }
  }

  const uploadFileToImageKit = async (file: File) => {
    const authResponse = await fetch('/api/imagekit/upload-auth')

    if (!authResponse.ok) {
      throw new Error('Unable to get protected upload authorization')
    }

    const uploadAuth = (await authResponse.json()) as UploadAuthResponse
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    formData.append('publicKey', uploadAuth.publicKey)
    formData.append('signature', uploadAuth.signature)
    formData.append('expire', String(uploadAuth.expire))
    formData.append('token', uploadAuth.token)
    formData.append('folder', uploadAuth.folder)

    const uploadResponse = await fetch(
      'https://upload.imagekit.io/api/v1/files/upload',
      {
        method: 'POST',
        body: formData,
      },
    )

    const uploadData = (await uploadResponse.json()) as ImageKitUploadResponse

    if (!uploadResponse.ok) {
      throw new Error(uploadData.message || 'ImageKit upload failed')
    }

    return mapUploadToAsset(uploadData, file.name)
  }

  const handleFileChange = async (
    slot: HomeImageSlot,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setErrorMessage(null)
    setSuccessMessage(null)
    setUploadingSlot(slot)

    try {
      const uploadedAsset = await uploadFileToImageKit(file)
      setDraftHomepage(current => ({
        ...current,
        [slot]: uploadedAsset,
      }))
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to upload the selected image',
      )
    } finally {
      setUploadingSlot(null)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/general-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homepage: draftHomepage,
          cv: liveConfig.cv,
          aiAssistant: liveConfig.aiAssistant,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save homepage images')
      }

      const nextConfig = (await response.json()) as GeneralConfig
      setLiveConfig(nextConfig)
      setDraftHomepage(nextConfig.homepage)
      setSuccessMessage('Homepage images saved.')
      router.refresh()
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to save homepage images',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="pb-10 sm:pb-12">
      <div className="container">
        <Card className="overflow-hidden rounded-[1.75rem] border-primary/10 bg-white/85 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200/80 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
                Admin only
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                  Homepage image editor
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Upload replacements for the two homepage image slots, preview
                  them here, then save when you are ready to update the homepage
                  images.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <Button
                type="button"
                variant={isExpanded ? 'secondary' : 'default'}
                className="rounded-full px-5"
                onClick={() => {
                  setIsExpanded(current => !current)
                  setErrorMessage(null)
                  setSuccessMessage(null)
                }}
              >
                {isExpanded ? 'Hide editor' : 'Edit homepage images'}
              </Button>

              <Button
                asChild
                type="button"
                variant="outline"
                className="rounded-full px-5"
              >
                <Link href="/admin/general">
                  Open site settings
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {isExpanded ? (
            <div className="space-y-6 px-6 py-6">
              <div className="grid gap-5 lg:grid-cols-2">
                {imageSlotMeta.map(item => {
                  const liveAsset = liveConfig.homepage[item.slot]
                  const draftAsset = draftHomepage[item.slot]
                  const isUploading = uploadingSlot === item.slot

                  return (
                    <div
                      key={item.slot}
                      className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-3">
                          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                            Live image
                          </p>
                          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <Image
                              fill
                              src={resolvePreviewSource(liveAsset)}
                              alt={`${item.title} live preview`}
                              className="object-cover"
                            />
                          </div>
                          <p className="break-all text-xs leading-5 text-slate-500">
                            {liveAsset?.url ||
                              'Using current static fallback image.'}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                            Draft preview
                          </p>
                          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-white">
                            <Image
                              fill
                              src={resolvePreviewSource(draftAsset)}
                              alt={`${item.title} draft preview`}
                              className="object-cover"
                            />
                          </div>
                          <p className="break-all text-xs leading-5 text-slate-500">
                            {draftAsset?.url ||
                              'No saved asset yet — the public fallback remains in use.'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`homepage-${item.slot}`}>
                          Upload replacement
                        </Label>
                        <Input
                          id={`homepage-${item.slot}`}
                          type="file"
                          accept="image/*"
                          ref={element => {
                            fileInputRefs.current[item.slot] = element
                          }}
                          onChange={event => handleFileChange(item.slot, event)}
                          disabled={isUploading || isSaving}
                          className="cursor-pointer bg-white file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {isUploading ? (
                          <>
                            <LoaderCircle
                              className="h-4 w-4 animate-spin"
                              aria-hidden="true"
                            />
                            Uploading draft image…
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" aria-hidden="true" />
                            Uploading alone does not update the homepage — save
                            your changes to the live homepage.
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {successMessage}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-2 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full px-5"
                  onClick={resetDrafts}
                  disabled={
                    isSaving || uploadingSlot !== null || !hasDraftChanges
                  }
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Cancel draft changes
                </Button>
                <Button
                  type="button"
                  className="rounded-full px-5"
                  onClick={handleSave}
                  disabled={
                    isSaving || uploadingSlot !== null || !hasDraftChanges
                  }
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Saving…
                    </>
                  ) : (
                    'Save homepage images'
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </section>
  )
}
