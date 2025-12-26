import type { Metadata } from 'next'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { CommandMenu } from '@/components/command-menu'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import NextTopLoader from 'nextjs-toploader'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Fetch user credits if authenticated
    let credits: number | null = null
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single()

        credits = profile?.credits ?? null
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Kumar+One&display=swap" rel="stylesheet" />
            </head>
            <body className="h-screen flex bg-slate-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
                <div className="fixed inset-0 z-[-1] bg-noise pointer-events-none opacity-50"></div>

                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextTopLoader
                        color="#06b6d4"
                        height={3}
                        showSpinner={false}
                        shadow="0 0 10px #06b6d4,0 0 5px #06b6d4"
                        speed={200}
                    />

                    {/* Render layout based on auth state */}
                    {user ? (
                        <AuthenticatedLayout user={user} initialCredits={credits}>
                            {children}
                        </AuthenticatedLayout>
                    ) : (
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            <Navbar user={null} />
                            <main className="flex-1 overflow-y-auto scrollbar-thin-hover">
                                {children}
                            </main>
                        </div>
                    )}

                    <CommandMenu />
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
