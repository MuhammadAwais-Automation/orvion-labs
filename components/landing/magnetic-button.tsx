'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function MagneticButton({ children }: { children: React.ReactNode }) {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e
        const { left, top, width, height } = buttonRef.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 }
        const x = clientX - (left + width / 2)
        const y = clientY - (top + height / 2)
        setPosition({ x, y })
    }

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 })
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x * 0.2, y: position.y * 0.2 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Button
                    ref={buttonRef}
                    size="lg"
                    className="relative h-16 px-10 text-lg bg-slate-950 text-white border border-slate-800 rounded-full overflow-hidden group-hover:text-cyan-50 transition-colors"
                >
                    {children}
                </Button>
            </div>
        </motion.div>
    )
}
