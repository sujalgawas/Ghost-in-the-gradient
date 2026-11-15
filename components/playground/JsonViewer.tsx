'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCode2, Terminal } from 'lucide-react';

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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="relative rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden flex flex-col">
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewRaw(false)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              !viewRaw ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="h-3 w-3" />
            Formatted JSON
          </button>
          {rawText && (
            <button
              type="button"
              onClick={() => setViewRaw(true)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                viewRaw ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="h-3 w-3" />
              Raw Token Stream
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-3.5 text-xs font-mono overflow-auto max-h-[380px] leading-relaxed selection:bg-emerald-500/30">
        <code>
          {viewRaw ? (
            <span className="text-slate-300">{rawText || ''}</span>
          ) : data ? (
            highlightJson(data)
          ) : (
            <span className="text-slate-500 italic">No structured JSON returned</span>
          )}
        </code>
      </pre>
    </div>
  );
}

// Simple syntax high-lighting helper
function highlightJson(obj: any): React.ReactNode {
  const json = JSON.stringify(obj, null, 2);

  // Tokenize JSON for coloring
  const lines = json.split('\n');

  return lines.map((line, lineIdx) => {
    // Check key and value
    const match = line.match(/^(\s*)(".*?")(: )?(.*)$/);
    if (!match) {
      return <div key={lineIdx}>{line}</div>;
    }

    const [, indent, key, colon, value] = match;

    let valElement: React.ReactNode = <span className="text-slate-300">{value}</span>;

    if (value) {
      if (value.startsWith('"')) {
        valElement = <span className="text-emerald-300">{value}</span>;
      } else if (value === 'true' || value === 'false') {
        valElement = <span className="text-purple-400">{value}</span>;
      } else if (value === 'null') {
        valElement = <span className="text-rose-400 font-semibold">{value}</span>;
      } else if (!isNaN(Number(value.replace(/,$/, '')))) {
        valElement = <span className="text-amber-300">{value}</span>;
      }
    }

    return (
      <div key={lineIdx}>
        <span>{indent}</span>
        <span className="text-cyan-400">{key}</span>
        {colon && <span className="text-slate-500">{colon}</span>}
        {valElement}
      </div>
    );
  });
}
