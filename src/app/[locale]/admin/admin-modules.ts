import {
  FileText,
  LayoutDashboard,
  MapIcon,
  Settings2,
  Users,
} from 'lucide-react'

export const adminModules = [
  {
    href: '/admin',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/general',
    label: 'General',
    icon: Settings2,
    title: 'General settings',
    description:
      'Manage site-wide configuration, homepage content, and shared assistant settings from the admin route map.',
    ctaLabel: 'Open general module',
    eyebrow: 'Global controls',
  },
  {
    href: '/admin/trips',
    label: 'Trips',
    icon: MapIcon,
    title: 'Trips workspace',
    description:
      'Review the trip collection, add new journeys, and keep travel content operations inside the private admin area.',
    ctaLabel: 'Open trips module',
    eyebrow: 'Travel data',
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
    title: 'Users management',
    description:
      'Access the people directory and make room for future moderation and account-management workflows under admin.',
    ctaLabel: 'Open users module',
    eyebrow: 'Access control',
  },
  {
    href: '/admin/cv',
    label: 'CV',
    icon: FileText,
    title: 'CV editor',
    description:
      'Maintain bilingual profile content from the dedicated admin CV module so the public profile stays current.',
    ctaLabel: 'Open CV module',
    eyebrow: 'Profile content',
  },
] as const

export const adminOverviewModules = adminModules.filter(
  module => module.href !== '/admin',
)

export function isAdminModuleActive(pathname: string, href: string) {
  return href === '/admin'
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)
}
