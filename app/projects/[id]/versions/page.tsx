import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VersionDiffViewer } from '@/components/version-diff-viewer'
import { ProjectSidebar } from '@/components/project-sidebar'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function VersionsPage({ params }: PageProps) {
    const { id: projectId } = await params
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch project
    const { data: project, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', projectId)
        .single()

    if (error || !project) {
        redirect('/')
    }

    return (
        <div className="flex h-full">
            <ProjectSidebar projectId={projectId} user={null} />

            <main className="flex-1 overflow-y-auto bg-[#09090b]">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            Version Comparison
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Compare prompt versions side-by-side
                        </p>
                    </div>

                    {/* Diff Viewer */}
                    <VersionDiffViewer projectId={projectId} />
                </div>
            </main>
        </div>
    )
}
