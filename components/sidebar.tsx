'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    FolderOpen,
    Settings,
    Book,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Command
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/login/actions'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

interface AppSidebarProps {
    user?: any
}

export function AppSidebar({ user }: AppSidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)

    // Sidebar items
    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Projects', href: '/projects', icon: FolderOpen },
        { name: 'Documentation', href: '/docs', icon: Book },
        { name: 'Settings', href: '/account', icon: Settings },
    ]

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                        <span className="text-white dark:text-black font-bold font-serif">O</span>
                    </div>
                    <span className="font-bold text-lg dark:text-white">Orvion</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Main Sidebar Panel */}
            <aside
                className={cn(
                    "fixed md:sticky top-0 left-0 z-40 h-screen bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-r border-gray-200 dark:border-white/5 transition-all duration-300 flex flex-col",
                    isCollapsed ? "w-20" : "w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    "hidden md:flex" // Hide initially on mobile, rely on mobile header logic or custom mobile drawer
                )}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-white/5">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex-shrink-0 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                            <span className="text-white dark:text-black font-bold font-serif">O</span>
                        </div>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-lg dark:text-white whitespace-nowrap"
                            >
                                Orvion Labs
                            </motion.span>
                        )}
                    </div>
                </div>

                {/* Navigation Items */}
                {/* Navigation Items */}
                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-none">
                    {/* Command Prompt Trigger Visual */}
                    {!isCollapsed && (
                        <button className="w-full mb-6 flex items-center justify-between px-3 py-2 text-sm text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors group">
                            <span className="flex items-center gap-2">
                                <Command className="w-4 h-4" />
                                <span>Search...</span>
                            </span>
                            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                    )}

                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-medium"
                                        : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-cyan-600 dark:text-cyan-400" : "text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300")} />
                                {!isCollapsed && (
                                    <span className="text-sm">{item.name}</span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-5 bg-cyan-600 dark:bg-cyan-400 rounded-r-full"
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Footer / User Profile */}
                <div className="p-4 border-t border-gray-200 dark:border-white/5 space-y-4">
                    {/* Theme Toggle Section */}
                    {!isCollapsed ? (
                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-200 dark:border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-500">Appearance</span>
                                <AnimatedThemeToggler />
                            </div>
                        </div>
                    ) : (
                        /* Collapsed Footer View */
                        <div className="flex flex-col items-center gap-4">
                            <div className="scale-90" title="Toggle Theme">
                                <AnimatedThemeToggler />
                            </div>
                        </div>
                    )}

                    {/* User Profile */}
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center flex-col-reverse" : "")}>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-zinc-900 group relative">
                            {user?.email?.[0].toUpperCase()}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                    {user?.email}
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.email?.split('@')[0]}
                                </p>
                                <form action={signOut}>
                                    <button className="text-xs text-slate-500 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition-colors mt-0.5">
                                        Sign out
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-white shadow-sm transition-transform hover:scale-105 z-50"
                >
                    <ChevronRight className={cn("w-3 h-3 transition-transform duration-300", !isCollapsed && "rotate-180")} />
                </button>
            </aside>

            {/* Mobile Drawer (Simplified) */}
            {
                isMobileOpen && (

                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            className="absolute inset-y-0 left-0 w-64 bg-zinc-950 border-r border-white/10 p-4"
                        >
                            {/* Mobile Nav Content */}
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-bold text-white text-lg">Menu</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}><X className="text-white" /></Button>
                            </div>
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 mb-1"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </motion.div>
                    </div>
                )
            }
        </>
    )
}
