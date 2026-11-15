import React from 'react';
import { loadBenchmarkData } from '@/lib/benchmark';
import { KPISummary } from '@/components/benchmarks/KPISummary';
import { MetricsBarChart } from '@/components/benchmarks/MetricsBarChart';
import { RadarChart } from '@/components/benchmarks/RadarChart';
import { DomainChart } from '@/components/benchmarks/DomainChart';
import { MetricsTable } from '@/components/benchmarks/MetricsTable';
import { SampleExplorer } from '@/components/benchmarks/SampleExplorer';

export const metadata = {
  title: 'FieldBench Evaluation & Alignment Analytics | Tiny-Aya',
  description: 'Empirical benchmark comparing CohereLabs/tiny-aya-global Base, SFT v2, and DPO-aligned adapters on schema-conditioned JSON extraction.',
};

export default async function BenchmarksPage() {
  const data = await loadBenchmarkData();
  const { overall, by_domain, samples } = data;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Top Section Monospace Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-500">
            FieldBench Alignment Evaluation · 80 Samples · 5 Domains
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 mt-0.5">
            Empirical Results &amp; Cross-Model Analysis
          </h1>
        </div>

        <div className="text-xs font-mono text-zinc-400">
          Source: <span className="text-zinc-600 font-medium">fieldbench/corpus</span>
        </div>
      </div>

      {/* Row 1: KPI Summary Cards */}
      <KPISummary base={overall.base} sftv2={overall.sftv2} dpo={overall.dpo} />

      {/* Row 2: Standardized Summary Table */}
      <MetricsTable base={overall.base} sftv2={overall.sftv2} dpo={overall.dpo} />

      {/* Row 3: 7-Metric Bar Chart & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <MetricsBarChart base={overall.base} sftv2={overall.sftv2} dpo={overall.dpo} />
        </div>
        <div className="lg:col-span-5">
          <RadarChart base={overall.base} sftv2={overall.sftv2} dpo={overall.dpo} />
        </div>
      </div>

      {/* Row 4: Per-Domain Breakdown Chart */}
      <DomainChart byDomain={by_domain} />

      {/* Row 5: Sample Explorer */}
      <SampleExplorer samples={samples} />
    </div>
  );
}
