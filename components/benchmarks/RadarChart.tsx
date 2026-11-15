'use client';

import React from 'react';
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
    { subject: 'parse_ok', Base: base.parse_ok, 'SFT v2': sftv2.parse_ok, DPO: dpo.parse_ok, fullMark: 100 },
    { subject: 'schema_valid', Base: base.schema_valid, 'SFT v2': sftv2.schema_valid, DPO: dpo.schema_valid, fullMark: 100 },
    { subject: 'field_f1', Base: base.field_f1, 'SFT v2': sftv2.field_f1, DPO: dpo.field_f1, fullMark: 100 },
    { subject: 'doc_exact', Base: base.doc_exact, 'SFT v2': sftv2.doc_exact, DPO: dpo.doc_exact, fullMark: 100 },
    { subject: 'null_acc', Base: base.null_acc, 'SFT v2': sftv2.null_acc, DPO: dpo.null_acc, fullMark: 100 },
  ];

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
          Geometric Alignment Radar
        </h3>
        <span className="text-[11px] font-mono text-zinc-400">
          5 Core Dimensions
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#E4E4E7" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="#71717A"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#A1A1AA"
              fontSize={10}
              fontFamily="JetBrains Mono, monospace"
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
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', paddingTop: '4px' }}
            />
            <Radar
              name="Base"
              dataKey="Base"
              stroke="#71717A"
              fill="#71717A"
              fillOpacity={0.15}
            />
            <Radar
              name="SFT v2"
              dataKey="SFT v2"
              stroke="#2563EB"
              fill="#2563EB"
              fillOpacity={0.2}
            />
            <Radar
              name="DPO"
              dataKey="DPO"
              stroke="#059669"
              fill="#059669"
              fillOpacity={0.2}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
