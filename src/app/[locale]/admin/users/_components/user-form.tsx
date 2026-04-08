'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const userFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .refine(
      value => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      'Invalid email',
    ),
  avatar_url: z
    .string()
    .trim()
    .refine(value => {
      if (value === '') return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    }, 'Invalid avatar URL'),
})

type UserFormValues = z.infer<typeof userFormSchema>

type UserFormProps = {
  mode: 'create' | 'edit'
  userId?: string
  initialValues?: UserFormValues
}

export function UserForm({ mode, userId, initialValues }: UserFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormValues, string>>
  >({})
  const [values, setValues] = useState<UserFormValues>(
    initialValues ?? {
      name: '',
      email: '',
      avatar_url: '',
    },
  )

  const endpoint = mode === 'create' ? '/api/users' : `/api/users/${userId}`
  const method = mode === 'create' ? 'POST' : 'PUT'

  async function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault()
    setErrors({})

    const validationResult = userFormSchema.safeParse(values)

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.issues.reduce(
        (accumulator, issue) => {
          const key = issue.path[0]
          if (
            typeof key === 'string' &&
            (key === 'name' || key === 'email' || key === 'avatar_url') &&
            !accumulator[key]
          ) {
            accumulator[key] = issue.message
          }
          return accumulator
        },
        {} as Partial<Record<keyof UserFormValues, string>>,
      )

      setErrors({
        name: fieldErrors.name,
        email: fieldErrors.email,
        avatar_url: fieldErrors.avatar_url,
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationResult.data),
      })

      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload.error || 'Failed to save user')
      }

      toast.success(mode === 'create' ? 'User created' : 'User updated')
      router.push('/admin/users')
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to save user')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={values.name}
          onChange={event =>
            setValues(previous => ({ ...previous, name: event.target.value }))
          }
          placeholder="Enter full name"
        />
        {errors.name ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={event =>
            setValues(previous => ({ ...previous, email: event.target.value }))
          }
          placeholder="name@example.com"
        />
        {errors.email ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input
          id="avatar_url"
          value={values.avatar_url}
          onChange={event =>
            setValues(previous => ({
              ...previous,
              avatar_url: event.target.value,
            }))
          }
          placeholder="https://example.com/avatar.png"
        />
        {errors.avatar_url ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.avatar_url}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting} className="rounded-full">
          {submitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
              ? 'Create user'
              : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => router.push('/admin/users')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
