'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    LayoutDashboard,
    FolderOpen,
    Search,
    Moon,
    Sun,
    Laptop,
    Plus
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DialogTitle } from '@radix-ui/react-dialog'

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const { setTheme } = useTheme()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="overflow-hidden p-0 shadow-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 max-w-2xl show-close-button-false">
                <VisuallyHidden>
                    <DialogTitle>Command Menu</DialogTitle>
                </VisuallyHidden>
                <Command className="flex h-full w-full flex-col overflow-hidden rounded-md bg-transparent">
                    <div className="flex items-center border-b border-gray-200 dark:border-white/10 px-4" cmdk-input-wrapper="">
                        <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
                        <Command.Input
                            placeholder="Type a command or search..."
                            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
                        />
                    </div>
                    <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                        <Command.Empty className="py-6 text-center text-sm text-gray-500">No results found.</Command.Empty>

                        <Command.Group heading="General" className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1.5 mb-2">
                            <Command.Item
                                className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-gray-100 dark:aria-selected:bg-white/10 dark:text-gray-100"
                                onSelect={() => runCommand(() => router.push('/'))}
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Command.Item>
                            <Command.Item
                                className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-gray-100 dark:aria-selected:bg-white/10 dark:text-gray-100"
                                onSelect={() => runCommand(() => router.push('/projects'))}
                            >
                                <FolderOpen className="mr-2 h-4 w-4" />
                                <span>Projects</span>
                            </Command.Item>
                            <Command.Item
                                className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-gray-100 dark:aria-selected:bg-white/10 dark:text-gray-100"
                                onSelect={() => runCommand(() => router.push('/account'))}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading="Actions" className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1.5 mb-2 border-t border-gray-200 dark:border-white/5 pt-2">
                            <Command.Item
                                className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-gray-100 dark:aria-selected:bg-white/10 dark:text-gray-100"
                                onSelect={() => runCommand(() => {
                                    // Trigger create project modal if possible, or navigate
                                    // For now navigate to dashboard where button exists
                                    router.push('/')
                                })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                <span>Create New Project</span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading="Theme" className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1.5 mb-2 border-t border-gray-200 dark:border-white/5 pt-2">
                            <Command.Item
                                className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-gray-100 dark:aria-selected:bg-white/10 dark:text-gray-100"
                                onSelect={() => runCommand(() => setTheme('light'))}
                            >
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Light Mode</span>
                            </Command.Item>
                            <Command.Item
                                className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-gray-100 dark:aria-selected:bg-white/10 dark:text-gray-100"
                                onSelect={() => runCommand(() => setTheme('dark'))}
                            >
                                <Moon className="mr-2 h-4 w-4" />
                                <span>Dark Mode</span>
                            </Command.Item>
                            <Command.Item
                                className="relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none aria-selected:bg-gray-100 dark:aria-selected:bg-white/10 dark:text-gray-100"
                                onSelect={() => runCommand(() => setTheme('system'))}
                            >
                                <Laptop className="mr-2 h-4 w-4" />
                                <span>System</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </DialogContent>
        </Dialog>
    )
}
