'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Beaker, ArrowRight, Plus } from 'lucide-react'
import { CreateProjectButton } from '@/components/create-project-button'

interface Project {
    id: string
    name: string
    description: string | null
    created_at: string
}

export function Dashboard({ projects }: { projects: Project[] }) {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
            {projects && projects.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Projects</h2>
                            <p className="text-gray-600 dark:text-gray-400">Manage and run regression tests for your AI prompts</p>
                        </div>
                        <CreateProjectButton />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="group block h-full bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                        <ArrowRight className="w-5 h-5 text-blue-400" />
                                    </div>

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                            <Beaker className="w-6 h-6 text-blue-400" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {project.name}
                                    </h3>

                                    {project.description ? (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                            {project.description}
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 dark:text-gray-500 text-sm italic mb-4">
                                            No description provided
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 mt-auto">
                                        <span className="text-xs text-gray-500">
                                            Created {new Date(project.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs font-medium text-blue-400/0 group-hover:text-blue-400 transition-all">
                                            Open Project
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Quick Add Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: projects.length * 0.1 }}
                            className="h-full min-h-[200px] border border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center p-6 text-gray-500 hover:text-gray-300 hover:border-gray-500 hover:bg-gray-800/30 transition-all cursor-pointer group"
                        >
                            {/* We can't easily wrap CreateProjectButton trigger here without refactoring it, 
                   so for now just a visual cue or a duplicate button if CreateProjectButton allowed custom trigger.
                   Actually CreateProjectButton renders a Dialog. 
                   Let's just keep the top button for now and maybe make this a link to create? 
                   Or just leave it out to avoid complexity. 
                   Let's just use the top button. 
               */}
                            <div className="text-center">
                                <p className="text-sm">Want to start something new?</p>
                                <div className="mt-4">
                                    <CreateProjectButton />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-800/30 rounded-full p-8 mb-6 border border-gray-700 relative"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                        <Beaker className="w-16 h-16 text-blue-400 relative z-10" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">No Projects Yet</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                        Create your first project to start testing and monitoring your AI prompts for regressions
                    </p>
                    <CreateProjectButton />
                </div>
            )}
        </div>
    )
}
