'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ModelMetrics } from '@/types/benchmark';
import {
  ResponsiveContainer,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';

interface RadarChartProps {
  base: ModelMetrics;
  sftv2: ModelMetrics;
  dpo: ModelMetrics;
}

export function RadarChart({ base, sftv2, dpo }: RadarChartProps) {
  const radarData = [
    { subject: 'Parse OK', base: base.parse_ok, sftv2: sftv2.parse_ok, dpo: dpo.parse_ok, fullMark: 100 },
    { subject: 'Schema Valid', base: base.schema_valid, sftv2: sftv2.schema_valid, dpo: dpo.schema_valid, fullMark: 100 },
    { subject: 'Field F1', base: base.field_f1, sftv2: sftv2.field_f1, dpo: dpo.field_f1, fullMark: 100 },
    { subject: 'Doc Exact', base: base.doc_exact, sftv2: sftv2.doc_exact, dpo: dpo.doc_exact, fullMark: 100 },
    { subject: 'Null Abstention', base: base.null_acc, sftv2: sftv2.null_acc, dpo: dpo.null_acc, fullMark: 100 },
  ];

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Multi-Axis Capability Radar
        </h3>
        <p className="text-xs text-slate-700 dark:text-slate-300">
          Geometric coverage of extraction accuracy, compliance & abstention
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="#334155" opacity={0.3} />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
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
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  base: 'Base',
                  sftv2: 'SFT v2',
                  dpo: 'DPO Aligned',
                };
                return labels[value] || value;
              }}
            />
            <Radar
              name="base"
              dataKey="base"
              stroke="#64748b"
              fill="#64748b"
              fillOpacity={0.2}
            />
            <Radar
              name="sftv2"
              dataKey="sftv2"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
            <Radar
              name="dpo"
              dataKey="dpo"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.4}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
