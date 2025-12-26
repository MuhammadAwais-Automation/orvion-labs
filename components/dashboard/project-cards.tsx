'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FolderOpen, ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'

interface Project {
    id: string
    name: string
    description: string | null
    created_at: string
    updated_at: string | null
}

interface ProjectCardsProps {
    projects: Project[]
}

export function ProjectCards({ projects }: ProjectCardsProps) {
    if (!projects || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-3xl bg-gray-50/50 dark:bg-white/[0.01]">
                <FolderOpen className="w-10 h-10 text-gray-400 dark:text-zinc-600 mb-4" />
                <p className="text-gray-500 dark:text-zinc-400 font-medium">No projects found yet.</p>
                <Link href="/projects" className="mt-4 text-sm font-bold text-cyan-500 hover:text-cyan-600 flex items-center gap-2">
                    Create your first project <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href={`/projects/${project.id}`}>
                        <Card className="group h-full bg-white dark:bg-zinc-900/40 border-gray-200 dark:border-white/5 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 rounded-2xl overflow-hidden flex flex-col">
                            <CardHeader className="p-6 pb-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                                        <FolderOpen className="w-5 h-5" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-cyan-500 transition-colors transform group-hover:translate-x-1" />
                                </div>
                                <CardTitle className="text-lg font-black tracking-tight text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {project.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 flex-1 flex flex-col justify-between">
                                <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 font-medium mb-4">
                                    {project.description || 'No description provided.'}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                                    <Clock className="w-3 h-3" />
                                    <span>Updated {formatDistanceToNow(new Date(project.updated_at || project.created_at), { addSuffix: true })}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}
