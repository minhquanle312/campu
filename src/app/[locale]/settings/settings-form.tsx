'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import type {
  GeneralConfig,
  GeneralConfigDocumentGroup,
} from '@/types/general-config'

type SettingsFormProps = {
  initialConfig: GeneralConfig
}

function createEmptyDocumentGroup(): GeneralConfigDocumentGroup {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    documentUrls: [],
  }
}

export default function SettingsForm({ initialConfig }: SettingsFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [config, setConfig] = useState<GeneralConfig>(initialConfig)

  const updateDocumentGroup = (
    index: number,
    updates: Partial<GeneralConfigDocumentGroup>,
  ) => {
    setConfig(current => ({
      ...current,
      aiAssistant: {
        ...current.aiAssistant,
        documentGroups: current.aiAssistant.documentGroups.map(
          (group, groupIndex) =>
            groupIndex === index ? { ...group, ...updates } : group,
        ),
      },
    }))
  }

  const removeDocumentGroup = (index: number) => {
    setConfig(current => ({
      ...current,
      aiAssistant: {
        ...current.aiAssistant,
        documentGroups: current.aiAssistant.documentGroups.filter(
          (_, groupIndex) => groupIndex !== index,
        ),
      },
    }))
  }

  const addDocumentGroup = () => {
    setConfig(current => ({
      ...current,
      aiAssistant: {
        ...current.aiAssistant,
        documentGroups: [
          ...current.aiAssistant.documentGroups,
          createEmptyDocumentGroup(),
        ],
      },
    }))
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/general-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      const nextConfig = (await response.json()) as GeneralConfig
      setConfig(nextConfig)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Failed to save settings.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 pb-20">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">
            Homepage Images
          </h2>
          <p className="text-sm text-slate-500">
            Homepage images are edited inline on the Home page. This settings
            page shows the currently saved asset URLs.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Primary image</p>
            <p className="break-all text-sm text-slate-500">
              {config.homepage.primaryImage?.url || 'No image selected'}
            </p>
          </div>
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              Secondary image
            </p>
            <p className="break-all text-sm text-slate-500">
              {config.homepage.secondaryImage?.url || 'No image selected'}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">CV Settings</h2>
          <p className="text-sm text-slate-500">
            Control admin-managed CV behavior without changing public CV access.
          </p>
        </div>

        <label className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Enable HR assistant
            </p>
            <p className="text-sm text-slate-500">
              Toggle the recruiter assistant availability on the CV page.
            </p>
          </div>
          <input
            type="checkbox"
            checked={config.cv.hrAssistantEnabled}
            onChange={event =>
              setConfig(current => ({
                ...current,
                cv: {
                  ...current.cv,
                  hrAssistantEnabled: event.target.checked,
                },
              }))
            }
            className="h-5 w-5 rounded border-slate-300"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">
              AI Assistant Document Groups
            </h2>
            <p className="text-sm text-slate-500">
              Store metadata for future AI assistant knowledge groups.
            </p>
          </div>
          <button
            type="button"
            onClick={addDocumentGroup}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Add group
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {config.aiAssistant.documentGroups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No document groups configured yet.
            </div>
          ) : null}

          {config.aiAssistant.documentGroups.map((group, index) => (
            <div
              key={group.id || `document-group-${index}`}
              className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Group name
                  </span>
                  <input
                    value={group.name}
                    onChange={event =>
                      updateDocumentGroup(index, { name: event.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Group id
                  </span>
                  <input
                    value={group.id}
                    onChange={event =>
                      updateDocumentGroup(index, { id: event.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-sm font-medium text-slate-700">
                  Description
                </span>
                <textarea
                  value={group.description}
                  onChange={event =>
                    updateDocumentGroup(index, {
                      description: event.target.value,
                    })
                  }
                  className="min-h-[96px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <label className="space-y-2 block">
                <span className="text-sm font-medium text-slate-700">
                  Document URLs (one per line)
                </span>
                <textarea
                  value={group.documentUrls.join('\n')}
                  onChange={event =>
                    updateDocumentGroup(index, {
                      documentUrls: event.target.value
                        .split('\n')
                        .map(value => value.trim())
                        .filter(Boolean),
                    })
                  }
                  className="min-h-30 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeDocumentGroup(index)}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                >
                  Remove group
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}
