'use client';

import React, { useState, useMemo } from 'react';
import { ModelKey, ModelPrediction } from '@/types/benchmark';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ValidationBadges } from './ValidationBadges';
import { JsonViewer } from './JsonViewer';
import { GoldDiff } from './GoldDiff';
import { tryParseJSON, validateSchema, checkGrounding, nullAccuracy, fieldF1, docExactMatch } from '@/lib/scoring';
import { Sparkles, Layers, ShieldCheck, GitCompare, AlertTriangle } from 'lucide-react';

interface OutputCardProps {
  modelKey: ModelKey;
  prediction?: ModelPrediction | null;
  schema: Record<string, any>;
  sourceDocument: string;
  gold?: Record<string, any>;
  isLoading?: boolean;
}

export function OutputCard({
  modelKey,
  prediction,
  schema,
  sourceDocument,
  gold,
  isLoading = false,
}: OutputCardProps) {
  const [showGoldDiff, setShowGoldDiff] = useState(false);

  const modelInfo = {
    base: {
      name: 'Base Model',
      tag: 'CohereLabs/tiny-aya-global',
      description: 'Vanilla 3.35B Foundation Model',
      badgeVariant: 'slate' as const,
      icon: Sparkles,
      colorBorder: 'border-slate-300 dark:border-slate-700',
    },
    sftv2: {
      name: 'SFT v2 Adapter',
      tag: 'monson2002/tiny-aya-sft-v2-adapter',
      description: 'LoRA Supervised Fine-Tuned',
      badgeVariant: 'cyan' as const,
      icon: Layers,
      colorBorder: 'border-blue-500/30',
    },
    dpo: {
      name: 'DPO Aligned Adapter',
      tag: 'monson2002/tiny-aya-sft-v2-dpo-adapter',
      description: 'Direct Preference Optimization Aligned',
      badgeVariant: 'emerald' as const,
      icon: ShieldCheck,
      colorBorder: 'border-emerald-500/40 ring-1 ring-emerald-500/20',
    },
  }[modelKey];

  const Icon = modelInfo.icon;

  // Real-time audit computed via lib/scoring
  const audit = useMemo(() => {
    if (!prediction) return null;

    const raw = prediction.raw_output || '';
    const parseRes = prediction.parsed_json ? { ok: true, parsed: prediction.parsed_json } : tryParseJSON(raw);
    const parsedData = parseRes.ok ? parseRes.parsed : null;

    const schemaRes = parsedData ? validateSchema(parsedData, schema) : { valid: false, errors: [] };
    const groundingRes = parsedData ? checkGrounding(parsedData, sourceDocument) : { hallucinated_fields: [], hallucination_rate: 0, total_checked: 0, grounded_count: 0 };

    let nullAccVal: number | null = null;
    let fieldF1Val: number | null = null;
    let isDocExact: boolean | null = null;

    if (gold && parsedData) {
      nullAccVal = nullAccuracy(parsedData, gold);
      fieldF1Val = fieldF1(parsedData, gold).f1;
      isDocExact = docExactMatch(parsedData, gold);
    }

    return {
      parseOk: parseRes.ok,
      schemaValid: schemaRes.valid,
      schemaErrors: schemaRes.errors,
      hallucinatedFields: groundingRes.hallucinated_fields,
      hallucinationRate: groundingRes.hallucination_rate,
      nullAcc: nullAccVal,
      fieldF1: fieldF1Val,
      isDocExact,
      parsedData,
      rawOutput: raw,
      latencyMs: prediction.latency_ms,
    };
  }, [prediction, schema, sourceDocument, gold]);

  return (
    <Card className={`flex flex-col overflow-hidden border ${modelInfo.colorBorder} transition-all`}>
      {/* Model Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-slate-200 dark:bg-slate-800">
            <Icon className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                {modelInfo.name}
              </span>
              <Badge variant={modelInfo.badgeVariant} size="sm">
                {modelKey.toUpperCase()}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-mono">
              {modelInfo.tag}
            </p>
          </div>
        </div>

        {gold && prediction && (
          <button
            type="button"
            onClick={() => setShowGoldDiff(!showGoldDiff)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
              showGoldDiff
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Compare vs. Gold</span>
          </button>
        )}
      </div>

      {/* Validation Badges */}
      <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80">
        {audit ? (
          <ValidationBadges
            parseOk={audit.parseOk}
            schemaValid={audit.schemaValid}
            schemaErrors={audit.schemaErrors}
            hallucinatedFields={audit.hallucinatedFields}
            latencyMs={audit.latencyMs}
            nullAcc={audit.nullAcc}
            fieldF1={audit.fieldF1}
          />
        ) : (
          <div className="text-xs text-slate-700 dark:text-slate-300 italic flex items-center gap-2">
            {isLoading ? 'Running generation on Nvidia T4 backend...' : 'Awaiting inference trigger...'}
          </div>
        )}
      </div>

      {/* Output Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-700 dark:text-slate-300">
            <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-xs font-medium">Extracting schema-conditioned JSON...</p>
          </div>
        ) : showGoldDiff && gold && audit ? (
          <GoldDiff predicted={audit.parsedData} gold={gold} />
        ) : audit ? (
          <JsonViewer data={audit.parsedData} rawText={audit.rawOutput} />
        ) : (
          <div className="py-16 text-center text-xs text-slate-700 dark:text-slate-300 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            Click "Run Extraction" to inspect {modelInfo.name} output
          </div>
        )}
      </div>
    </Card>
  );
}
