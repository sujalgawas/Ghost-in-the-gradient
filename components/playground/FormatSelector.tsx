import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { FileCode, FileText } from 'lucide-react';

interface FormatSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <FileCode className="h-3.5 w-3.5 text-cyan-500" />
          Output Format
        </span>
        <span className="text-[11px] font-normal text-slate-700 dark:text-slate-300">Constrained Grammar</span>
      </label>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange('json')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            value === 'json'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          JSON (Strict Schema)
        </button>

        <div className="flex items-center gap-1.5 opacity-60 cursor-not-allowed">
          <button
            type="button"
            disabled
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-1.5"
          >
            <span>YAML</span>
            <Badge variant="slate" size="sm" className="text-[10px] py-0 px-1">
              Soon
            </Badge>
          </button>

          <button
            type="button"
            disabled
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-1.5"
          >
            <span>XML</span>
            <Badge variant="slate" size="sm" className="text-[10px] py-0 px-1">
              Soon
            </Badge>
          </button>
        </div>
      </div>
    </div>
  );
}
