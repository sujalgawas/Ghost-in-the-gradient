import React from 'react';
import { loadBenchmarkData } from '@/lib/benchmark';
import { KPISummary } from '@/components/benchmarks/KPISummary';
import { MetricsBarChart } from '@/components/benchmarks/MetricsBarChart';
import { RadarChart } from '@/components/benchmarks/RadarChart';
import { DomainChart } from '@/components/benchmarks/DomainChart';
import { MetricsTable } from '@/components/benchmarks/MetricsTable';
import { SampleExplorer } from '@/components/benchmarks/SampleExplorer';
import { BarChart3, Database, Sparkles, FileText, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'FieldBench Benchmark Analytics | Lexsi Labs Tiny-Aya Evaluation',
  description: 'Empirical evaluation of CohereLabs/tiny-aya-global across Base, SFT v2, and DPO-aligned adapters on schema-conditioned JSON extraction.',
};

export default async function BenchmarksPage() {
  const data = await loadBenchmarkData();

  const { overall, by_domain, samples } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-emerald-500" />
            <span>FieldBench Evaluation & Alignment Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
            Empirical benchmark comparing <span className="font-semibold text-slate-800 dark:text-slate-200">Base</span>, <span className="font-semibold text-blue-500">SFT v2</span>, and <span className="font-semibold text-emerald-500">DPO</span> adapters on schema validity, hallucinations, and exact match accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://huggingface.co/monson2002/tiny-aya-sft-v2-dpo-adapter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <span>Hugging Face Hub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Row 1: KPI Summary Cards */}
      <KPISummary base={overall.base} sftv2={overall.sftv2} dpo={overall.dpo} />

      {/* Row 2: Charts 1 & 2 (Bar Chart & Radar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MetricsBarChart base={overall.base} sftv2={overall.sftv2} dpo={overall.dpo} />
        </div>
        <div className="lg:col-span-5">
          <RadarChart base={overall.base} sftv2={overall.sftv2} dpo={overall.dpo} />
        </div>
      </div>

      {/* Row 3: Domain Breakdown Chart */}
      <DomainChart byDomain={by_domain} />

      {/* Row 4: Summary Table */}
      <MetricsTable base={overall.base} sftv2={overall.sftv2} dpo={overall.dpo} />

      {/* Row 5: Sample-Level Inspector */}
      <SampleExplorer samples={samples} />
    </div>
  );
}
