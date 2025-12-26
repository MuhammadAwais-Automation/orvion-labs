'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectCard } from './project-card'
import { CreateProjectButton } from '@/components/create-project-button'
import { cn } from '@/lib/utils'

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
        <div className="space-y-8">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative flex-1 w-full md:max-w-xl group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors z-10" />
                    <Input
                        placeholder="Search projects by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-900 dark:text-white rounded-2xl focus-visible:ring-cyan-500/30 transition-all font-medium placeholder:text-slate-400 shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                        <TabsList className="bg-transparent border-none p-0 h-9">
                            <TabsTrigger value="grid" className="rounded-lg px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm transition-all h-7">
                                <LayoutGrid className="w-4 h-4 mr-2" />
                                <span className="text-xs font-bold uppercase tracking-wider">Grid</span>
                            </TabsTrigger>
                            <TabsTrigger value="list" className="rounded-lg px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm transition-all h-7">
                                <List className="w-4 h-4 mr-2" />
                                <span className="text-xs font-bold uppercase tracking-wider">List</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
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
                    className="text-center py-20"
                >
                    <div className="bg-slate-50 dark:bg-white/[0.01] rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/5 p-12 max-w-lg mx-auto shadow-sm">
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-slate-400 dark:text-zinc-600" />
                        </div>
                        {searchQuery || filterStatus !== 'all' ? (
                            <>
                                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-2">No projects found</h3>
                                <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium mb-8">Try adjusting your filters or search terms.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                                    className="rounded-xl font-bold px-6 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
                                >
                                    Clear all filters
                                </Button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-2">No projects yet</h3>
                                <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium mb-8">Get started by creating your first prompt testing project.</p>
                                <CreateProjectButton />
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
