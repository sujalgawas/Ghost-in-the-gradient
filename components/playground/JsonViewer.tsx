'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: Record<string, any> | null;
  rawText?: string;
}

export function JsonViewer({ data, rawText }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [viewRaw, setViewRaw] = useState(false);

  const displayString = data ? JSON.stringify(data, null, 2) : (rawText || 'No output generated');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="relative rounded-md border border-zinc-200 bg-zinc-100 flex flex-col overflow-hidden text-zinc-900">
      {/* Top micro toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-200/50 border-b border-zinc-200 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={() => setViewRaw(false)}
            className={`transition-colors ${
              !viewRaw ? 'font-semibold text-zinc-950' : 'hover:text-zinc-950'
            }`}
          >
            JSON
          </button>
          <span>·</span>
          {rawText && (
            <button
              type="button"
              onClick={() => setViewRaw(true)}
              className={`transition-colors ${
                viewRaw ? 'font-semibold text-zinc-950' : 'hover:text-zinc-950'
              }`}
            >
              Raw Stream
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-zinc-500 hover:text-zinc-950 transition-colors"
          title="Copy JSON"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-600" />
              <span className="text-green-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-3 text-[12px] font-mono leading-relaxed overflow-auto max-h-[360px] whitespace-pre-wrap select-text">
        <code>
          {viewRaw ? (
            <span className="text-zinc-700">{rawText || ''}</span>
          ) : data ? (
            highlightJson(data)
          ) : (
            <span className="text-zinc-400 italic">No structured JSON returned</span>
          )}
        </code>
      </pre>
    </div>
  );
}

function highlightJson(obj: any): React.ReactNode {
  const json = JSON.stringify(obj, null, 2);
  const lines = json.split('\n');

  return lines.map((line, lineIdx) => {
    const match = line.match(/^(\s*)(".*?")(: )?(.*)$/);
    if (!match) {
      return <div key={lineIdx}>{line}</div>;
    }

    const [, indent, key, colon, value] = match;
    let valElement: React.ReactNode = <span className="text-zinc-800">{value}</span>;

    if (value) {
      if (value.startsWith('"')) {
        valElement = <span className="text-blue-700">{value}</span>;
      } else if (value === 'true' || value === 'false') {
        valElement = <span className="text-violet-700 font-medium">{value}</span>;
      } else if (value === 'null') {
        valElement = <span className="text-red-600 font-semibold">{value}</span>;
      } else if (!isNaN(Number(value.replace(/,$/, '')))) {
        valElement = <span className="text-emerald-700 font-medium">{value}</span>;
      }
    }

    return (
      <div key={lineIdx}>
        <span>{indent}</span>
        <span className="text-zinc-950 font-medium">{key}</span>
        {colon && <span className="text-zinc-400">{colon}</span>}
        {valElement}
      </div>
    );
  });
}
