import React from 'react';
import { Card } from '@/components/ui/Card';
import { ModelMetrics } from '@/types/benchmark';
import { TrendingUp, CheckCircle, ShieldAlert, Target, Award } from 'lucide-react';

interface KPISummaryProps {
  base: ModelMetrics;
  sftv2: ModelMetrics;
  dpo: ModelMetrics;
}

export function KPISummary({ base, sftv2, dpo }: KPISummaryProps) {
  const cards = [
    {
      title: 'Document Exact Match',
      metricKey: 'doc_exact',
      baseVal: base.doc_exact,
      sftVal: sftv2.doc_exact,
      dpoVal: dpo.doc_exact,
      deltaVsBase: `+${(dpo.doc_exact - base.doc_exact).toFixed(1)}%`,
      deltaVsSft: `+${(dpo.doc_exact - sftv2.doc_exact).toFixed(1)}%`,
      isHigherBetter: true,
      description: 'Zero errors across all schema fields simultaneously',
      icon: Target,
      accentColor: 'text-emerald-500',
    },
    {
      title: 'Schema Validity (Strict)',
      metricKey: 'schema_valid',
      baseVal: base.schema_valid,
      sftVal: sftv2.schema_valid,
      dpoVal: dpo.schema_valid,
      deltaVsBase: `+${(dpo.schema_valid - base.schema_valid).toFixed(1)}%`,
      deltaVsSft: `+${(dpo.schema_valid - sftv2.schema_valid).toFixed(1)}%`,
      isHigherBetter: true,
      description: 'Zero Ajv schema constraint violations',
      icon: CheckCircle,
      accentColor: 'text-cyan-500',
    },
    {
      title: 'Field-Level F1 Score',
      metricKey: 'field_f1',
      baseVal: base.field_f1,
      sftVal: sftv2.field_f1,
      dpoVal: dpo.field_f1,
      deltaVsBase: `+${(dpo.field_f1 - base.field_f1).toFixed(1)}%`,
      deltaVsSft: `+${(dpo.field_f1 - sftv2.field_f1).toFixed(1)}%`,
      isHigherBetter: true,
      description: 'Harmonic mean of key-value precision and recall',
      icon: Award,
      accentColor: 'text-blue-500',
    },
    {
      title: 'Hallucination Rate (Adj)',
      metricKey: 'hallucination_rate_adj',
      baseVal: base.hallucination_rate_adj,
      sftVal: sftv2.hallucination_rate_adj,
      dpoVal: dpo.hallucination_rate_adj,
      deltaVsBase: `-${(base.hallucination_rate_adj - dpo.hallucination_rate_adj).toFixed(1)}%`,
      deltaVsSft: `-${(sftv2.hallucination_rate_adj - dpo.hallucination_rate_adj).toFixed(1)}%`,
      isHigherBetter: false,
      description: 'Leaf tokens not grounded in source text (lower is better)',
      icon: ShieldAlert,
      accentColor: 'text-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="p-4 flex flex-col justify-between gap-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {card.title}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Icon className={`h-4 w-4 ${card.accentColor}`} />
              </div>
            </div>

            {/* Main DPO Value */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {card.dpoVal}%
              </span>
              <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="h-3 w-3 mr-1 inline" />
                {card.deltaVsBase} vs Base
              </span>
            </div>

            {/* Progression comparison row */}
            <div className="text-[11px] border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between text-slate-700 dark:text-slate-300 font-mono">
              <span>Base: <strong className="text-slate-700 dark:text-slate-300">{card.baseVal}%</strong></span>
              <span>→</span>
              <span>SFT v2: <strong className="text-blue-500">{card.sftVal}%</strong></span>
              <span>→</span>
              <span>DPO: <strong className="text-emerald-500">{card.dpoVal}%</strong></span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
