'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ModelMetrics } from '@/types/benchmark';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface MetricsBarChartProps {
  base: ModelMetrics;
  sftv2: ModelMetrics;
  dpo: ModelMetrics;
}

export function MetricsBarChart({ base, sftv2, dpo }: MetricsBarChartProps) {
  const data = [
    { metric: 'parse_ok', label: 'Parse OK', base: base.parse_ok, sftv2: sftv2.parse_ok, dpo: dpo.parse_ok },
    { metric: 'schema_valid', label: 'Schema Valid', base: base.schema_valid, sftv2: sftv2.schema_valid, dpo: dpo.schema_valid },
    { metric: 'field_f1', label: 'Field F1', base: base.field_f1, sftv2: sftv2.field_f1, dpo: dpo.field_f1 },
    { metric: 'doc_exact', label: 'Doc Exact', base: base.doc_exact, sftv2: sftv2.doc_exact, dpo: dpo.doc_exact },
    { metric: 'null_acc', label: 'Null Acc', base: base.null_acc, sftv2: sftv2.null_acc, dpo: dpo.null_acc },
    { metric: 'hallucination_rate', label: 'Hallucination', base: base.hallucination_rate, sftv2: sftv2.hallucination_rate, dpo: dpo.hallucination_rate },
    { metric: 'hallucination_rate_adj', label: 'Halluc. (Adj)', base: base.hallucination_rate_adj, sftv2: sftv2.hallucination_rate_adj, dpo: dpo.hallucination_rate_adj },
  ];

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Overall 7-Metric Benchmark Comparison
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Performance (%) across 50–100 FieldBench test documents
          </p>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
              formatter={(val: any) => [`${val}%`]}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  base: 'Base (Tiny-Aya 3.35B)',
                  sftv2: 'SFT v2 Adapter',
                  dpo: 'DPO Aligned Adapter',
                };
                return labels[value] || value;
              }}
            />
            <Bar dataKey="base" fill="#64748b" radius={[4, 4, 0, 0]} name="base" />
            <Bar dataKey="sftv2" fill="#3b82f6" radius={[4, 4, 0, 0]} name="sftv2" />
            <Bar dataKey="dpo" fill="#10b981" radius={[4, 4, 0, 0]} name="dpo" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
