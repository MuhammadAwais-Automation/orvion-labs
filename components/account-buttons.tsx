'use client'

import { Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function UpgradeButton() {
    return (
        <Button
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 h-11"
            onClick={() => toast.info('Upgrade feature coming soon! 🚀')}
        >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
        </Button>
    )
}

export function BillingHistoryButton() {
    return (
        <Button
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 text-slate-300"
            onClick={() => toast.info('Billing history coming soon!')}
        >
            View Billing History
        </Button>
    )
}
