import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Calculator, Database, Clock } from 'lucide-react'

export default async function AuditPage() {
    const supabase = await createClient()

    // Fetch last 50 test results across all projects
    const { data: results, error } = await supabase
        .from('test_results')
        .select(`
            id,
            created_at,
            input_used,
            tokens_used,
            judge_tokens,
            generation_cost,
            judge_cost,
            total_cost,
            test_runs (
                model
            )
        `)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Audit fetch error:', error)
    }

    const testResults = results || []

    // Calculate summary totals
    const totalGenTokens = testResults.reduce((sum, r) => sum + (r.tokens_used || 0), 0)
    const totalJudgeTokens = testResults.reduce((sum, r) => sum + (r.judge_tokens || 0), 0)
    const totalTokens = totalGenTokens + totalJudgeTokens
    const totalCredits = testResults.reduce((sum, r) => sum + (r.total_cost || 0), 0)
    const totalGenCost = testResults.reduce((sum, r) => sum + (r.generation_cost || 0), 0)
    const totalJudgeCost = testResults.reduce((sum, r) => sum + (r.judge_cost || 0), 0)

    return (
        <div className="h-screen bg-[#09090b] text-white p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Calculator className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Internal Cost Auditor</h1>
                        <p className="text-slate-400">Verify token calculations and credit charges</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400 font-medium flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                Total Tokens
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white">{totalTokens.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Gen: {totalGenTokens.toLocaleString()} | Judge: {totalJudgeTokens.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400 font-medium flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Total Credits Burned
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-amber-400">{totalCredits.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Gen: {totalGenCost} | Judge: {totalJudgeCost}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400 font-medium flex items-center gap-2">
                                <Calculator className="w-4 h-4" />
                                Avg Cost/Test
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white">
                                {testResults.length > 0 ? (totalCredits / testResults.length).toFixed(1) : '0'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">credits per test case</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400 font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Results Shown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white">{testResults.length}</p>
                            <p className="text-xs text-slate-500 mt-1">last 50 test results</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Calculator Table */}
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Database className="w-5 h-5 text-cyan-500" />
                            Raw Cost Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-white/10 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-white/5">
                                    <TableRow className="border-white/10 hover:bg-white/5">
                                        <TableHead className="text-slate-400 text-xs font-semibold">DATE</TableHead>
                                        <TableHead className="text-slate-400 text-xs font-semibold">INPUT SNIPPET</TableHead>
                                        <TableHead className="text-slate-400 text-xs font-semibold">MODEL</TableHead>
                                        <TableHead className="text-slate-400 text-xs font-semibold text-right">GEN TOKENS</TableHead>
                                        <TableHead className="text-slate-400 text-xs font-semibold text-right">JUDGE TOKENS</TableHead>
                                        <TableHead className="text-slate-400 text-xs font-semibold text-right">GEN COST</TableHead>
                                        <TableHead className="text-slate-400 text-xs font-semibold text-right">JUDGE COST</TableHead>
                                        <TableHead className="text-slate-400 text-xs font-semibold text-right">TOTAL</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {testResults.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-slate-500 py-12">
                                                No test results found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        testResults.map((result: any) => (
                                            <TableRow key={result.id} className="border-white/10 hover:bg-white/5">
                                                <TableCell className="text-slate-300 text-xs font-mono">
                                                    {new Date(result.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-slate-300 text-xs max-w-[200px] truncate">
                                                    {result.input_used?.substring(0, 50) || '—'}...
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                                                        {result.test_runs?.model || 'gpt-4o-mini'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-slate-200">
                                                    {result.tokens_used || 0}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-purple-400">
                                                    {result.judge_tokens || 0}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-slate-200">
                                                    {result.generation_cost || 0}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-purple-400">
                                                    {result.judge_cost || 0}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-mono">
                                                        {result.total_cost || 0}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Note */}
                <p className="text-center text-slate-600 text-sm">
                    Internal auditing page • Data refreshes on page load
                </p>
            </div>
        </div>
    )
}
