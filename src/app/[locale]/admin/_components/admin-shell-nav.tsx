'use client'

import { Link, usePathname } from '@/i18n/navigation'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { adminModules, isAdminModuleActive } from '../admin-modules'

export function AdminShellNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Admin sections" className="flex flex-col gap-2">
      <SidebarGroup className="p-0">
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {adminModules.map(item => {
              const Icon = item.icon
              const isActive = isAdminModuleActive(pathname, item.href)

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </nav>
  )
}
