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
            className="h-full"
        >
            <Card className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-2xl rounded-3xl overflow-hidden h-full flex flex-col">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="h-4 w-1 bg-cyan-500 rounded-full" />
                                Model Performance
                            </CardTitle>
                            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Pass rate comparison (GPT-4o vs GPT-4o Mini)</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 flex-1">
                    <ResponsiveContainer width="100%" height={360}>
                        <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGpt4o" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorGpt4oMini" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.05} vertical={false} />
                            <XAxis
                                dataKey="day"
                                stroke="#9ca3af"
                                fontSize={10}
                                fontWeight="bold"
                                tickLine={false}
                                axisLine={false}
                                dy={15}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={10}
                                fontWeight="bold"
                                tickLine={false}
                                axisLine={false}
                                domain={[60, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px',
                                    backdropFilter: 'blur(12px)',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                                    color: '#fff',
                                    padding: '12px'
                                }}
                                itemStyle={{ color: '#fff', padding: '2px 0' }}
                                cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }}
                            />
                            <Legend
                                iconType="circle"
                                wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="GPT-4o"
                                stroke="#8b5cf6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorGpt4o)"
                                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="GPT-4o Mini"
                                stroke="#06b6d4"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorGpt4oMini)"
                                activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2, fill: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    )
}
