import { Shield } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import { AdminShellNav } from './_components/admin-shell-nav'

type Props = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="offcanvas">
        <SidebarHeader className="gap-3 border-b border-sidebar-border px-3 py-4">
          <div className="flex items-start gap-3 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/40 px-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <Shield aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-sidebar-foreground">
                Campu admin
              </p>
              <p className="text-sm text-sidebar-foreground/70">
                Internal workspace for content, operations, and future admin tools.
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-2">
          <AdminShellNav />
        </SidebarContent>

        <SidebarSeparator />
      </Sidebar>

      <SidebarInset className="min-h-svh bg-muted/30">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Campu admin workspace
              </p>
              <p className="text-xs text-muted-foreground">
                Persistent admin shell with shared navigation across every module.
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
