'use client'

import { User, CreditCard, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

interface AccountSidebarProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield }
]

export function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
    return (
        <div className="w-64 border-r border-white/10 bg-slate-950/50 p-6 flex flex-col">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-1">Account</h2>
                <p className="text-xs text-slate-500">Manage your account settings</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                transition-all duration-200 relative group
                                ${isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            {/* Active indicator line */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}

                            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                            <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-xs text-slate-600">
                    Version 1.0.0
                </p>
            </div>
        </div>
    )
}
