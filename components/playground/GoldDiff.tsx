'use client';

import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

interface GoldDiffProps {
  predicted: Record<string, any> | null;
  gold: Record<string, any>;
}

export function GoldDiff({ predicted, gold }: GoldDiffProps) {
  if (!predicted) {
    return (
      <div className="text-xs text-rose-400 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
        Model output is not valid JSON. Cannot compare vs gold standard.
      </div>
    );
  }

  const allKeys = Array.from(new Set([...Object.keys(gold), ...Object.keys(predicted)]));

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs">
      <table className="w-full text-left font-mono">
        <thead>
          <tr className="border-b border-slate-800 text-[11px] text-slate-400">
            <th className="p-1.5">Field</th>
            <th className="p-1.5">Gold Benchmark Target</th>
            <th className="p-1.5">Model Extracted</th>
            <th className="p-1.5 text-center">Match</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-850">
          {allKeys.map((key) => {
            const goldVal = gold[key];
            const predVal = predicted[key];

            const goldStr = goldVal === undefined ? '<missing>' : JSON.stringify(goldVal);
            const predStr = predVal === undefined ? '<missing>' : JSON.stringify(predVal);

            const isMatch = goldStr === predStr;

            return (
              <tr key={key} className={isMatch ? 'bg-emerald-950/20' : 'bg-rose-950/20'}>
                <td className="p-1.5 text-cyan-400 font-medium">{key}</td>
                <td className="p-1.5 text-slate-300 max-w-[200px] truncate" title={goldStr}>
                  {goldStr}
                </td>
                <td className="p-1.5 text-slate-300 max-w-[200px] truncate" title={predStr}>
                  {predStr}
                </td>
                <td className="p-1.5 text-center">
                  {isMatch ? (
                    <span className="inline-flex items-center text-emerald-400 text-[10px] font-semibold gap-1">
                      <Check className="h-3 w-3" /> Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-rose-400 text-[10px] font-semibold gap-1">
                      <X className="h-3 w-3" /> Diff
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
