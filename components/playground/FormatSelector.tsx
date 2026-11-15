import React from 'react';

interface FormatSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
          Constrained Grammar
        </label>
        <span className="text-[11px] font-mono text-zinc-400">Strict Decoding</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange('json')}
          className={`px-2.5 py-1 rounded text-xs font-mono font-medium border transition-colors ${
            value === 'json'
              ? 'bg-zinc-950 text-white border-zinc-950'
              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          JSON (Strict Schema)
        </button>

        <span className="px-2 py-1 rounded text-xs font-mono text-zinc-400 border border-zinc-200 bg-zinc-50 cursor-not-allowed">
          YAML <span className="text-[10px] text-zinc-400">soon</span>
        </span>

        <span className="px-2 py-1 rounded text-xs font-mono text-zinc-400 border border-zinc-200 bg-zinc-50 cursor-not-allowed">
          XML <span className="text-[10px] text-zinc-400">soon</span>
        </span>
      </div>
    </div>
  );
}
