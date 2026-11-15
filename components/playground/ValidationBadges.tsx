'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, XCircle, AlertTriangle, Clock, ShieldAlert, Info } from 'lucide-react';
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
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const hasHallucinations = hallucinatedFields.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {/* parse_ok */}
        {parseOk ? (
          <Badge variant="emerald" title="JSON syntax parsed successfully">
            <CheckCircle2 className="h-3 w-3" />
            parse_ok
          </Badge>
        ) : (
          <Badge variant="rose" title="JSON syntax parsing failed">
            <XCircle className="h-3 w-3" />
            parse_fail
          </Badge>
        )}

        {/* schema_valid */}
        {schemaValid ? (
          <Badge variant="emerald" title="Complies with 100% of schema constraints">
            <CheckCircle2 className="h-3 w-3" />
            schema_valid
          </Badge>
        ) : (
          <button
            type="button"
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="focus:outline-none"
          >
            <Badge variant="rose" className="cursor-pointer hover:opacity-90" title="Click to view schema violation errors">
              <XCircle className="h-3 w-3" />
              schema_invalid ({schemaErrors.length})
            </Badge>
          </button>
        )}

        {/* Hallucination Check */}
        {!hasHallucinations ? (
          <Badge variant="emerald" title="All extracted leaf strings are grounded in source document">
            <CheckCircle2 className="h-3 w-3" />
            0 hallucinations
          </Badge>
        ) : (
          <Badge variant="amber" title={`Flagged ${hallucinatedFields.length} ungrounded strings`}>
            <AlertTriangle className="h-3 w-3" />
            {hallucinatedFields.length} hallucinated
          </Badge>
        )}

        {/* Null Abstention (if gold available) */}
        {nullAcc !== undefined && nullAcc !== null && (
          <Badge variant="cyan" title="Abstention accuracy on missing or null schema fields">
            null_acc: {nullAcc}%
          </Badge>
        )}

        {/* Field F1 (if gold available) */}
        {fieldF1 !== undefined && fieldF1 !== null && (
          <Badge variant="purple" title="Field-level F1 precision/recall vs gold">
            f1: {fieldF1}%
          </Badge>
        )}

        {/* Latency */}
        {latencyMs !== undefined && (
          <Badge variant="slate" title="Generation latency">
            <Clock className="h-3 w-3 text-cyan-400" />
            {latencyMs}ms
          </Badge>
        )}
      </div>

      {/* Expandable Schema Errors Tooltip / Alert */}
      {showErrorDetails && schemaErrors.length > 0 && (
        <div className="text-[11px] bg-rose-500/10 border border-rose-500/30 rounded-lg p-2.5 text-rose-300 flex flex-col gap-1 animate-in fade-in duration-200">
          <div className="font-semibold flex items-center gap-1.5 text-rose-400">
            <ShieldAlert className="h-3.5 w-3.5" />
            Schema Validation Violations ({schemaErrors.length}):
          </div>
          <ul className="list-disc pl-4 space-y-0.5">
            {schemaErrors.map((err, idx) => (
              <li key={idx} className="font-mono text-[10px]">
                <span className="text-slate-300">{err.instancePath || 'root'}:</span> {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hallucinated items list if any */}
      {hasHallucinations && (
        <div className="text-[11px] bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-amber-300">
          <span className="font-semibold text-amber-400">Ungrounded text flags:</span>{' '}
          {hallucinatedFields.slice(0, 3).join(', ')}
          {hallucinatedFields.length > 3 && ` +${hallucinatedFields.length - 3} more`}
        </div>
      )}
    </div>
  );
}
