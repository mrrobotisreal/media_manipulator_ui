'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDrQueryErrorRedirect } from '@/lib/dr/useDrQueryErrorRedirect';
import {
  useChatLabStatsBreakdown,
  useChatLabStatsSummary,
  useChatLabStatsTimeseries,
} from '@/lib/dr/useDrChatLab';
import type { StatsRange } from '@/lib/dr/chatLabApi';
import type { ChatLabStatsBreakdownRow, ChatLabStatsBucket } from '@/schemas/drChatLab';
import BalanceCard from './balance-card';
import { SpendByModelChart, SpendOverTimeChart, TokensOverTimeChart } from './stats-charts';
import StatsTable, { formatTokens, formatUsd, type StatsColumn } from './stats-table';

// The Usage & Stats page: balance card, date-range presets, charts, and the
// per-model / per-project / per-user / per-chat / per-kind tables. All
// bucketing and dates are UTC.

type RangePreset = '7d' | '30d' | '90d' | 'all';

const PRESETS: Array<{ id: RangePreset; label: string; days: number | null; bucket: ChatLabStatsBucket }> = [
  { id: '7d', label: '7d', days: 7, bucket: 'day' },
  { id: '30d', label: '30d', days: 30, bucket: 'day' },
  { id: '90d', label: '90d', days: 90, bucket: 'week' },
  { id: 'all', label: 'All', days: null, bucket: 'month' },
];

const KIND_LABELS: Record<string, string> = {
  chat: 'Chat turns',
  title: 'Auto-titling',
  memory: 'Project memory',
};

function baseColumns(): StatsColumn<ChatLabStatsBreakdownRow>[] {
  return [
    { header: 'Cost', align: 'right', render: (r) => formatUsd(r.costUsd) },
    { header: 'Prompt', align: 'right', render: (r) => formatTokens(r.promptTokens) },
    { header: 'Completion', align: 'right', render: (r) => formatTokens(r.completionTokens) },
    { header: 'Reasoning', align: 'right', render: (r) => formatTokens(r.reasoningTokens) },
    { header: 'Events', align: 'right', render: (r) => r.events },
  ];
}

function presetRange(days: number | null): StatsRange {
  if (days === null) return {};
  return { from: new Date(Date.now() - days * 86_400_000).toISOString() };
}

export default function StatsView() {
  const [preset, setPreset] = useState<RangePreset>('30d');
  // `from` is pinned when the preset is picked (event handler / lazy init) so
  // queries don't churn on every render.
  const [range, setRange] = useState<StatsRange>(() => presetRange(30));
  const active = PRESETS.find((p) => p.id === preset) ?? PRESETS[1];

  const selectPreset = (p: (typeof PRESETS)[number]) => {
    setPreset(p.id);
    setRange(presetRange(p.days));
  };

  const summaryQuery = useChatLabStatsSummary(range);
  const spendSeries = useChatLabStatsTimeseries(active.bucket, 'model', range);
  const tokenSeries = useChatLabStatsTimeseries(active.bucket, 'none', range);
  const modelRows = useChatLabStatsBreakdown('model', range);
  const projectRows = useChatLabStatsBreakdown('project', range);
  const userRows = useChatLabStatsBreakdown('user', range);
  const sessionRows = useChatLabStatsBreakdown('session', range);
  const kindRows = useChatLabStatsBreakdown('kind', range);

  useDrQueryErrorRedirect(summaryQuery.error);

  const modelColumns: StatsColumn<ChatLabStatsBreakdownRow>[] = [
    { header: 'Model', render: (r) => <span className="font-medium">{r.label}</span> },
    ...baseColumns(),
    {
      header: '👍 rate',
      align: 'right',
      render: (r) => {
        const up = r.thumbsUp ?? 0;
        const down = r.thumbsDown ?? 0;
        const total = up + down;
        if (total === 0) return <span className="text-muted-foreground">—</span>;
        return (
          <span title={`${up} 👍 / ${down} 👎`}>
            {Math.round((up / total) * 100)}% <span className="text-muted-foreground">({up}/{total})</span>
          </span>
        );
      },
    },
  ];

  const labelColumn = (header: string): StatsColumn<ChatLabStatsBreakdownRow> => ({
    header,
    render: (r) => <span className="font-medium">{r.label}</span>,
  });

  const sessionColumns: StatsColumn<ChatLabStatsBreakdownRow>[] = [
    {
      header: 'Chat',
      render: (r) =>
        r.key !== 'unknown' ? (
          <Link href={`/dr/demos/chat-lab/c/${r.key}`} className="font-medium text-primary hover:underline">
            {r.label}
          </Link>
        ) : (
          <span className="font-medium">{r.label}</span>
        ),
    },
    ...baseColumns(),
  ];

  const kindColumns: StatsColumn<ChatLabStatsBreakdownRow>[] = [
    { header: 'Kind', render: (r) => <span className="font-medium">{KIND_LABELS[r.key] ?? r.label}</span> },
    ...baseColumns(),
  ];

  if (summaryQuery.isLoading || !summaryQuery.data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-tight">Usage &amp; Stats</h1>
          <span className="text-[11px] text-muted-foreground">Times in UTC</span>
        </div>

        <BalanceCard summary={summaryQuery.data} />

        {/* Filter bar */}
        <div className="flex items-center gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPreset(p)}
              className={cn(
                'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                preset === p.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              {p.label}
            </button>
          ))}
          <span className="ml-2 text-[11px] text-muted-foreground">
            {summaryQuery.data.totals.events} events · {formatUsd(summaryQuery.data.totals.costUsd)} in range
          </span>
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <SpendOverTimeChart points={spendSeries.data ?? []} />
          <TokensOverTimeChart points={tokenSeries.data ?? []} />
        </div>
        <SpendByModelChart rows={modelRows.data ?? []} />

        {/* Tables */}
        <Card className="gap-0 p-0">
          <Tabs defaultValue="models" className="w-full">
            <TabsList className="m-3">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="kinds">Call kind</TabsTrigger>
            </TabsList>
            <TabsContent value="models">
              <StatsTable rows={modelRows.data ?? []} columns={modelColumns} keyFor={(r) => r.key} emptyText="No usage in range." />
            </TabsContent>
            <TabsContent value="projects">
              <StatsTable
                rows={projectRows.data ?? []}
                columns={[labelColumn('Project'), ...baseColumns()]}
                keyFor={(r) => r.key}
                emptyText="No usage in range."
              />
            </TabsContent>
            <TabsContent value="users">
              <StatsTable
                rows={userRows.data ?? []}
                columns={[labelColumn('User'), ...baseColumns()]}
                keyFor={(r) => r.key}
                emptyText="No usage in range."
              />
            </TabsContent>
            <TabsContent value="chats">
              <StatsTable rows={sessionRows.data ?? []} columns={sessionColumns} keyFor={(r) => r.key} emptyText="No usage in range." />
            </TabsContent>
            <TabsContent value="kinds">
              <StatsTable rows={kindRows.data ?? []} columns={kindColumns} keyFor={(r) => r.key} emptyText="No usage in range." />
            </TabsContent>
          </Tabs>
        </Card>

        <p className="pb-4 text-[11px] text-muted-foreground">
          Deleted chats and projects keep their spend here, labeled with the name they had at the time. Costs marked ≈
          include events with unknown or catalog-estimated pricing.
        </p>
      </div>
    </div>
  );
}
