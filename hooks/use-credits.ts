'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

/**
 * useCredits - Real-time Credits Hook
 * 
 * Provides live credit balance updates via Supabase Realtime.
 * Automatically subscribes to profile changes and updates the credit count.
 * 
 * Usage:
 * const { credits, isLoading, refetch } = useCredits(userId)
 */
export function useCredits(userId: string | undefined) {
    const [credits, setCredits] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    // Fetch credits from database
    const fetchCredits = useCallback(async () => {
        if (!userId) {
            setCredits(null)
            setIsLoading(false)
            return
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching credits:', error)
                return
            }

            setCredits(data?.credits ?? 0)
        } catch (err) {
            console.error('Credits fetch failed:', err)
        } finally {
            setIsLoading(false)
        }
    }, [userId, supabase])

    useEffect(() => {
        if (!userId) return

        // Initial fetch
        fetchCredits()

        // Subscribe to realtime changes
        const channel: RealtimeChannel = supabase
            .channel(`credits-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`
                },
                (payload) => {
                    // Update credits when profile changes
                    if (payload.new && typeof payload.new.credits === 'number') {
                        setCredits(payload.new.credits)
                    }
                }
            )
            .subscribe()

        // Cleanup on unmount
        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, supabase, fetchCredits])

    return {
        credits,
        isLoading,
        refetch: fetchCredits
    }
}
