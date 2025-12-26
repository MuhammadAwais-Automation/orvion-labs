"use client"

import { motion } from "framer-motion"
import { Hexagon, Triangle, Box, Zap, Globe, Layers, Command, Cpu } from "lucide-react"

const companies = [
    { name: "ACME", icon: Hexagon },
    { name: "NEXUS", icon: Triangle },
    { name: "VERTEX", icon: Box },
    { name: "ORBIT", icon: Globe },
    { name: "LAYER", icon: Layers },
    { name: "COMMAND", icon: Command },
    { name: "SYSTEM", icon: Cpu },
    { name: "BOLT", icon: Zap },
]

export function TrustedBy() {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Radial Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 mb-8">
                <h2 className="text-center text-sm font-bold tracking-[0.2em] text-slate-500 uppercase">
                    Trusted by Elite Engineering Teams
                </h2>
            </div>

            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

            <div
                className="relative flex w-full overflow-hidden"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                }}
            >
                <div className="flex flex-nowrap gap-16 animate-marquee min-w-full">
                    {[...companies, ...companies].map((company, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 group cursor-default shrink-0"
                        >
                            <company.icon className="w-6 h-6 text-slate-600 transition-colors duration-300 group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                            <span className="text-lg font-bold tracking-widest text-slate-600 uppercase transition-colors duration-300 group-hover:text-white">
                                {company.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
