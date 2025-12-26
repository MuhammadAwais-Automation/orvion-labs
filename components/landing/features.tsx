'use client'

import { motion } from 'framer-motion'
import { Brain, Activity, GitGraph, Terminal, Code2 } from 'lucide-react'
import { BentoCard } from './bento-card'

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { type: "spring", stiffness: 50, damping: 20 } as const
}

export function Features() {
    return (
        <section className="py-32 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    {...fadeInUp}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Everything you need to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">stabilize your prompts.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
                    {/* Card 1: Smart Judge (Large) */}
                    <BentoCard
                        colSpan="md:col-span-2"
                        icon={<Brain className="w-8 h-8 text-cyan-400" />}
                        title="AI Semantic Judge"
                        desc="Goes beyond string matching. Our AI understands intent, context, and nuance for accurate grading that mimics human review."
                        gradient="from-cyan-500/10"
                        borderColor="group-hover:border-cyan-500/50"
                    >
                        <div className="mt-auto flex gap-3">
                            <div className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-mono border border-green-500/20">Pass: 98%</div>
                            <div className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-xs font-mono border border-red-500/20">Fail: 2%</div>
                        </div>
                    </BentoCard>

                    {/* Card 2: Metrics */}
                    <BentoCard
                        icon={<Activity className="w-8 h-8 text-purple-400" />}
                        title="Latency & Cost"
                        desc="Monitor token usage and response times per run to optimize performance."
                        gradient="from-purple-500/10"
                        borderColor="group-hover:border-purple-500/50"
                    />

                    {/* Card 3: CI/CD */}
                    <BentoCard
                        icon={<GitGraph className="w-8 h-8 text-indigo-400" />}
                        title="Built for CI/CD"
                        desc="Prevent regressions automatically in your deployment pipelines."
                        gradient="from-indigo-500/10"
                        borderColor="group-hover:border-indigo-500/50"
                    />

                    {/* Card 4: Developer Experience */}
                    <BentoCard
                        colSpan="md:col-span-2"
                        icon={<Terminal className="w-8 h-8 text-orange-400" />}
                        title="Developer First API"
                        desc="Fully typed SDKs and CLI tools. Integrate testing into your workflow in minutes, not days."
                        gradient="from-orange-500/10"
                        borderColor="group-hover:border-orange-500/50"
                    >
                        <div className="mt-6 w-full bg-slate-950 rounded-xl border border-slate-800 p-5 font-mono text-xs text-slate-300 shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-20"><Code2 className="w-12 h-12" /></div>
                            <div className="space-y-2 relative z-10">
                                <p><span className="text-cyan-400">➜</span> <span className="text-purple-400">~</span> npx orvion-labs test --watch</p>
                                <p className="text-slate-500">Watching for changes...</p>
                                <p className="text-slate-400">Running suite "Authentication"...</p>
                                <p className="text-green-400">✓ 12 tests passed</p>
                            </div>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </section>
    )
}
