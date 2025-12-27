'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    TerminalSquare,
    FlaskConical,
    Scale,
    Settings2,
    ArrowLeft,
    User,
    BarChart3,
    GitCompare,
    MoreHorizontal
} from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useIsMobile } from '@/hooks/use-media-query'

interface ProjectSidebarProps {
    projectId: string
    user: SupabaseUser | null
}

export function ProjectSidebar({ projectId, user }: ProjectSidebarProps) {
    const pathname = usePathname()
    const isMobile = useIsMobile()

    const navItems = [
        {
            name: 'Playground',
            href: `/projects/${projectId}`,
            icon: TerminalSquare,
            exact: true
        },
        {
            name: 'Test Suites',
            href: `/projects/${projectId}/test-suites`,
            icon: FlaskConical,
            exact: false
        },
        {
            name: 'Evaluations',
            href: `/projects/${projectId}/evaluations`,
            icon: Scale,
            exact: false
        },
        {
            name: 'Analytics',
            href: `/projects/${projectId}/analytics`,
            icon: BarChart3,
            exact: false
        },
        {
            name: 'Versions',
            href: `/projects/${projectId}/versions`,
            icon: GitCompare,
            exact: false
        },
    ]

    const isActive = (href: string, exact: boolean) => {
        if (exact) {
            return pathname === href
        }
        return pathname.startsWith(href)
    }

    // Mobile Bottom Navigation
    if (isMobile) {
        // Show only first 4 items + more menu
        const mobileNavItems = navItems.slice(0, 4)

        return (
            <>
                {/* Mobile Top Header */}
                <div className="fixed top-0 left-0 right-0 h-14 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-50">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {user?.email?.[0].toUpperCase() || <User className="w-3.5 h-3.5" />}
                    </div>
                </div>

                {/* Mobile Bottom Navigation Bar */}
                <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-50 pb-safe">
                    {mobileNavItems.map((item) => {
                        const active = isActive(item.href, item.exact)
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors",
                                    active
                                        ? "text-cyan-400"
                                        : "text-slate-500"
                                )}
                            >
                                <div className="relative">
                                    <Icon className="w-5 h-5" />
                                    {active && (
                                        <motion.div
                                            layoutId="mobile-active-dot"
                                            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                                        />
                                    )}
                                </div>
                                <span className="text-[10px] font-medium">{item.name.split(' ')[0]}</span>
                            </Link>
                        )
                    })}

                    {/* More Menu for Settings & Other Items */}
                    <Link
                        href={`/projects/${projectId}/settings`}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors",
                            isActive(`/projects/${projectId}/settings`, false)
                                ? "text-cyan-400"
                                : "text-slate-500"
                        )}
                    >
                        <Settings2 className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Settings</span>
                    </Link>
                </nav>
            </>
        )
    }

    // Desktop Sidebar (Original)
    return (
        <TooltipProvider delayDuration={0}>
            <aside className="h-full w-16 border-r border-white/10 bg-[#050505] hidden md:flex flex-col items-center py-4 z-40">
                {/* Top: Back to Dashboard */}
                <div className="mb-8">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/"
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-slate-200">
                            <p>Back to Dashboard</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Middle: Navigation Items */}
                <nav className="flex-1 flex flex-col gap-4 w-full px-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href, item.exact)
                        const Icon = item.icon

                        return (
                            <Tooltip key={item.name}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "relative flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200 group",
                                            active
                                                ? "text-cyan-400 bg-cyan-500/10"
                                                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                                        )}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                        <Icon className="w-5 h-5" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-slate-200 font-medium">
                                    <p>{item.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </nav>

                {/* Bottom: Settings & User */}
                <div className="mt-auto flex flex-col gap-4 w-full px-2">
                    {/* Settings */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href={`/projects/${projectId}/settings`}
                                className={cn(
                                    "relative flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200",
                                    isActive(`/projects/${projectId}/settings`, false)
                                        ? "text-cyan-400 bg-cyan-500/10"
                                        : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                                )}
                            >
                                {isActive(`/projects/${projectId}/settings`, false) && (
                                    <div className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full" />
                                )}
                                <Settings2 className="w-5 h-5" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-slate-200">
                            <p>Project Settings</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* User Avatar */}
                    <div className="pt-4 border-t border-white/10 w-full flex justify-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-default ring-2 ring-black">
                                    {user?.email?.[0].toUpperCase() || <User className="w-4 h-4" />}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-slate-200">
                                <p className="text-xs">{user?.email}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    )
}
