'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SCHEMA_PRESETS } from '@/lib/presets';

interface SchemaBuilderRawProps {
  schema: Record<string, any>;
  onSchemaChange: (schema: Record<string, any>) => void;
  onPresetSelect?: (presetId: string, sampleDoc: string) => void;
}

export function SchemaBuilderRaw({ schema, onSchemaChange, onPresetSelect }: SchemaBuilderRawProps) {
  const [rawText, setRawText] = useState(() => JSON.stringify(schema, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const lastEmittedJsonRef = useRef<string>(JSON.stringify(schema));

  useEffect(() => {
    const incomingJson = JSON.stringify(schema);
    if (incomingJson !== lastEmittedJsonRef.current) {
      lastEmittedJsonRef.current = incomingJson;
      setRawText(JSON.stringify(schema, null, 2));
      setParseError(null);
    }
  }, [schema]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);

    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === 'object' && parsed !== null) {
        setParseError(null);
        lastEmittedJsonRef.current = JSON.stringify(parsed);
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
      const presetJson = JSON.stringify(preset.schema, null, 2);
      setRawText(presetJson);
      setParseError(null);
      lastEmittedJsonRef.current = JSON.stringify(preset.schema);
      onSchemaChange(preset.schema);
      if (onPresetSelect) {
        onPresetSelect(preset.id, preset.sampleDocument);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 4 Clean Presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mr-1">
          Presets:
        </span>
        {SCHEMA_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleApplyPreset(preset.id)}
            className="text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Raw Schema Textarea */}
      <div className="relative">
        <textarea
          value={rawText}
          onChange={handleTextChange}
          rows={7}
          className="w-full bg-zinc-100 border border-zinc-200 rounded-md p-2.5 text-xs font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 leading-relaxed resize-y"
          placeholder='{\n  "type": "object",\n  "properties": {}\n}'
          spellCheck={false}
        />

        <div className="flex items-center justify-between text-[11px] font-mono mt-1">
          {parseError ? (
            <span className="text-red-600">Error: {parseError}</span>
          ) : (
            <span className="text-zinc-500">Valid JSON Schema syntax</span>
          )}
          <span className="text-zinc-400">Strict Grammar</span>
        </div>
      </div>
    </div>
  );
}
