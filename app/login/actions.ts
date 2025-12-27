'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    console.log('[LOGIN] Action called')

    if (!formData) {
        console.error('[LOGIN] FormData is null')
        return { success: false, error: 'Form data is missing' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        console.error('[LOGIN] Email or password missing')
        return { success: false, error: 'Email and password are required' }
    }

    console.log('[LOGIN] Attempting login for:', email)

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('[LOGIN] Supabase error:', error.message)
        return { success: false, error: error.message }
    }

    console.log('[LOGIN] Success! Redirecting to dashboard...')
    revalidatePath('/', 'layout')
    redirect('/') // This throws internally, don't catch it!
}

export async function signup(formData: FormData) {
    console.log('[SIGNUP] Action called')

    if (!formData) {
        console.error('[SIGNUP] FormData is null')
        return { success: false, error: 'Form data is missing' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        console.error('[SIGNUP] Email or password missing')
        return { success: false, error: 'Email and password are required' }
    }

    console.log('[SIGNUP] Attempting signup for:', email)

    try {
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
            },
        })

        if (error) {
            console.error('[SIGNUP] Supabase error:', error.message)
            return { success: false, error: error.message }
        }

        // Create profile for the new user
        if (data.user) {
            console.log('[SIGNUP] Creating profile for user:', data.user.id)

            // Extract name from email (e.g., awais.mushtaq@gmail.com -> Awais Mushtaq)
            const emailUsername = email.split('@')[0]
            const defaultName = emailUsername
                .split(/[._-]/) // Split on dots, underscores, or dashes
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    email: email,
                    full_name: defaultName,
                }, { onConflict: 'id' })

            if (profileError) {
                console.error('[SIGNUP] Profile creation/update error:', profileError.message)
                // Don't fail signup if profile creation fails, but log it
            } else {
                console.log('[SIGNUP] Profile ensured successfully')
            }
        }

        console.log('[SIGNUP] Success! User created')
        return {
            success: true,
            message: 'Check your email to confirm your account!'
        }
    } catch (error: any) {
        console.error('[SIGNUP] Unexpected error:', error)
        return { success: false, error: error.message || 'An unexpected error occurred' }
    }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function deleteAccount() {
    console.log('[DELETE ACCOUNT] Action called')
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        console.error('[DELETE ACCOUNT] No authenticated user found')
        return { success: false, error: 'User not authenticated' }
    }

    console.log('[DELETE ACCOUNT] Deleting data for user:', user.id)

    // Delete profile (cascading deletes will handle the rest in the database)
    const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

    if (profileError) {
        console.error('[DELETE ACCOUNT] Profile deletion error:', profileError.message)
        return { success: false, error: profileError.message }
    }

    // Delete user from Auth using Admin API
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceRoleKey) {
        try {
            // Create admin client with service role key
            const { createClient: createAdminClient } = await import('@supabase/supabase-js')
            const supabaseAdmin = createAdminClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceRoleKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            )

            const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
            if (authDeleteError) {
                console.error('[DELETE ACCOUNT] Auth deletion error:', authDeleteError.message)
            } else {
                console.log('[DELETE ACCOUNT] Auth user deleted successfully')
            }
        } catch (err: any) {
            console.error('[DELETE ACCOUNT] Admin API error:', err.message)
        }
    } else {
        console.warn('[DELETE ACCOUNT] Service role key not found, only profile deleted')
        // Sign out the user if we can't delete from auth
        await supabase.auth.signOut()
    }

    console.log('[DELETE ACCOUNT] Success! Account fully removed.')

    revalidatePath('/', 'layout')
    return { success: true }
}
