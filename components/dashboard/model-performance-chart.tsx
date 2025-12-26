'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Mock data for the chart
const mockData = [
    { day: 'Mon', 'GPT-4o Mini': 75, 'GPT-4o': 82 },
    { day: 'Tue', 'GPT-4o Mini': 78, 'GPT-4o': 85 },
    { day: 'Wed', 'GPT-4o Mini': 72, 'GPT-4o': 80 },
    { day: 'Thu', 'GPT-4o Mini': 80, 'GPT-4o': 88 },
    { day: 'Fri', 'GPT-4o Mini': 77, 'GPT-4o': 86 },
    { day: 'Sat', 'GPT-4o Mini': 81, 'GPT-4o': 90 },
    { day: 'Sun', 'GPT-4o Mini': 79, 'GPT-4o': 87 },
]

export function ModelPerformanceChart() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="bg-white/80 dark:bg-zinc-900/50 border-gray-200 dark:border-white/5 backdrop-blur-md shadow-sm dark:shadow-2xl transition-all hover:border-gray-300 dark:hover:border-white/10 h-full">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="h-4 w-1 bg-cyan-500 rounded-full" />
                        Model Performance
                    </CardTitle>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Pass rate comparison (GPT-4o vs GPT-4o Mini)</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGpt4o" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorGpt4oMini" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="day"
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[60, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(23, 23, 23, 0.9)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    backdropFilter: 'blur(8px)',
                                    fontSize: '12px',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Area
                                type="monotone"
                                dataKey="GPT-4o"
                                stroke="#a855f7"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorGpt4o)"
                            />
                            <Area
                                type="monotone"
                                dataKey="GPT-4o Mini"
                                stroke="#06b6d4"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorGpt4oMini)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    )
}
