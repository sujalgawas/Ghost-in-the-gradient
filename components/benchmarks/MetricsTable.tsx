'use client';

import React from 'react';
import { ModelMetrics } from '@/types/benchmark';

interface MetricsTableProps {
  base: ModelMetrics;
  sftv2: ModelMetrics;
  dpo: ModelMetrics;
}

export function MetricsTable({ base, sftv2, dpo }: MetricsTableProps) {
  const rows = [
    {
      key: 'base',
      system: 'base',
      name: 'CohereLabs/tiny-aya-global',
      label: 'Base (3.35B)',
      dotColor: 'bg-[#71717A]',
      metrics: base,
    },
    {
      key: 'sftv2',
      system: 'sftv2',
      name: 'monson2002/tiny-aya-sft-v2-adapter',
      label: 'SFT v2 Adapter',
      dotColor: 'bg-[#2563EB]',
      metrics: sftv2,
    },
    {
      key: 'dpo',
      system: 'dpo',
      name: 'monson2002/tiny-aya-sft-v2-dpo-adapter',
      label: 'DPO Aligned Adapter',
      dotColor: 'bg-[#059669]',
      metrics: dpo,
    },
  ];

  // Compute best values for bolding
  const maxParseOk = Math.max(base.parse_ok, sftv2.parse_ok, dpo.parse_ok);
  const maxSchemaValid = Math.max(base.schema_valid, sftv2.schema_valid, dpo.schema_valid);
  const maxFieldF1 = Math.max(base.field_f1, sftv2.field_f1, dpo.field_f1);
  const maxDocExact = Math.max(base.doc_exact, sftv2.doc_exact, dpo.doc_exact);
  const maxNullAcc = Math.max(base.null_acc, sftv2.null_acc, dpo.null_acc);
  const minHalluc = Math.min(base.hallucination_rate, sftv2.hallucination_rate, dpo.hallucination_rate);
  const minHallucAdj = Math.min(base.hallucination_rate_adj, sftv2.hallucination_rate_adj, dpo.hallucination_rate_adj);

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg p-4">
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Standardized Evaluation Results · fieldbench/corpus
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Evaluated on test split across 80 document samples in 5 domains
          </p>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Bold = Top Performance
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-y border-zinc-200">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3 font-semibold">System / Adapter</th>
              <th className="py-2.5 px-3 text-right font-semibold">parse_ok</th>
              <th className="py-2.5 px-3 text-right font-semibold">schema_valid</th>
              <th className="py-2.5 px-3 text-right font-semibold">field_f1</th>
              <th className="py-2.5 px-3 text-right font-semibold">doc_exact</th>
              <th className="py-2.5 px-3 text-right font-semibold">null_acc</th>
              <th className="py-2.5 px-3 text-right font-semibold">halluc_rate</th>
              <th className="py-2.5 px-3 text-right font-semibold">halluc_adj</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 tabular-nums">
            {rows.map((row) => {
              const m = row.metrics;
              return (
                <tr key={row.key} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${row.dotColor}`} />
                      <span className="font-semibold text-zinc-950 font-sans">
                        {row.label}
                      </span>
                      <span className="text-[11px] text-zinc-400 hidden sm:inline">
                        ({row.name})
                      </span>
                    </div>
                  </td>

                  <td className={`py-2.5 px-3 text-right ${m.parse_ok === maxParseOk ? 'font-bold text-zinc-950' : 'text-zinc-600'}`}>
                    {m.parse_ok.toFixed(1)}%
                  </td>

                  <td className={`py-2.5 px-3 text-right ${m.schema_valid === maxSchemaValid ? 'font-bold text-zinc-950' : 'text-zinc-600'}`}>
                    {m.schema_valid.toFixed(1)}%
                  </td>

                  <td className={`py-2.5 px-3 text-right ${m.field_f1 === maxFieldF1 ? 'font-bold text-zinc-950' : 'text-zinc-600'}`}>
                    {m.field_f1.toFixed(1)}%
                  </td>

                  <td className={`py-2.5 px-3 text-right ${m.doc_exact === maxDocExact ? 'font-bold text-zinc-950' : 'text-zinc-600'}`}>
                    {m.doc_exact.toFixed(1)}%
                  </td>

                  <td className={`py-2.5 px-3 text-right ${m.null_acc === maxNullAcc ? 'font-bold text-zinc-950' : 'text-zinc-600'}`}>
                    {m.null_acc.toFixed(1)}%
                  </td>

                  <td className={`py-2.5 px-3 text-right ${m.hallucination_rate === minHalluc ? 'font-bold text-zinc-950' : 'text-zinc-600'}`}>
                    {m.hallucination_rate.toFixed(1)}%
                  </td>

                  <td className={`py-2.5 px-3 text-right ${m.hallucination_rate_adj === minHallucAdj ? 'font-bold text-zinc-950' : 'text-zinc-600'}`}>
                    {m.hallucination_rate_adj.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
