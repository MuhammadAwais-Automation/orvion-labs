'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function TypewriterHeadline() {
    const [suffix, setSuffix] = useState("")
    const [showStrike, setShowStrike] = useState(false)
    const [phase, setPhase] = useState<'typing_bad' | 'waiting_bad' | 'striking' | 'deleting' | 'typing_good' | 'waiting_good'>('typing_bad')

    useEffect(() => {
        const badWord = " Hallucinations"
        const goodWord = " Precision"

        let timeout: NodeJS.Timeout

        if (phase === 'typing_bad') {
            if (suffix.length < badWord.length) {
                timeout = setTimeout(() => {
                    setSuffix(badWord.slice(0, suffix.length + 1))
                }, 100)
            } else {
                setPhase('waiting_bad')
            }
        } else if (phase === 'waiting_bad') {
            timeout = setTimeout(() => {
                setPhase('striking')
            }, 1000)
        } else if (phase === 'striking') {
            setShowStrike(true)
            timeout = setTimeout(() => {
                setPhase('deleting')
            }, 1000)
        } else if (phase === 'deleting') {
            if (suffix.length > 0) {
                timeout = setTimeout(() => {
                    setSuffix(suffix.slice(0, -1))
                }, 50)
            } else {
                setShowStrike(false)
                setPhase('typing_good')
            }
        } else if (phase === 'typing_good') {
            if (suffix.length < goodWord.length) {
                timeout = setTimeout(() => {
                    setSuffix(goodWord.slice(0, suffix.length + 1))
                }, 100)
            } else {
                setPhase('waiting_good')
            }
        } else if (phase === 'waiting_good') {
            timeout = setTimeout(() => {
                setSuffix("")
                setPhase('typing_bad')
            }, 3000)
        }

        return () => clearTimeout(timeout)
    }, [suffix, phase])

    return (
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] min-h-[1.8em]">
            Engineering <br />
            <span className="relative">
                {phase === 'typing_good' || phase === 'waiting_good' ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient-x">
                        {suffix.trim()}
                    </span>
                ) : (
                    <span className="text-red-400/80">
                        {suffix}
                    </span>
                )}
                {showStrike && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="absolute top-1/2 left-0 h-2 bg-red-500 -translate-y-1/2"
                    />
                )}
                <span className="animate-pulse text-slate-500">|</span>
            </span>
        </h1>
    )
}
