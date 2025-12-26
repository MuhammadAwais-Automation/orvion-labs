'use client'

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, FileEdit, Rocket, TestTube } from 'lucide-react'

interface Activity {
    id: string
    type: 'test_run' | 'version_created' | 'project_updated' | 'test_case_added'
    title: string
    description: string
    timestamp: Date
}

interface ActivityFeedProps {
    activities?: Activity[]
}

// Mock activities
const mockActivities: Activity[] = [
    {
        id: '1',
        type: 'test_run',
        title: 'Test Run Completed',
        description: 'User Authentication Tests',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2h ago
    },
    {
        id: '2',
        type: 'version_created',
        title: 'New Version Created',
        description: 'v2.0 - Updated system prompt',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5h ago
    },
    {
        id: '3',
        type: 'project_updated',
        title: 'Project Updated',
        description: 'Added 3 new test cases',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1d ago
    },
    {
        id: '4',
        type: 'test_case_added',
        title: 'Test Case Added',
        description: 'Edge case for empty input',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2d ago
    }
]

export function ActivityFeed({ activities = mockActivities }: ActivityFeedProps) {
    const getIcon = (type: Activity['type']) => {
        switch (type) {
            case 'test_run':
                return <Rocket className="w-4 h-4 text-cyan-400" />
            case 'version_created':
                return <FileEdit className="w-4 h-4 text-purple-400" />
            case 'project_updated':
                return <CheckCircle className="w-4 h-4 text-green-400" />
            case 'test_case_added':
                return <TestTube className="w-4 h-4 text-blue-400" />
            default:
                return <CheckCircle className="w-4 h-4 text-gray-400" />
        }
    }

    const getIconBg = (type: Activity['type']) => {
        switch (type) {
            case 'test_run':
                return 'bg-cyan-500/10 border-cyan-500/20'
            case 'version_created':
                return 'bg-purple-500/10 border-purple-500/20'
            case 'project_updated':
                return 'bg-green-500/10 border-green-500/20'
            case 'test_case_added':
                return 'bg-blue-500/10 border-blue-500/20'
            default:
                return 'bg-gray-500/10 border-gray-500/20'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Card className="bg-white/80 dark:bg-zinc-900/50 border-gray-200 dark:border-white/5 backdrop-blur-md shadow-sm dark:shadow-2xl transition-all hover:border-gray-300 dark:hover:border-white/10">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        Recent Activity
                    </CardTitle>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Latest events across your projects</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex gap-3 relative"
                            >
                                {/* Timeline line */}
                                {index !== activities.length - 1 && (
                                    <div className="absolute left-[18px] top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />
                                )}

                                {/* Icon */}
                                <div className={`flex-shrink-0 w-9 h-9 rounded-lg border ${getIconBg(activity.type)} flex items-center justify-center z-10 bg-white dark:bg-gray-900`}>
                                    {getIcon(activity.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pb-2">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
                                        {activity.title}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate mb-1">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
