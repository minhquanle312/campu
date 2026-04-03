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
  }
}
