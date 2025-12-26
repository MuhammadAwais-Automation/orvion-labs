'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProjectCard } from './project-card'
import { CreateProjectButton } from '@/components/create-project-button'

interface Project {
    id: string
    name: string
    description: string | null
    created_at: string
    updated_at?: string
}

interface TestRun {
    project_id: string
    status: 'completed' | 'failed' | 'running'
    passed_cases: number
    total_cases: number
    created_at: string
}

interface ProjectsManagerProps {
    projects: Project[]
    recentRuns?: TestRun[]
}

export function ProjectsManager({ projects, recentRuns = [] }: ProjectsManagerProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'completed' | 'failed'>('all')

    // Filter logic
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase())

        let matchesFilter = true
        // Advanced filtering based on recent run status
        const projectRuns = recentRuns.filter(r => r.project_id === project.id)
        const lastRun = projectRuns[0]

        if (filterStatus === 'running') matchesFilter = lastRun?.status === 'running'
        if (filterStatus === 'completed') matchesFilter = lastRun?.status === 'completed'
        if (filterStatus === 'failed') matchesFilter = lastRun?.status === 'failed'

        return matchesSearch && matchesFilter
    })

    // Group runs by project
    const getProjectRuns = (projectId: string) => {
        return recentRuns
            .filter(run => run.project_id === projectId)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return (
        <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full md:max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
                    <Input
                        placeholder="Search projects by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 bg-white/50 dark:bg-black/20 border-gray-200 dark:border-white/10 backdrop-blur-sm focus:border-cyan-500/50 text-gray-900 dark:text-white placeholder:text-gray-500 transition-all rounded-full shadow-sm w-full"
                    />
                </div>

                <div className="flex items-center p-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className={`h-8 w-8 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 text-cyan-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className={`h-8 w-8 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 text-cyan-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>



            {/* Projects Content */}
            {filteredProjects.length > 0 ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ProjectCard
                                project={project}
                                recentRuns={getProjectRuns(project.id)}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="bg-gray-50/50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-gray-200 dark:border-white/10 p-8 backdrop-blur-sm max-w-md mx-auto">
                        {searchQuery || filterStatus !== 'all' ? (
                            <>
                                <p className="text-gray-600 dark:text-zinc-400 mb-2">No projects found</p>
                                <p className="text-sm text-gray-500">Try adjusting your filters</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                                    className="mt-2 text-cyan-500"
                                >
                                    Clear all filters
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-600 dark:text-zinc-400 mb-4">No projects yet</p>
                                <CreateProjectButton />
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
