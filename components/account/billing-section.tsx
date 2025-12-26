'use client'

import { Crown, Sparkles, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface BillingSectionProps {
    credits: number
    tier: 'free' | 'pro'
    creditLimit: number
}

export function BillingSection({ credits, tier, creditLimit }: BillingSectionProps) {
    const usagePercentage = (credits / creditLimit) * 100
    const isLowCredits = credits < creditLimit * 0.2

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Billing & Plans</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Manage your subscription and credits</p>
            </div>

            {/* Feature Card - Credits */}
            <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl p-8 shadow-sm">
                {/* Radiant Background in Dark Mode Only */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-6">
                    {/* Plan Badge */}
                    <div className="flex items-center justify-between">
                        <div>
                            {tier === 'pro' ? (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-1.5 shadow-sm">
                                    <Crown className="w-4 h-4 mr-1.5" />
                                    Pro Plan
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white">
                                    <Sparkles className="w-4 h-4 mr-1.5" />
                                    Free Plan
                                </Badge>
                            )}
                        </div>

                        {isLowCredits && (
                            <Badge variant="destructive" className="bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30">
                                Low Credits
                            </Badge>
                        )}
                    </div>

                    {/* Credit Display */}
                    <div className="space-y-3">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                                {credits.toLocaleString()}
                            </span>
                            <span className="text-xl text-gray-500 dark:text-zinc-500">/ {creditLimit.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">Credits remaining</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="relative h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                                style={{ width: `${Math.max(usagePercentage, 2)}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-xs">
                            <span className={`font-medium ${isLowCredits ? 'text-red-500' : 'text-gray-500 dark:text-zinc-400'}`}>
                                {usagePercentage.toFixed(1)}% used
                            </span>
                            <span className="text-gray-400 dark:text-zinc-500">
                                {tier === 'free' ? '5 test cases/project' : '100 test cases/project'}
                            </span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    {tier === 'free' && (
                        <div className="pt-4 flex flex-col md:flex-row gap-3">
                            <Button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Upgrade to Pro
                            </Button>
                            <Button variant="outline" className="border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">
                                View Billing
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Plan Details */}
            <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl p-8 space-y-6 shadow-sm">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white">Plan Limits</h3>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-medium mb-2">
                            Monthly Credits
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {creditLimit.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-medium mb-2">
                            Test Cases Limit
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {tier === 'pro' ? '100' : '5'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
