'use client'

import { motion } from 'framer-motion'
import { Upload, Play, SearchCheck } from 'lucide-react'

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { type: "spring", stiffness: 50, damping: 20 } as const
}

export function HowItWorks() {
    return (
        <section className="py-32 bg-slate-900/20 border-y border-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_70%)]" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    {...fadeInUp}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl font-bold mb-4">Three steps to confidence.</h2>
                    <p className="text-slate-400">Streamlined workflow for prompt engineers.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-slate-800 via-cyan-900 to-slate-800 z-0" />

                    {[
                        { title: 'Import Test Cases', desc: 'Upload JSON or create manually.', icon: <Upload className="w-6 h-6" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                        { title: 'Run Batch Tests', desc: 'Execute against any LLM model.', icon: <Play className="w-6 h-6" />, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                        { title: 'Analyze Regressions', desc: 'Identify and fix issues fast.', icon: <SearchCheck className="w-6 h-6" />, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            {...fadeInUp}
                            transition={{ delay: i * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className={`w-24 h-24 rounded-2xl border-2 ${item.border} ${item.bg} flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                <div className={`absolute inset-0 ${item.bg} blur-xl opacity-0 group-hover:opacity-50 transition-opacity`} />
                                <div className={item.color}>
                                    {item.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                            <p className="text-slate-400 max-w-xs leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
