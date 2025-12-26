'use client'

import { Bell, Mail, Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function NotificationsSection() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Notifications</h2>
                <p className="text-sm text-slate-400">Manage your notification preferences</p>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-12 text-center">
                <div className="inline-flex p-4 bg-cyan-500/10 rounded-2xl mb-4">
                    <Bell className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Notification preferences will be available in a future update.
                    Stay tuned for email and push notification settings!
                </p>
                <Badge variant="outline" className="mt-4 border-cyan-500/30 text-cyan-400">
                    In Development
                </Badge>
            </div>

            {/* Placeholder Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <h4 className="font-medium text-white">Email Notifications</h4>
                    </div>
                    <p className="text-xs text-slate-500">
                        Get notified about test runs, project updates, and more via email
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-3">
                        <Smartphone className="w-5 h-5 text-slate-400" />
                        <h4 className="font-medium text-white">Push Notifications</h4>
                    </div>
                    <p className="text-xs text-slate-500">
                        Receive real-time alerts on your devices
                    </p>
                </div>
            </div>
        </div>
    )
}
