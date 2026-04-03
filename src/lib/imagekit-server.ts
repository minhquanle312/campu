import 'server-only'

import { createHash, randomBytes } from 'node:crypto'

import type { GeneralConfigAsset } from '@/types/general-config'

export const IMAGEKIT_HOMEPAGE_UPLOAD_FOLDER = '/pages/home'

type ImageKitServerConfig = {
  publicKey: string
  privateKey: string
  urlEndpoint: string
}

type ImageKitUploadAuth = {
  token: string
  expire: number
  signature: string
  publicKey: string
  folder: typeof IMAGEKIT_HOMEPAGE_UPLOAD_FOLDER
}

type ImageKitAssetInput = {
  fileId?: string | null
  url?: string | null
  name?: string | null
  filePath?: string | null
  width?: number | null
  height?: number | null
  thumbnailUrl?: string | null
}

function getImageKitServerConfig(): ImageKitServerConfig {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      'Missing IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, or IMAGEKIT_URL_ENDPOINT environment variables',
    )
  }

  return {
    publicKey,
    privateKey,
    urlEndpoint,
  }
}

export function createImageKitHomepageUploadAuth(): ImageKitUploadAuth {
  const { publicKey, privateKey } = getImageKitServerConfig()
  const token = randomBytes(24).toString('hex')
  const expire = Math.floor(Date.now() / 1000) + 60 * 30
  const signature = createHash('sha1')
    .update(`${token}${expire}${privateKey}`)
    .digest('hex')

  return {
    token,
    expire,
    signature,
    publicKey,
    folder: IMAGEKIT_HOMEPAGE_UPLOAD_FOLDER,
  }
}

export function toGeneralConfigAsset(
  asset: ImageKitAssetInput | null | undefined,
): GeneralConfigAsset | null {
  if (!asset) {
    return null
  }

  if (!asset.fileId || !asset.url || !asset.name || !asset.filePath) {
    return null
  }

  return {
    fileId: asset.fileId,
    url: asset.url,
    name: asset.name,
    filePath: asset.filePath,
    width: typeof asset.width === 'number' ? asset.width : undefined,
    height: typeof asset.height === 'number' ? asset.height : undefined,
    thumbnailUrl:
      typeof asset.thumbnailUrl === 'string' ? asset.thumbnailUrl : undefined,
  }
}
