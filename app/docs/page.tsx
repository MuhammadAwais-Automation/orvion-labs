import { Book, Code, Terminal, FileText, Cpu, Shield } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Documentation - Orvion Labs',
    description: 'Learn how to use Orvion Labs to test and refine your AI prompts.',
}

export default function DocsPage() {
    const guides = [
        {
            title: 'Getting Started',
            description: 'Learn the basics of Orvion Labs and set up your first project.',
            icon: Book,
            href: '/docs/getting-started'
        },
        {
            title: 'Creating Test Suites',
            description: 'How to structure your test cases and import data.',
            icon: FileText,
            href: '/docs/test-suites'
        },
        {
            title: 'Running Evaluations',
            description: 'Execute prompt tests and interpret the results.',
            icon: Cpu,
            href: '/docs/evaluations'
        },
        {
            title: 'API Reference',
            description: 'Integrate Orvion Labs directly into your CI/CD pipeline.',
            icon: Terminal,
            href: '/docs/api'
        },
        {
            title: 'Security & Privacy',
            description: 'How we handle your data and prompt inputs.',
            icon: Shield,
            href: '/docs/security'
        },
        {
            title: 'Advanced Configuration',
            description: 'Customizing models, thresholds, and parameters.',
            icon: Code,
            href: '/docs/advanced'
        }
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Documentation
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 max-w-2xl">
                    Everything you need to know about testing AI prompts with Orvion Labs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => {
                    const Icon = guide.icon
                    return (
                        <Link
                            key={guide.title}
                            href={guide.href}
                            className="group block p-6 bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/5 rounded-xl hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 backdrop-blur-sm"
                        >
                            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                                <Icon className="w-5 h-5 text-cyan-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-500 transition-colors">
                                {guide.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">
                                {guide.description}
                            </p>
                        </Link>
                    )
                })}
            </div>

            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Need help with something else?
                </h3>
                <p className="text-gray-500 dark:text-zinc-400 mb-6">
                    Our support team is available to assist you with complex setups.
                </p>
                <button className="px-6 py-2 bg-white dark:bg-white text-black font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all">
                    Contact Support
                </button>
            </div>
        </div>
    )
}
