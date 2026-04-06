import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import GeneralConfigModel from '@/models/GeneralConfig'
import {
  emptyGeneralConfig,
  resolveGeneralConfig,
} from '@/types/general-config'

const generalConfigAssetSchema = z
  .object({
    fileId: z.string(),
    url: z.string(),
    name: z.string(),
    filePath: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    thumbnailUrl: z.string().optional(),
  })
  .strict()

const generalConfigDocumentGroupSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    documentUrls: z.array(z.string()),
  })
  .strict()

const generalConfigWriteSchema = z
  .object({
    homepage: z
      .object({
        primaryImage: generalConfigAssetSchema.nullable(),
        secondaryImage: generalConfigAssetSchema.nullable(),
      })
      .strict(),
    cv: z
      .object({
        hrAssistantEnabled: z.boolean(),
      })
      .strict(),
    aiAssistant: z
      .object({
        documentGroups: z.array(generalConfigDocumentGroupSchema),
      })
      .strict(),
  })
  .strict()

export async function GET() {
  await dbConnect()
  const config = await GeneralConfigModel.findOne({}).lean()

  if (!config) {
    return NextResponse.json(emptyGeneralConfig)
  }

  return NextResponse.json(
    resolveGeneralConfig(JSON.parse(JSON.stringify(config))),
  )
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (
    !session ||
    !session.user ||
    !ADMIN_USER_EMAIL.includes(session.user.email)
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body' },
      { status: 400 },
    )
  }

  const sanitizedBody =
    body && typeof body === 'object' && !Array.isArray(body)
      ? (() => {
          const { deploy: _deploy, ...rest } = body as Record<string, unknown>
          return rest
        })()
      : body

  const validationResult = generalConfigWriteSchema.safeParse(sanitizedBody)

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid general config payload',
        details: validationResult.error.issues.map(issue => ({
          message: issue.message,
          path: issue.path,
        })),
      },
      { status: 400 },
    )
  }

  const resolvedConfig = resolveGeneralConfig(validationResult.data)

  await dbConnect()
  const config = await GeneralConfigModel.findOneAndUpdate({}, resolvedConfig, {
    returnDocument: 'after',
    upsert: true,
  }).lean()

  return NextResponse.json(
    resolveGeneralConfig(JSON.parse(JSON.stringify(config))),
  )
}
