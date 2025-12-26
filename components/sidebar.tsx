'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    FolderOpen,
    Settings,
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

    // Navigation Groups
    const mainNav = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Projects', href: '/projects', icon: FolderOpen },
    ]

    const systemNav = [
        { name: 'Settings', href: '/account', icon: Settings },
    ]

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                        <span className="text-white dark:text-black font-bold">O</span>
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
                    "fixed md:sticky top-0 left-0 z-40 h-screen bg-white/40 dark:bg-black/40 backdrop-blur-[32px] transition-all duration-500 flex flex-col group/sidebar",
                    "border-r border-slate-200/50 dark:border-white/[0.04] shadow-[1px_0_0_0_rgba(255,255,255,0.02)_inset]",
                    isCollapsed ? "w-20" : "w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    "hidden md:flex"
                )}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 mb-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative group/logo">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover/logo:scale-110 transition-transform duration-300">
                                <span className="font-black text-sm">O</span>
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-lg opacity-0 group-hover/logo:opacity-100 transition-opacity" />
                        </div>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-bold text-base tracking-tight dark:text-white whitespace-nowrap"
                            >
                                Orvion Labs
                            </motion.span>
                        )}
                    </div>
                </div>

                {/* Navigation Groups */}
                <div className="flex-1 py-4 px-3 space-y-8 overflow-y-auto scrollbar-none">
                    {/* Search Trigger */}
                    {!isCollapsed && (
                        <div className="px-3 mb-6">
                            <button className="w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-medium tracking-wider uppercase text-slate-500 dark:text-zinc-500 bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05] rounded-xl hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-all group/search overflow-hidden relative">
                                <span className="flex items-center gap-2 relative z-10">
                                    <Command className="w-3.5 h-3.5" />
                                    <span>Command Center</span>
                                </span>
                                <div className="flex items-center gap-1 relative z-10">
                                    <span className="opacity-40">⌘</span>
                                    <span className="opacity-40">K</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent translate-x-[-100%] group-hover/search:translate-x-[100%] transition-transform duration-1000" />
                            </button>
                        </div>
                    )}

                    {/* Main Nav Section */}
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <div className="px-4 mb-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">Main Menu</span>
                            </div>
                        )}
                        {mainNav.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <SidebarNavItem key={item.name} item={item} isActive={isActive} isCollapsed={isCollapsed} />
                            )
                        })}
                    </div>

                    {/* System Nav Section */}
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <div className="px-4 mb-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">System</span>
                            </div>
                        )}
                        {systemNav.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <SidebarNavItem key={item.name} item={item} isActive={isActive} isCollapsed={isCollapsed} />
                            )
                        })}
                    </div>
                </div>

                {/* Footer / User Profile Card */}
                <div className="p-4 space-y-4">
                    {/* Appearance Section */}
                    {!isCollapsed && (
                        <div className="px-3 py-2 rounded-2xl bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05] flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Theme</span>
                            <AnimatedThemeToggler />
                        </div>
                    )}

                    {/* User Profile Card */}
                    <div className={cn(
                        "relative rounded-2xl p-2.5 transition-all duration-300",
                        !isCollapsed ? "bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-2xl shadow-black/5" : "flex flex-col items-center gap-4"
                    )}>
                        <div className={cn("flex items-center gap-3", isCollapsed ? "flex-col" : "")}>
                            {/* Avatar */}
                            <div className="relative group/avatar">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/10 dark:ring-white/5 transition-transform group-hover/avatar:scale-105">
                                    {user?.email?.[0].toUpperCase()}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#141416]" />
                            </div>

                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate tracking-tight">
                                        {user?.email?.split('@')[0]}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-medium text-slate-500 dark:text-zinc-500 uppercase tracking-wider">System Online</span>
                                    </div>
                                </div>
                            )}

                            {isCollapsed ? (
                                <div className="scale-75"><AnimatedThemeToggler /></div>
                            ) : (
                                <form action={signOut}>
                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                        <LogOut className="w-3.5 h-3.5" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Collapse Toggle - Redesigned */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-500 shadow-xl transition-all hover:scale-110 z-50 group/toggle"
                >
                    <ChevronRight className={cn("w-3 h-3 transition-transform duration-500", !isCollapsed ? "rotate-180" : "group-hover/toggle:translate-x-0.5")} />
                </button>
            </aside>

            {/* Mobile Drawer */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileOpen(false)} />
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-white/10 p-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                                    <span className="text-white dark:text-black font-bold">O</span>
                                </div>
                                <span className="font-bold dark:text-white">Orvion</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)} className="rounded-xl"><X /></Button>
                        </div>
                        <div className="space-y-2">
                            {[...mainNav, ...systemNav].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-4 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:text-cyan-500 hover:bg-cyan-500/10 rounded-2xl transition-all"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    )
}

function SidebarNavItem({ item, isActive, isCollapsed }: { item: any, isActive: boolean, isCollapsed: boolean }) {
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative",
                isActive
                    ? "text-cyan-600 dark:text-cyan-400 font-bold"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/[0.04]"
            )}
        >
            <div className="relative z-10">
                <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6", isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-zinc-500 group-hover:text-cyan-500")} />
            </div>

            {!isCollapsed && (
                <span className="text-sm tracking-tight relative z-10">{item.name}</span>
            )}

            {isActive && (
                <motion.div
                    layoutId="sidebar-active-pill"
                    className={cn(
                        "absolute inset-0 bg-cyan-500/10 dark:bg-cyan-500/5 border border-cyan-500/20 dark:border-cyan-500/10 rounded-xl z-0",
                        isCollapsed ? "w-12 mx-auto" : "w-full"
                    )}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
            )}

            {isActive && !isCollapsed && (
                <motion.div
                    layoutId="sidebar-active-line"
                    className="absolute left-0 w-1 h-4 bg-cyan-500 rounded-r-full z-10"
                />
            )}
        </Link>
    )
}
