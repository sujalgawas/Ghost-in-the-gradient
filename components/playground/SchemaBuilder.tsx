'use client';

import React, { useState } from 'react';
import { SchemaBuilderSimple } from './SchemaBuilderSimple';
import { SchemaBuilderRaw } from './SchemaBuilderRaw';

interface SchemaBuilderProps {
  schema: Record<string, any>;
  onSchemaChange: (schema: Record<string, any>) => void;
  onPresetSelect?: (presetId: string, sampleDoc: string) => void;
}

export function SchemaBuilder({ schema, onSchemaChange, onPresetSelect }: SchemaBuilderProps) {
  const [mode, setMode] = useState<'raw' | 'simple'>('raw');

  return (
    <div className="flex flex-col gap-2.5 border-t border-zinc-200 pt-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
          Target JSON Schema
        </label>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded border border-zinc-200 text-xs">
          <button
            type="button"
            onClick={() => setMode('raw')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              mode === 'raw'
                ? 'bg-white font-medium text-zinc-950 border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            JSON Schema
          </button>
          <button
            type="button"
            onClick={() => setMode('simple')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              mode === 'simple'
                ? 'bg-white font-medium text-zinc-950 border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Simple Fields
          </button>
        </div>
      </div>

      <div className={mode === 'simple' ? 'block' : 'hidden'}>
        <SchemaBuilderSimple onSchemaChange={onSchemaChange} initialSchema={schema} />
      </div>
      <div className={mode === 'raw' ? 'block' : 'hidden'}>
        <SchemaBuilderRaw schema={schema} onSchemaChange={onSchemaChange} onPresetSelect={onPresetSelect} />
      </div>
    </div>
  );
}
