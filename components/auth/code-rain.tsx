'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function CodeRain() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    // Generate random columns
    const columns = Array.from({ length: 20 }, (_, i) => i)

    return (
        <div className="absolute inset-0 z-10 opacity-40 pointer-events-none flex justify-between px-10">
            {columns.map((col) => (
                <CodeColumn key={col} delay={Math.random() * 5} duration={5 + Math.random() * 5} />
            ))}
        </div>
    )
}

function CodeColumn({ delay, duration }: { delay: number, duration: number }) {
    return (
        <motion.div
            initial={{ y: -1000 }}
            animate={{ y: "100vh" }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                delay: delay,
            }}
            className="flex flex-col gap-4 text-xs font-mono text-cyan-500/50"
        >
            {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} style={{ opacity: 1 - i * 0.05 }}>
                    {Math.random() > 0.5 ? "1" : "0"}
                </span>
            ))}
        </motion.div>
    )
}
