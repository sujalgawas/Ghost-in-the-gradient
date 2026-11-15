'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ModelMetrics } from '@/types/benchmark';
import { Badge } from '@/components/ui/Badge';

interface MetricsTableProps {
  base: ModelMetrics;
  sftv2: ModelMetrics;
  dpo: ModelMetrics;
}

export function MetricsTable({ base, sftv2, dpo }: MetricsTableProps) {
  const models = [
    {
      key: 'base',
      name: 'CohereLabs/tiny-aya-global (Base 3.35B)',
      tag: 'Base',
      badge: 'slate' as const,
      metrics: base,
    },
    {
      key: 'sftv2',
      name: 'monson2002/tiny-aya-sft-v2-adapter',
      tag: 'SFT v2',
      badge: 'cyan' as const,
      metrics: sftv2,
    },
    {
      key: 'dpo',
      name: 'monson2002/tiny-aya-sft-v2-dpo-adapter',
      tag: 'DPO Aligned',
      badge: 'emerald' as const,
      metrics: dpo,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Exact Summary Benchmark Metrics
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Standardized evaluation results across the full test evaluation split
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <th className="p-3 font-sans font-semibold">Model / Adapter</th>
              <th className="p-3 text-right">parse_ok</th>
              <th className="p-3 text-right">schema_valid</th>
              <th className="p-3 text-right">field_f1</th>
              <th className="p-3 text-right">doc_exact</th>
              <th className="p-3 text-right">null_acc</th>
              <th className="p-3 text-right">halluc_rate</th>
              <th className="p-3 text-right">halluc_adj</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {models.map((m) => (
              <tr key={m.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-3 font-sans">
                  <div className="flex items-center gap-2">
                    <Badge variant={m.badge} size="sm">
                      {m.tag}
                    </Badge>
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                      {m.name}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                  {m.metrics.parse_ok.toFixed(1)}%
                </td>
                <td className="p-3 text-right font-semibold text-cyan-600 dark:text-cyan-400">
                  {m.metrics.schema_valid.toFixed(1)}%
                </td>
                <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                  {m.metrics.field_f1.toFixed(1)}%
                </td>
                <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  {m.metrics.doc_exact.toFixed(1)}%
                </td>
                <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                  {m.metrics.null_acc.toFixed(1)}%
                </td>
                <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                  {m.metrics.hallucination_rate.toFixed(1)}%
                </td>
                <td className="p-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                  {m.metrics.hallucination_rate_adj.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
