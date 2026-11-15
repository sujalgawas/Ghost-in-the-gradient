'use client';

import React from 'react';
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
    { metric: 'parse_ok', label: 'parse_ok', Base: base.parse_ok, 'SFT v2': sftv2.parse_ok, DPO: dpo.parse_ok },
    { metric: 'schema_valid', label: 'schema_valid', Base: base.schema_valid, 'SFT v2': sftv2.schema_valid, DPO: dpo.schema_valid },
    { metric: 'field_f1', label: 'field_f1', Base: base.field_f1, 'SFT v2': sftv2.field_f1, DPO: dpo.field_f1 },
    { metric: 'doc_exact', label: 'doc_exact', Base: base.doc_exact, 'SFT v2': sftv2.doc_exact, DPO: dpo.doc_exact },
    { metric: 'null_acc', label: 'null_acc', Base: base.null_acc, 'SFT v2': sftv2.null_acc, DPO: dpo.null_acc },
    { metric: 'halluc_rate', label: 'halluc_rate', Base: base.hallucination_rate, 'SFT v2': sftv2.hallucination_rate, DPO: dpo.hallucination_rate },
    { metric: 'halluc_adj', label: 'halluc_adj', Base: base.hallucination_rate_adj, 'SFT v2': sftv2.hallucination_rate_adj, DPO: dpo.hallucination_rate_adj },
  ];

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
          7-Metric Capability Profile
        </h3>
        <span className="text-[11px] font-mono text-zinc-400">
          Normalized (%)
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E4E4E7" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#71717A"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="#71717A"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E4E4E7',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                boxShadow: 'none',
              }}
              formatter={(val: any) => [`${val}%`]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', paddingTop: '8px' }}
            />
            <Bar dataKey="Base" fill="#71717A" radius={[2, 2, 0, 0]} />
            <Bar dataKey="SFT v2" fill="#2563EB" radius={[2, 2, 0, 0]} />
            <Bar dataKey="DPO" fill="#059669" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
