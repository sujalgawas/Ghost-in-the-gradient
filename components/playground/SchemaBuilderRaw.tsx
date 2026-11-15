'use client';

import React, { useState, useEffect } from 'react';
import { SCHEMA_PRESETS } from '@/lib/presets';
import { FileCode, AlertCircle, CheckCircle2, Bookmark } from 'lucide-react';

interface SchemaBuilderRawProps {
  schema: Record<string, any>;
  onSchemaChange: (schema: Record<string, any>) => void;
  onPresetSelect?: (presetId: string, sampleDoc: string) => void;
}

export function SchemaBuilderRaw({ schema, onSchemaChange, onPresetSelect }: SchemaBuilderRawProps) {
  const [rawText, setRawText] = useState(() => JSON.stringify(schema, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const currentParsed = JSON.parse(rawText);
      if (JSON.stringify(currentParsed) !== JSON.stringify(schema)) {
        setRawText(JSON.stringify(schema, null, 2));
        setParseError(null);
      }
    } catch {
      setRawText(JSON.stringify(schema, null, 2));
    }
  }, [schema]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);

    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === 'object' && parsed !== null) {
        setParseError(null);
        onSchemaChange(parsed);
      } else {
        setParseError('Schema must be a valid JSON object');
      }
    } catch (err: any) {
      setParseError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = SCHEMA_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setRawText(JSON.stringify(preset.schema, null, 2));
      setParseError(null);
      onSchemaChange(preset.schema);
      if (onPresetSelect) {
        onPresetSelect(preset.id, preset.sampleDocument);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* 4 One-Click Presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mr-1">
          <Bookmark className="h-3 w-3 text-cyan-400" />
          Presets:
        </span>
        {SCHEMA_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleApplyPreset(preset.id)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 transition-all font-medium"
            title={`${preset.description} (Clicks to load schema & document)`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Editor & Syntax status */}
      <div className="relative">
        <textarea
          value={rawText}
          onChange={handleTextChange}
          rows={10}
          className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-lg border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-emerald-500 selection:bg-emerald-500/30"
          placeholder='{\n  "type": "object",\n  "properties": {}\n}'
          spellCheck={false}
        />

        <div className="flex items-center justify-between text-[11px] mt-1 px-1">
          {parseError ? (
            <span className="text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {parseError}
            </span>
          ) : (
            <span className="text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Valid JSON Schema syntax
            </span>
          )}
          <span className="text-slate-700 dark:text-slate-300">Strict Schema Constrained Decoding</span>
        </div>
      </div>
    </div>
  );
}
