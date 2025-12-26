'use client'

import { motion } from 'framer-motion'

interface ParallaxWidgetProps {
    children: React.ReactNode
    mousePosition: { x: number; y: number }
    offsetX: number
    offsetY: number
    className?: string
}

export function ParallaxWidget({ children, mousePosition, offsetX, offsetY, className }: ParallaxWidgetProps) {
    const x = (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / 100 * (offsetX / 10)
    const y = (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) / 100 * (offsetY / 10)

    return (
        <motion.div
            className={className}
            animate={{
                x: x,
                y: y,
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
            >
                {children}
            </motion.div>
        </motion.div>
    )
}
