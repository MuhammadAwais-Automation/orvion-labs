'use client'

import { useState } from 'react'
import { GeneralSection } from '@/components/account/general-section'
import { BillingSection } from '@/components/account/billing-section'
import { SecuritySection } from '@/components/account/security-section'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/login/actions'

interface AccountClientProps {
    fullName: string
    email: string
    userId: string
    credits: number
    tier: 'free' | 'pro'
}

export function AccountClient({ fullName, email, userId, credits, tier }: AccountClientProps) {
    const [activeTab, setActiveTab] = useState('general')

    const creditLimit = tier === 'pro' ? 100000 : 1000

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'billing', label: 'Billing & Plans' },
        { id: 'security', label: 'Security' }
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Settings
                    </h1>
                    <form action={signOut}>
                        <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </form>
                </div>
                <p className="text-gray-500 dark:text-zinc-400">
                    Manage your account preferences and subscription.
                </p>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex items-center space-x-1 border-b border-gray-200 dark:border-white/10 mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                            ${activeTab === tab.id
                                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div className="min-h-[400px]">
                {activeTab === 'general' && (
                    <GeneralSection
                        initialFullName={fullName}
                        email={email}
                        userId={userId}
                    />
                )}

                {activeTab === 'billing' && (
                    <BillingSection
                        credits={credits}
                        tier={tier}
                        creditLimit={creditLimit}
                    />
                )}

                {activeTab === 'security' && <SecuritySection />}
            </div>
        </div>
    )
}
