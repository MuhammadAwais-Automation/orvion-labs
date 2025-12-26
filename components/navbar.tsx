'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/login/actions'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { cn } from '@/lib/utils'

interface NavbarProps {
    user?: any
    credits?: number | null
}

export function Navbar({ user, credits }: NavbarProps) {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (pathname === '/login') {
        return (
            <nav className="absolute top-0 left-0 w-full p-6 z-50">
                <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                    ← Back to Home
                </Link>
            </nav>
        )
    }

    // App Mode (Dashboard)
    if (user) {
        return (
            <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl transition-all duration-300">
                <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 flex items-center justify-center bg-gray-900 dark:bg-white rounded-lg overflow-hidden transition-transform group-hover:scale-105 duration-300">
                            <span className="text-white dark:text-black font-bold text-xl leading-none font-serif">O</span>
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight font-serif group-hover:opacity-80 transition-opacity">
                            Orvion Labs
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {credits !== null && credits !== undefined && (
                            <div className={cn(
                                "px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-sm",
                                credits < 100
                                    ? "border-red-500/20 bg-red-500/5 text-red-500"
                                    : "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 dark:text-emerald-400"
                            )}>
                                {credits.toLocaleString()} Credits
                            </div>
                        )}
                        <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />
                        <AnimatedThemeToggler />

                        <Link
                            href="/account"
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 border border-gray-200 dark:border-white/10 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:scale-105 transition-all">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>
        )
    }

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Method', href: '#method' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Docs', href: '/docs' },
    ]

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 mx-auto mt-6 max-w-5xl px-6 transition-all duration-300",
                    isScrolled ? "mt-4" : "mt-6"
                )}
            >
                <div className="relative flex items-center justify-between rounded-full border border-white/10 bg-black/50 px-6 py-3 backdrop-blur-md shadow-2xl supports-[backdrop-filter]:bg-black/20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl text-white kumar-one-regular">Orvion Labs</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full h-9 px-4">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className="h-9 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-sm font-medium text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 border border-white/10">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-slate-300 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-4 top-24 z-40 rounded-3xl border border-white/10 bg-black/90 p-6 backdrop-blur-xl md:hidden shadow-2xl"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-slate-300 hover:text-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-white/10 my-2" />
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10 rounded-xl">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/20">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
