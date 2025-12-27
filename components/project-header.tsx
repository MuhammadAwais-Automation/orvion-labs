'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    ArrowLeft,
    TerminalSquare,
    FlaskConical,
    Scale,
    BarChart3,
    Settings2,
    Menu,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-media-query'

interface ProjectHeaderProps {
    projectId: string
    projectName?: string
}

export function ProjectHeader({ projectId, projectName }: ProjectHeaderProps) {
    const pathname = usePathname()
    const isMobile = useIsMobile()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        <>
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
                            <h1 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[120px] md:max-w-none">
                                {projectName || 'Project'}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Center: Navigation Tabs (Desktop Only) */}
                <nav className="hidden md:flex items-center gap-1">
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
                <div className="flex items-center gap-2">
                    <AnimatedThemeToggler />

                    {/* Mobile: Burger Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-8 w-8"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Mobile Slide-in Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-[#0a0a0b] border-l border-slate-200 dark:border-white/10 z-50 md:hidden shadow-2xl"
                        >
                            {/* Drawer Header */}
                            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/10">
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Navigation
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Drawer Content */}
                            <div className="p-4 space-y-2">
                                {navItems.map((item) => {
                                    const active = isActive(item.href, item.exact)
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                                active
                                                    ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10"
                                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.name}</span>
                                            {active && (
                                                <div className="ml-auto w-2 h-2 rounded-full bg-cyan-500" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* Project Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-white/10">
                                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                        {projectName?.[0]?.toUpperCase() || 'P'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                            {projectName || 'Project'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                                            Current Project
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
