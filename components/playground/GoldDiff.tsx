'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface GoldDiffProps {
  predicted: Record<string, any> | null;
  gold: Record<string, any>;
}

export function GoldDiff({ predicted, gold }: GoldDiffProps) {
  if (!predicted) {
    return (
      <div className="text-xs font-mono text-red-600 p-2.5 bg-red-50 border border-red-200 rounded-md">
        Model output is not valid JSON. Cannot compare vs gold benchmark.
      </div>
    );
  }

  const allKeys = Array.from(new Set([...Object.keys(gold), ...Object.keys(predicted)]));

  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white text-xs">
      <table className="w-full text-left font-mono">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] text-zinc-500 uppercase tracking-wider">
            <th className="py-2 px-2.5">Field</th>
            <th className="py-2 px-2">Gold Target</th>
            <th className="py-2 px-2">Model Extracted</th>
            <th className="py-2 px-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 text-xs">
          {allKeys.map((key) => {
            const goldVal = gold[key];
            const predVal = predicted[key];

            const goldStr = goldVal === undefined ? '<missing>' : JSON.stringify(goldVal);
            const predStr = predVal === undefined ? '<missing>' : JSON.stringify(predVal);

            const isMatch = goldStr === predStr;

            return (
              <tr key={key} className={isMatch ? 'bg-green-50/40' : 'bg-red-50/40'}>
                <td className="py-1.5 px-2.5 font-medium text-zinc-900">{key}</td>
                <td className="py-1.5 px-2 text-zinc-600 max-w-[160px] truncate" title={goldStr}>
                  {goldStr}
                </td>
                <td className="py-1.5 px-2 text-zinc-800 max-w-[160px] truncate" title={predStr}>
                  {predStr}
                </td>
                <td className="py-1.5 px-2 text-center">
                  {isMatch ? (
                    <span className="inline-flex items-center text-green-700 text-[11px] font-medium gap-0.5">
                      <Check className="h-3 w-3" /> Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600 text-[11px] font-medium gap-0.5">
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
