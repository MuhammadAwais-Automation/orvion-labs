import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')
    const next = requestUrl.searchParams.get('next') || '/projects'
    const origin = requestUrl.origin

    console.log('[AUTH CALLBACK] Received request:', {
        hasCode: !!code,
        hasTokenHash: !!token_hash,
        type,
        next
    })

    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Server Component context
                    }
                },
            },
        }
    )

    // Handle code exchange (OAuth, Magic Link, Password Recovery)
    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('[AUTH CALLBACK] Code exchange error:', error.message)

            // Redirect with specific error
            if (next === '/update-password' || type === 'recovery') {
                return NextResponse.redirect(`${origin}/forgot-password?error=expired&reason=${encodeURIComponent(error.message)}`)
            }
            return NextResponse.redirect(`${origin}/login?error=auth_failed`)
        }

        console.log('[AUTH CALLBACK] Code exchange successful, user:', data.user?.email)
    }

    // Handle token_hash (alternative recovery flow)
    if (token_hash && type === 'recovery') {
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'recovery'
        })

        if (error) {
            console.error('[AUTH CALLBACK] Token verification error:', error.message)
            return NextResponse.redirect(`${origin}/forgot-password?error=expired&reason=${encodeURIComponent(error.message)}`)
        }
    }

    // Redirect to destination
    return NextResponse.redirect(`${origin}${next}`)
}
