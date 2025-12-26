import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AccountClient } from '@/components/account/account-client'

export const metadata = {
    title: 'Account & Settings - Orvion Labs',
    description: 'Manage your account settings and preferences',
}

export default async function AccountPage() {
    const supabase = await createClient()

    // Fetch authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const email = profile?.email || user.email || ''
    const fullName = profile?.full_name || ''

    return (
        <AccountClient
            fullName={fullName}
            email={email}
            userId={user.id}
        />
    )
}
