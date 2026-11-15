'use client';

import React from 'react';
import { ModelKey } from '@/types/benchmark';
import { Sparkles, Layers, ShieldCheck, Scale } from 'lucide-react';

interface ModelSelectorProps {
  selected: ModelKey | 'all';
  onChange: (model: ModelKey | 'all') => void;
}

export function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  const options: { id: ModelKey | 'all'; label: string; sub: string; icon: any; color: string }[] = [
    {
      id: 'all',
      label: 'Compare All 3 Side-by-Side',
      sub: 'Base vs SFT v2 vs DPO',
      icon: Scale,
      color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'dpo',
      label: 'DPO Aligned',
      sub: 'tiny-aya-sft-v2-dpo',
      icon: ShieldCheck,
      color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    },
    {
      id: 'sftv2',
      label: 'SFT v2',
      sub: 'tiny-aya-sft-v2',
      icon: Layers,
      color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    },
    {
      id: 'base',
      label: 'Base',
      sub: 'tiny-aya-global 3.35B',
      icon: Sparkles,
      color: 'border-slate-500/40 text-slate-700 dark:text-slate-300 bg-slate-500/10',
    },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        Inference Model Selection
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col gap-1 ${
                isSelected
                  ? `${opt.color} ring-1 ring-current font-medium shadow-xs`
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{opt.label}</span>
              </div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 truncate">
                {opt.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
