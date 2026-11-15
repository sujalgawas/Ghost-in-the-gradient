'use client';

import React, { useState, useMemo } from 'react';
import { ModelKey, ModelPrediction } from '@/types/benchmark';
import { ValidationBadges } from './ValidationBadges';
import { JsonViewer } from './JsonViewer';
import { GoldDiff } from './GoldDiff';
import { tryParseJSON, validateSchema, checkGrounding, nullAccuracy, fieldF1, docExactMatch } from '@/lib/scoring';
import { Loader2 } from 'lucide-react';

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

  const modelMeta = {
    base: {
      name: 'Base Model',
      slug: 'CohereLabs/tiny-aya-global',
      colorBar: 'bg-[#71717A]',
    },
    sftv2: {
      name: 'SFT v2',
      slug: 'monson2002/tiny-aya-sft-v2-adapter',
      colorBar: 'bg-[#2563EB]',
    },
    dpo: {
      name: 'DPO Aligned',
      slug: 'monson2002/tiny-aya-sft-v2-dpo-adapter',
      colorBar: 'bg-[#059669]',
    },
  }[modelKey];

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
      nullAcc: nullAccVal,
      fieldF1: fieldF1Val,
      isDocExact,
      parsedData,
      rawOutput: raw,
      latencyMs: prediction.latency_ms,
    };
  }, [prediction, schema, sourceDocument, gold]);

  return (
    <div className="flex flex-col h-full bg-white border border-zinc-200 rounded-lg overflow-hidden">
      {/* 2px top color bar denoting model */}
      <div className={`h-1 w-full ${modelMeta.colorBar}`} />

      {/* Header */}
      <div className="p-3 border-b border-zinc-200 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs tracking-tight text-zinc-950">
            {modelMeta.name}
          </span>
          {gold && prediction && (
            <button
              type="button"
              onClick={() => setShowGoldDiff(!showGoldDiff)}
              className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                showGoldDiff
                  ? 'bg-zinc-950 text-white border-zinc-950'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              Diff vs Gold
            </button>
          )}
        </div>
        <div className="font-mono text-[11px] text-zinc-400 truncate" title={modelMeta.slug}>
          {modelMeta.slug}
        </div>

        {/* Inline Metric Strip */}
        <div className="pt-1 border-t border-zinc-100">
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
            <span className="font-mono text-[11px] text-zinc-400">
              {isLoading ? 'Running inference...' : 'Awaiting inference trigger'}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex-1 flex flex-col justify-start">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-700" />
            <span className="font-mono text-xs">Generating constrained JSON...</span>
          </div>
        ) : showGoldDiff && gold && audit ? (
          <GoldDiff predicted={audit.parsedData} gold={gold} />
        ) : audit ? (
          <JsonViewer data={audit.parsedData} rawText={audit.rawOutput} />
        ) : (
          <div className="py-20 text-center font-mono text-xs text-zinc-400 border border-dashed border-zinc-200 rounded-md">
            Click "Run Extraction" to evaluate output
          </div>
        )}
      </div>
    </div>
  );
}
