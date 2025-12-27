'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook for responsive breakpoint detection
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns boolean - true if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        // Check if window is defined (client-side)
        if (typeof window === 'undefined') return

        const mediaQuery = window.matchMedia(query)

        // Set initial value
        setMatches(mediaQuery.matches)

        // Create event listener
        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        // Add listener
        mediaQuery.addEventListener('change', handler)

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handler)
    }, [query])

    return matches
}

// Convenience hooks for common breakpoints
export function useIsMobile(): boolean {
    return !useMediaQuery('(min-width: 768px)')
}

export function useIsTablet(): boolean {
    const isNotMobile = useMediaQuery('(min-width: 768px)')
    const isNotDesktop = !useMediaQuery('(min-width: 1024px)')
    return isNotMobile && isNotDesktop
}

export function useIsDesktop(): boolean {
    return useMediaQuery('(min-width: 1024px)')
}
