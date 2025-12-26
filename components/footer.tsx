"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Hexagon, Twitter, Github, Linkedin, Disc } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer({ user }: { user?: any }) {
    const pathname = usePathname()

    // Hide footer on login page OR if user is logged in (Dashboard)
    if (pathname === "/login" || user) return null

    return (
        <footer className="relative bg-black border-t border-white/10 overflow-hidden">
            {/* Watermark */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none select-none overflow-hidden">
                <h1 className="text-[15rem] font-black text-white/[0.03] leading-none tracking-tighter whitespace-nowrap">
                    ORVION
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Top Section: CTA */}
                <div className="py-24 border-b border-white/10 flex flex-col items-center text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                        Ready to stabilize your AI?
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mb-10">
                        Join elite engineering teams who trust Orvion to catch hallucinations before they reach production.
                    </p>
                    <Button
                        size="lg"
                        className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-slate-200 transition-all font-semibold"
                    >
                        Start for Free
                    </Button>
                </div>

                {/* Middle Section: Grid */}
                <div className="py-20 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
                    {/* Column 1: Product */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Product</h3>
                        <ul className="flex flex-col gap-4">
                            {["Features", "Integrations", "Enterprise", "Changelog", "Docs"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Resources */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Resources</h3>
                        <ul className="flex flex-col gap-4">
                            {["Community", "Blog", "Case Studies", "Help Center", "API Reference"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Company</h3>
                        <ul className="flex flex-col gap-4">
                            {["About", "Careers", "Brand", "Contact", "Partners"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Legal */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Legal</h3>
                        <ul className="flex flex-col gap-4">
                            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security", "Status"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white/10 rounded-lg">
                            <Hexagon className="w-5 h-5 text-white fill-white" />
                        </div>
                        <span className="text-white font-bold tracking-tight">Orvion Labs</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <span>© 2024 Orvion Labs Inc.</span>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-slate-300 font-medium text-xs">All Systems Operational</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {[Twitter, Github, Linkedin, Disc].map((Icon, i) => (
                            <Link key={i} href="#" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                <Icon className="w-5 h-5" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
