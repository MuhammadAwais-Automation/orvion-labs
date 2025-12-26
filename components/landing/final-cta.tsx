'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { type: "spring", stiffness: 50, damping: 20 } as const
}

export function FinalCTA() {
    return (
        <section className="py-40 px-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 pointer-events-none" />
            <motion.div
                {...fadeInUp}
                className="max-w-4xl mx-auto relative z-10"
            >
                <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-white">
                    Ready to ship AI <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">with confidence?</span>
                </h2>
                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                    Join thousands of developers who trust Orvion Labs to keep their AI pipelines stable.
                </p>
                <Link href="/login">
                    <Button size="lg" className="h-20 px-16 text-xl bg-white text-slate-950 hover:bg-cyan-50 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(6,182,212,0.4)] hover:scale-105 transition-all duration-300 rounded-full font-bold tracking-wide">
                        Get Started for Free
                    </Button>
                </Link>
            </motion.div>
        </section>
    )
}
