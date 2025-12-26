'use client'

import { motion } from 'framer-motion'

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { type: "spring", stiffness: 50, damping: 20 } as const
}

interface BentoCardProps {
    colSpan?: string
    icon: React.ReactNode
    title: string
    desc: string
    gradient: string
    borderColor: string
    children?: React.ReactNode
}

export function BentoCard({ colSpan = "", icon, title, desc, gradient, borderColor, children }: BentoCardProps) {
    return (
        <motion.div
            {...fadeInUp}
            whileHover={{ y: -10 }}
            className={`${colSpan} p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 ${borderColor} transition-all duration-500 group relative overflow-hidden flex flex-col`}
        >
            {/* Laser Border Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            </div>

            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50 group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
                <p className="text-slate-400 leading-relaxed">
                    {desc}
                </p>
                {children}
            </div>
        </motion.div>
    )
}
