import React from 'react';
import { ModelMetrics } from '@/types/benchmark';

interface KPISummaryProps {
  base: ModelMetrics;
  sftv2: ModelMetrics;
  dpo: ModelMetrics;
}

export function KPISummary({ base, sftv2, dpo }: KPISummaryProps) {
  const cards = [
    {
      title: 'Doc Exact Match',
      baseVal: base.doc_exact,
      sftVal: sftv2.doc_exact,
      dpoVal: dpo.doc_exact,
      bestVal: Math.max(base.doc_exact, sftv2.doc_exact, dpo.doc_exact),
      deltaVsBase: `+${(sftv2.doc_exact - base.doc_exact).toFixed(1)}%`,
      isHigherBetter: true,
      description: 'Zero errors across entire schema',
    },
    {
      title: 'Schema Validity (Strict)',
      baseVal: base.schema_valid,
      sftVal: sftv2.schema_valid,
      dpoVal: dpo.schema_valid,
      bestVal: Math.max(base.schema_valid, sftv2.schema_valid, dpo.schema_valid),
      deltaVsBase: `+${(sftv2.schema_valid - base.schema_valid).toFixed(1)}%`,
      isHigherBetter: true,
      description: 'Zero Ajv constraint violations',
    },
    {
      title: 'Field-Level F1',
      baseVal: base.field_f1,
      sftVal: sftv2.field_f1,
      dpoVal: dpo.field_f1,
      bestVal: Math.max(base.field_f1, sftv2.field_f1, dpo.field_f1),
      deltaVsBase: `+${(sftv2.field_f1 - base.field_f1).toFixed(1)}%`,
      isHigherBetter: true,
      description: 'Precision & recall harmonic mean',
    },
    {
      title: 'Hallucination Rate (Adj)',
      baseVal: base.hallucination_rate_adj,
      sftVal: sftv2.hallucination_rate_adj,
      dpoVal: dpo.hallucination_rate_adj,
      bestVal: Math.min(base.hallucination_rate_adj, sftv2.hallucination_rate_adj, dpo.hallucination_rate_adj),
      deltaVsBase: `-${(base.hallucination_rate_adj - sftv2.hallucination_rate_adj).toFixed(1)}%`,
      isHigherBetter: false,
      description: 'Ungrounded leaf string tokens',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        return (
          <div
            key={card.title}
            className="border border-zinc-200 bg-white p-4 rounded-lg flex flex-col justify-between gap-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                {card.title}
              </span>
              <span className="text-[11px] font-mono text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                {card.deltaVsBase}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums tracking-tight text-zinc-950">
                {card.bestVal.toFixed(1)}%
              </span>
              <span className="text-xs font-mono text-zinc-400">
                peak ({card.isHigherBetter ? 'higher' : 'lower'} is better)
              </span>
            </div>

            <div className="border-t border-zinc-100 pt-2 flex items-center justify-between font-mono text-[11px] text-zinc-500 tabular-nums">
              <span>Base: {card.baseVal.toFixed(1)}%</span>
              <span className="text-zinc-300">→</span>
              <span className="text-blue-700 font-medium">SFT v2: {card.sftVal.toFixed(1)}%</span>
              <span className="text-zinc-300">→</span>
              <span className="text-emerald-700 font-medium">DPO: {card.dpoVal.toFixed(1)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
