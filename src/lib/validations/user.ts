import { z } from 'zod'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const userPayloadSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z
      .string()
      .trim()
      .refine(
        value => value === '' || emailPattern.test(value),
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
  .strict()

export type UserPayload = z.infer<typeof userPayloadSchema>

export function formatUserPayloadIssues(error: z.ZodError): Array<{
  message: string
  path: string[]
}> {
  return error.issues.flatMap(issue => {
    if (issue.code === 'unrecognized_keys') {
      return issue.keys.map(key => ({
        message: 'Unknown field',
        path: [key],
      }))
    }

    if (issue.code === 'invalid_type' && issue.path.length === 0) {
      return [{ message: 'Payload must be an object', path: [] }]
    }

    return [
      {
        message: issue.message,
        path: issue.path.map(pathPart => String(pathPart)),
      },
    ]
  })
}
