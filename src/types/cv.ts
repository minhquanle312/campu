export type Locale = 'en' | 'vi'

export type LocalizedText = {
  vi?: string
  en?: string
}

export type CVEducationItem = {
  institution?: LocalizedText
  major?: LocalizedText
  period?: string
}

export type CVExperienceItem = {
  company?: string
  role?: LocalizedText
  period?: LocalizedText
  descriptions?: {
    vi?: string[]
    en?: string[]
  }
}

export type CVData = {
  personalInfo?: {
    name?: string
    phone?: string
    email?: string
    address?: LocalizedText
    birthYear?: string
    website?: string
  }
  summary?: LocalizedText
  objective?: LocalizedText
  education?: CVEducationItem[]
  skills?: {
    vi?: string[]
    en?: string[]
  }
  experience?: CVExperienceItem[]
}

export const emptyCVData: CVData = {
  personalInfo: {
    name: '',
    phone: '',
    email: '',
    address: { vi: '', en: '' },
    birthYear: '',
    website: '',
  },
  summary: { vi: '', en: '' },
  objective: { vi: '', en: '' },
  education: [],
  experience: [],
  skills: { vi: [], en: [] },
}
