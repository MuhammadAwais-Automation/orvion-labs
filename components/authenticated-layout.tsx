'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/sidebar'
import { User } from '@supabase/supabase-js'

interface AuthenticatedLayoutProps {
    user: User
    children: React.ReactNode
}

/**
 * AuthenticatedLayout - Main app wrapper with sidebar
 */
export function AuthenticatedLayout({ user, children }: AuthenticatedLayoutProps) {
    const pathname = usePathname()

    // Check if viewing a specific project (not the projects list)
    const isProjectDetailPage = /^\/projects\/[^/]+/.test(pathname)

    if (isProjectDetailPage) {
        // Project-specific layout - NO main sidebar
        return (
            <main className="flex-1 h-full overflow-hidden">
                {children}
            </main>
        )
    }

    // Main app layout - WITH sidebar
    return (
        <div className="flex w-full h-full">
            <AppSidebar user={user} />
            <main className="flex-1 h-full overflow-hidden relative flex flex-col">
                {/* Top Header Area for Breadcrumbs/Actions could go here */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin-hover">
                    {children}
                </div>
            </main>
        </div>
    )
}
