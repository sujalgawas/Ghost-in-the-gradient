'use client';

import React, { useState } from 'react';
import { ValidationErrorItem } from '@/lib/scoring';

interface ValidationBadgesProps {
  parseOk: boolean;
  schemaValid: boolean;
  schemaErrors?: ValidationErrorItem[];
  hallucinatedFields?: string[];
  latencyMs?: number;
  nullAcc?: number | null;
  fieldF1?: number | null;
}

export function ValidationBadges({
  parseOk,
  schemaValid,
  schemaErrors = [],
  hallucinatedFields = [],
  latencyMs,
  nullAcc,
  fieldF1,
}: ValidationBadgesProps) {
  const [showErrors, setShowErrors] = useState(false);
  const hasHallucinations = hallucinatedFields.length > 0;

  return (
    <div className="flex flex-col gap-1.5 font-mono text-[11px]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-600">
        {/* parse_ok */}
        {parseOk ? (
          <span className="text-green-700 font-medium">parse_ok ✓</span>
        ) : (
          <span className="text-red-600 font-medium">parse_fail ✗</span>
        )}

        {/* schema_valid */}
        {schemaValid ? (
          <span className="text-green-700 font-medium">schema_valid ✓</span>
        ) : (
          <button
            type="button"
            onClick={() => setShowErrors(!showErrors)}
            className="text-red-600 font-medium underline underline-offset-2 hover:text-red-700"
          >
            schema_invalid ({schemaErrors.length}) ✗
          </button>
        )}

        {/* Hallucinations */}
        {!hasHallucinations ? (
          <span className="text-zinc-600">0 halluc</span>
        ) : (
          <span className="text-red-600 font-medium">
            {hallucinatedFields.length} halluc
          </span>
        )}

        {/* Null acc */}
        {nullAcc !== undefined && nullAcc !== null && (
          <span className="text-zinc-500 tabular-nums">null_acc: {nullAcc}%</span>
        )}

        {/* F1 */}
        {fieldF1 !== undefined && fieldF1 !== null && (
          <span className="text-zinc-700 font-medium tabular-nums">f1: {fieldF1}%</span>
        )}

        {/* Latency */}
        {latencyMs !== undefined && (
          <span className="text-zinc-400 tabular-nums ml-auto">{latencyMs}ms</span>
        )}
      </div>

      {/* Schema Errors Detail */}
      {showErrors && schemaErrors.length > 0 && (
        <div className="mt-1 p-2 rounded bg-red-50/70 border border-red-200 text-red-800 text-[10px] space-y-0.5">
          <div className="font-semibold">Schema Errors:</div>
          {schemaErrors.map((err, idx) => (
            <div key={idx} className="truncate">
              {err.instancePath || '/'}: {err.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
