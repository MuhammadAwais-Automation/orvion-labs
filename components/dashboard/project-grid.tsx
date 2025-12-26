'use client'

import { useState } from 'react'
import { ProjectCard } from './project-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Project } from '@/types/database'
import { CreateProjectDialog } from './create-project-dialog'

interface ProjectGridProps {
    projects: (Project & {
        current_version?: { version_number: number }
        last_runs?: { status: string }[]
    })[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
    const [search, setSearch] = useState('')

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-10 bg-slate-900/50 border-slate-800 focus:border-cyan-500/50 text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <CreateProjectDialog />
            </div>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                    <p className="text-slate-400">No projects found matching "{search}"</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    )
}
