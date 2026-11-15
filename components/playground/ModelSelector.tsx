'use client';

import React from 'react';
import { ModelKey } from '@/types/benchmark';

interface ModelSelectorProps {
  selected: ModelKey | 'all';
  onChange: (model: ModelKey | 'all') => void;
}

export function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  const options: { id: ModelKey | 'all'; label: string; tag: string; borderAccent: string }[] = [
    {
      id: 'all',
      label: 'Compare All 3',
      tag: 'Side-by-Side',
      borderAccent: 'border-l-2 border-zinc-950',
    },
    {
      id: 'dpo',
      label: 'DPO',
      tag: 'dpo-adapter',
      borderAccent: 'border-l-2 border-[#059669]',
    },
    {
      id: 'sftv2',
      label: 'SFT v2',
      tag: 'sft-v2-adapter',
      borderAccent: 'border-l-2 border-[#2563EB]',
    },
    {
      id: 'base',
      label: 'Base',
      tag: 'tiny-aya-3.35b',
      borderAccent: 'border-l-2 border-[#71717A]',
    },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
        Inference Target
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-2 rounded-md border text-left transition-colors flex flex-col ${opt.borderAccent} ${
                isSelected
                  ? 'bg-zinc-100 border-zinc-300 font-medium'
                  : 'bg-white border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <span className="text-xs font-semibold text-zinc-950">
                {opt.label}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 truncate">
                {opt.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
