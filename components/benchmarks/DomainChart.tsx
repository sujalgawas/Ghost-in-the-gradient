'use client';

import React, { useState } from 'react';
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

interface DomainChartProps {
  byDomain: Record<string, {
    base: ModelMetrics;
    sftv2: ModelMetrics;
    dpo: ModelMetrics;
  }>;
}

export function DomainChart({ byDomain }: DomainChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<keyof ModelMetrics>('doc_exact');

  const metricOptions: { id: keyof ModelMetrics; label: string }[] = [
    { id: 'doc_exact', label: 'Document Exact Match (%)' },
    { id: 'field_f1', label: 'Field-Level F1 (%)' },
    { id: 'schema_valid', label: 'Schema Validity (%)' },
    { id: 'hallucination_rate_adj', label: 'Hallucination Rate (Adj %) [Lower is better]' },
    { id: 'null_acc', label: 'Null Abstention Accuracy (%)' },
  ];

  const chartData = Object.keys(byDomain).map((domain) => {
    const entry = byDomain[domain];
    return {
      domain,
      base: entry.base[selectedMetric] ?? 0,
      sftv2: entry.sftv2[selectedMetric] ?? 0,
      dpo: entry.dpo[selectedMetric] ?? 0,
    };
  });

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Per-Domain Performance Breakdown
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Compare model performance across distinct corpus categories
          </p>
        </div>

        {/* Metric Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Metric:
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as keyof ModelMetrics)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {metricOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="domain"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-10}
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
                  base: 'Base',
                  sftv2: 'SFT v2',
                  dpo: 'DPO Aligned',
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
