import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import GeneralConfigModel from '@/models/GeneralConfig'
import {
  emptyGeneralConfig,
  GENERAL_CONFIG_DEPLOY_PENDING_MESSAGE,
  GENERAL_CONFIG_DEPLOY_PENDING_STATUS,
  GENERAL_CONFIG_DEPLOY_REQUESTED_MESSAGE,
  GENERAL_CONFIG_DEPLOY_REQUESTED_STATUS,
  isDeployPendingActive,
  resolveGeneralConfig,
} from '@/types/general-config'

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!ADMIN_USER_EMAIL.includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const deployHook = process.env.DEPLOY_HOOK

  if (!deployHook) {
    return NextResponse.json(
      { error: 'Deploy hook is not configured' },
      { status: 500 },
    )
  }

  await dbConnect()

  const existingConfig = await GeneralConfigModel.findOne({}).lean()
  const resolvedConfig = existingConfig
    ? resolveGeneralConfig(JSON.parse(JSON.stringify(existingConfig)))
    : emptyGeneralConfig

  if (isDeployPendingActive(resolvedConfig.deploy)) {
    return NextResponse.json(
      {
        status: GENERAL_CONFIG_DEPLOY_PENDING_STATUS,
        message: GENERAL_CONFIG_DEPLOY_PENDING_MESSAGE,
        deploy: resolvedConfig.deploy,
      },
      { status: 409 },
    )
  }

  let hookResponse: Response

  try {
    hookResponse = await fetch(deployHook, {
      method: 'POST',
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to reach deploy hook' },
      { status: 502 },
    )
  }

  if (!hookResponse.ok) {
    return NextResponse.json(
      {
        error: 'Deploy hook request failed',
        statusCode: hookResponse.status,
      },
      { status: 502 },
    )
  }

  const requestedAt = new Date().toISOString()

  const updatedConfig = await GeneralConfigModel.findOneAndUpdate(
    {},
    {
      $set: {
        'deploy.pending': true,
        'deploy.requestedAt': requestedAt,
      },
    },
    {
      returnDocument: 'after',
      upsert: true,
    },
  ).lean()

  const resolvedUpdatedConfig = updatedConfig
    ? resolveGeneralConfig(JSON.parse(JSON.stringify(updatedConfig)))
    : {
        ...emptyGeneralConfig,
        deploy: {
          pending: true,
          requestedAt,
        },
      }

  return NextResponse.json({
    status: GENERAL_CONFIG_DEPLOY_REQUESTED_STATUS,
    message: GENERAL_CONFIG_DEPLOY_REQUESTED_MESSAGE,
    deploy: resolvedUpdatedConfig.deploy,
  })
}
