'use client';

import React, { useState } from 'react';
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

interface DomainChartProps {
  byDomain: Record<string, {
    base: ModelMetrics;
    sftv2: ModelMetrics;
    dpo: ModelMetrics;
  }>;
}

export function DomainChart({ byDomain }: DomainChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<keyof ModelMetrics>('doc_exact');

  const metricPills: { id: keyof ModelMetrics; label: string }[] = [
    { id: 'doc_exact', label: 'doc_exact' },
    { id: 'field_f1', label: 'field_f1' },
    { id: 'schema_valid', label: 'schema_valid' },
    { id: 'hallucination_rate_adj', label: 'halluc_adj' },
    { id: 'null_acc', label: 'null_acc' },
  ];

  const chartData = Object.keys(byDomain).map((domain) => {
    const entry = byDomain[domain];
    return {
      domain,
      Base: entry.base[selectedMetric] ?? 0,
      'SFT v2': entry.sftv2[selectedMetric] ?? 0,
      DPO: entry.dpo[selectedMetric] ?? 0,
    };
  });

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
          Per-Domain Breakdown · fieldbench/corpus
        </h3>

        {/* Metric Pills */}
        <div className="flex items-center gap-1">
          {metricPills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSelectedMetric(pill.id)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                selectedMetric === pill.id
                  ? 'bg-zinc-950 text-white border-zinc-950 font-medium'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E4E4E7" vertical={false} />
            <XAxis
              dataKey="domain"
              stroke="#71717A"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              interval={0}
              angle={-10}
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
