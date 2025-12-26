import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'

export async function SiteHeader() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return <Navbar user={user} />
}
