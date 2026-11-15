'use client';

import React, { useState } from 'react';
import { SchemaBuilderSimple } from './SchemaBuilderSimple';
import { SchemaBuilderRaw } from './SchemaBuilderRaw';
import { Code2, SlidersHorizontal } from 'lucide-react';

interface SchemaBuilderProps {
  schema: Record<string, any>;
  onSchemaChange: (schema: Record<string, any>) => void;
  onPresetSelect?: (presetId: string, sampleDoc: string) => void;
}

export function SchemaBuilder({ schema, onSchemaChange, onPresetSelect }: SchemaBuilderProps) {
  const [mode, setMode] = useState<'simple' | 'raw'>('raw');

  return (
    <div className="flex flex-col gap-3 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900/60 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-emerald-500" />
          Target JSON Schema
        </label>

        {/* Toggle between Simple Builder & Raw Editor */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMode('simple')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              mode === 'simple'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="h-3 w-3" />
            Simple Builder
          </button>
          <button
            type="button"
            onClick={() => setMode('raw')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              mode === 'raw'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="h-3 w-3" />
            Raw Schema Editor
          </button>
        </div>
      </div>

      {mode === 'simple' ? (
        <SchemaBuilderSimple onSchemaChange={onSchemaChange} initialSchema={schema} />
      ) : (
        <SchemaBuilderRaw schema={schema} onSchemaChange={onSchemaChange} onPresetSelect={onPresetSelect} />
      )}
    </div>
  );
}
