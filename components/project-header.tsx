'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, TerminalSquare, FlaskConical, Scale, BarChart3, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

interface ProjectHeaderProps {
    projectId: string
    projectName?: string
}

export function ProjectHeader({ projectId, projectName }: ProjectHeaderProps) {
    const pathname = usePathname()

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
            name: 'Settings',
            href: `/projects/${projectId}/settings`,
            icon: Settings2,
            exact: false
        },
    ]

    const isActive = (href: string, exact: boolean) => {
        if (exact) {
            return pathname === href
        }
        return pathname.startsWith(href)
    }

    return (
        <header className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#09090b] z-30 shrink-0 transition-colors">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                    title="Back to Dashboard"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2">
                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10" />
                    <div>
                        <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {projectName || 'Project'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Center: Navigation Tabs */}
            <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                    const active = isActive(item.href, item.exact)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "relative px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-2",
                                active
                                    ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                            )}
                        >
                            <item.icon className="w-3.5 h-3.5" />
                            <span>{item.name}</span>
                            {active && (
                                <motion.div
                                    layoutId="project-nav-active"
                                    className="absolute inset-x-0 -bottom-[13px] h-[1px] bg-cyan-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Right: Actions */}
            <div className="w-[100px] flex justify-end">
                <AnimatedThemeToggler />
            </div>
        </header>
    )
}
