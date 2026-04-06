export type GeneralConfigAsset = {
  fileId: string
  url: string
  name: string
  filePath: string
  width?: number
  height?: number
  thumbnailUrl?: string
}

export type GeneralConfigDocumentGroup = {
  id: string
  name: string
  description: string
  documentUrls: string[]
}

export type GeneralConfigDeployState = {
  pending: boolean
  requestedAt: string | null
}

export const GENERAL_CONFIG_DEPLOY_PENDING_STATUS = 'deploy_pending'
export const GENERAL_CONFIG_DEPLOY_REQUESTED_STATUS = 'deploy_requested'

export const GENERAL_CONFIG_DEPLOY_PENDING_MESSAGE =
  'Deploy has already been requested and is still pending.'
export const GENERAL_CONFIG_DEPLOY_REQUESTED_MESSAGE =
  'Deploy requested successfully. It can take 5-10 minutes to complete.'

export type GeneralConfigDeployResponse = {
  status:
    | typeof GENERAL_CONFIG_DEPLOY_PENDING_STATUS
    | typeof GENERAL_CONFIG_DEPLOY_REQUESTED_STATUS
  message: string
  deploy: GeneralConfigDeployState
}

export type GeneralConfigDeployErrorResponse = {
  error: string
  statusCode?: number
}

export const DEPLOY_PENDING_WINDOW_MS = 10 * 60 * 1000

export type GeneralConfig = {
  homepage: {
    primaryImage: GeneralConfigAsset | null
    secondaryImage: GeneralConfigAsset | null
  }
  cv: {
    hrAssistantEnabled: boolean
  }
  aiAssistant: {
    documentGroups: GeneralConfigDocumentGroup[]
  }
  deploy: GeneralConfigDeployState
}

export const emptyGeneralConfig: GeneralConfig = {
  homepage: {
    primaryImage: null,
    secondaryImage: null,
  },
  cv: {
    hrAssistantEnabled: true,
  },
  aiAssistant: {
    documentGroups: [],
  },
  deploy: {
    pending: false,
    requestedAt: null,
  },
}

const resolveDeployState = (
  deploy?: Partial<GeneralConfigDeployState> | null,
): GeneralConfigDeployState => {
  const requestedAtValue = deploy?.requestedAt

  return {
    pending:
      typeof deploy?.pending === 'boolean'
        ? deploy.pending
        : emptyGeneralConfig.deploy.pending,
    requestedAt: typeof requestedAtValue === 'string' ? requestedAtValue : null,
  }
}

export function getDeployPendingExpiryTime(
  requestedAt: string | null,
): number | null {
  if (!requestedAt) {
    return null
  }

  const requestedAtTime = Date.parse(requestedAt)

  if (Number.isNaN(requestedAtTime)) {
    return null
  }

  return requestedAtTime + DEPLOY_PENDING_WINDOW_MS
}

export function isDeployPendingActive(
  deploy?: Partial<GeneralConfigDeployState> | null,
  now = Date.now(),
): boolean {
  if (!deploy?.pending) {
    return false
  }

  const expiresAt = getDeployPendingExpiryTime(deploy.requestedAt ?? null)

  if (expiresAt === null) {
    return false
  }

  return expiresAt > now
}

const mergeAsset = (
  asset?: Partial<GeneralConfigAsset> | null,
): GeneralConfigAsset | null => {
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

const mergeDocumentGroup = (
  group: Partial<GeneralConfigDocumentGroup> | undefined,
): GeneralConfigDocumentGroup | null => {
  if (!group) {
    return null
  }

  return {
    id: typeof group.id === 'string' ? group.id : '',
    name: typeof group.name === 'string' ? group.name : '',
    description: typeof group.description === 'string' ? group.description : '',
    documentUrls: Array.isArray(group.documentUrls)
      ? group.documentUrls.filter(
          (value): value is string => typeof value === 'string',
        )
      : [],
  }
}

export function resolveGeneralConfig(
  config?: Partial<GeneralConfig> | null,
): GeneralConfig {
  const documentGroups = Array.isArray(config?.aiAssistant?.documentGroups)
    ? config.aiAssistant.documentGroups
        .map(group => mergeDocumentGroup(group))
        .filter((group): group is GeneralConfigDocumentGroup => group !== null)
    : emptyGeneralConfig.aiAssistant.documentGroups

  return {
    homepage: {
      primaryImage: mergeAsset(config?.homepage?.primaryImage),
      secondaryImage: mergeAsset(config?.homepage?.secondaryImage),
    },
    cv: {
      hrAssistantEnabled:
        typeof config?.cv?.hrAssistantEnabled === 'boolean'
          ? config.cv.hrAssistantEnabled
          : emptyGeneralConfig.cv.hrAssistantEnabled,
    },
    aiAssistant: {
      documentGroups,
    },
    deploy: resolveDeployState(config?.deploy),
  }
}
