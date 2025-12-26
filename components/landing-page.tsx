'use client'

import { useState, useEffect } from 'react'
import { TrustedBy } from '@/components/trusted-by'

// Modular Lego Blocks
import { Hero } from './landing/hero'
import { Features } from './landing/features'
import { HowItWorks } from './landing/how-it-works'
import { FinalCTA } from './landing/final-cta'

export function LandingPage() {
    // Mouse position for parallax/glow effects across the page
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-cyan-500/30 font-sans">

            {/* Futuristic Grid Background (Global) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-[100px]" />
            </div>

            {/* Hero Section */}
            <Hero mousePosition={mousePosition} />

            {/* Social Proof */}
            <TrustedBy />

            {/* Features (Bento Grid) */}
            <Features />

            {/* How it Works */}
            <HowItWorks />

            {/* Final CTA */}
            <FinalCTA />

        </div>
    )
}
