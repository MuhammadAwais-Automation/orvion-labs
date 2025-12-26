import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAuditResults } from '@/app/actions'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react'

export default async function AdminAuditPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { success, results, error } = await getAuditResults()

    if (!success) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#09090b] text-red-400">
                <p>Error loading audit data: {error}</p>
            </div>
        )
    }

    // Count potential billing bugs
    const billingBugs = results?.filter(
        (r: any) => r.judge_tokens > 0 && (r.judge_cost === 0 || r.judge_cost === null)
    ).length || 0

    return (
        <div className="h-screen flex flex-col bg-[#09090b] overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-amber-500" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Internal Audit Tool</h1>
                            <p className="text-slate-400 text-sm">Token Billing Verification • Admin Only</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-400">
                            Showing last <span className="text-white font-bold">50</span> results
                        </div>
                        {billingBugs > 0 && (
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {billingBugs} Potential Bug(s)
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollable Table */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-[#0c0c0e]">
                                    <TableHead className="text-slate-400 text-xs uppercase">Input Snippet</TableHead>
                                    <TableHead className="text-slate-400 text-xs uppercase w-[80px]">Status</TableHead>
                                    <TableHead className="text-slate-400 text-xs uppercase w-[100px] text-right">Gen Tokens</TableHead>
                                    <TableHead className="text-slate-400 text-xs uppercase w-[100px] text-right">Judge Tokens</TableHead>
                                    <TableHead className="text-slate-400 text-xs uppercase w-[100px] text-right">Gen Cost</TableHead>
                                    <TableHead className="text-slate-400 text-xs uppercase w-[100px] text-right">Judge Cost</TableHead>
                                    <TableHead className="text-slate-400 text-xs uppercase w-[100px] text-right">Total Cost</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results?.map((result: any) => {
                                    // Check for potential billing bug
                                    const hasBillingBug = result.judge_tokens > 0 && (result.judge_cost === 0 || result.judge_cost === null)

                                    return (
                                        <TableRow
                                            key={result.id}
                                            className={`border-white/5 ${hasBillingBug
                                                    ? 'bg-red-500/10 hover:bg-red-500/20'
                                                    : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <TableCell className="font-mono text-xs text-slate-300 max-w-[300px] truncate">
                                                {result.input_used?.substring(0, 60) || '—'}
                                                {result.input_used?.length > 60 ? '...' : ''}
                                            </TableCell>
                                            <TableCell>
                                                {result.status === 'success' ? (
                                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        PASS
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        FAIL
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs text-cyan-400">
                                                {result.tokens_used || 0}
                                            </TableCell>
                                            <TableCell className={`text-right font-mono text-xs ${hasBillingBug ? 'text-red-400 font-bold' : 'text-purple-400'}`}>
                                                {result.judge_tokens || 0}
                                                {hasBillingBug && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs text-amber-400">
                                                {result.generation_cost || 0}
                                            </TableCell>
                                            <TableCell className={`text-right font-mono text-xs ${hasBillingBug ? 'text-red-400 font-bold' : 'text-amber-400'}`}>
                                                {result.judge_cost || 0}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs text-white font-bold">
                                                {result.total_cost || 0}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {(!results || results.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate-500 py-12">
                                            No test results found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex items-center gap-6 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></div>
                            <span>Potential Billing Bug: judge_tokens &gt; 0 but judge_cost = 0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
