'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Activity, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PulsingBadge } from './pulsing-badge'
import { TypewriterHeadline } from './typewriter-headline'
import { MagneticButton } from './magnetic-button'
import { InfiniteTestLoop } from './infinite-test-loop'
import { ParallaxWidget } from './parallax-widget'

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { type: "spring", stiffness: 50, damping: 20 } as const
}

interface HeroProps {
    mousePosition: { x: number; y: number }
}

export function Hero({ mousePosition }: HeroProps) {
    return (
        <section className="relative z-10 pt-32 pb-32 px-6 overflow-visible">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                {/* Left: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
                    className="space-y-8 text-center lg:text-left relative"
                >
                    {/* Glowing Badge */}
                    <PulsingBadge />

                    <TypewriterHeadline />

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light tracking-wide space-y-1"
                    >
                        <motion.p variants={fadeInUp}>
                            The automated regression testing platform for LLMs.
                        </motion.p>
                        <motion.p variants={fadeInUp}>
                            <span className="text-slate-200">Catch hallucinations</span> before they breach production.
                        </motion.p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                        <Link href="/login">
                            <MagneticButton>
                                <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                                    Start Testing Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
                            </MagneticButton>
                        </Link>
                        <Link href="#demo">
                            <Button size="lg" variant="ghost" className="h-16 px-8 text-lg text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-full transition-all">
                                <Play className="w-5 h-5 mr-2" />
                                Watch Demo
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Right: Live Simulation Visual */}
                <div className="relative hidden lg:block perspective-[2000px] h-[600px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full animate-pulse" />

                        {/* Main Terminal Window */}
                        <InfiniteTestLoop />

                        {/* Floating Widgets (Parallax) */}
                        <ParallaxWidget mousePosition={mousePosition} offsetX={-20} offsetY={-20} className="absolute -right-4 top-20 z-20">
                            <div className="flex items-center gap-3 p-4 bg-slate-900/90 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-2xl">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 font-mono">Latency</div>
                                    <div className="text-lg text-purple-400 font-bold font-mono">12ms</div>
                                </div>
                            </div>
                        </ParallaxWidget>

                        <ParallaxWidget mousePosition={mousePosition} offsetX={30} offsetY={40} className="absolute -left-8 bottom-32 z-20">
                            <div className="flex items-center gap-3 p-4 bg-slate-900/90 backdrop-blur-xl rounded-xl border border-cyan-500/30 shadow-2xl">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <Cpu className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 font-mono">Cost/Run</div>
                                    <div className="text-lg text-cyan-400 font-bold font-mono">$0.002</div>
                                </div>
                            </div>
                        </ParallaxWidget>

                    </motion.div>
                </div>
            </div>
        </section>
    )
}
