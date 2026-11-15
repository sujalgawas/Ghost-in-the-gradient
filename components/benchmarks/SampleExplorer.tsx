'use client';

import React, { useState } from 'react';
import { BenchmarkSample } from '@/types/benchmark';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface SampleExplorerProps {
  samples: BenchmarkSample[];
}

export function SampleExplorer({ samples }: SampleExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedSampleId, setExpandedSampleId] = useState<string | null>(samples[0]?.id || null);

  const domains = Array.from(new Set(samples.map(s => s.domain)));

  const filteredSamples = samples.filter((sample) => {
    const matchesDomain = selectedDomain === 'all' || sample.domain === selectedDomain;
    const matchesQuery =
      searchQuery === '' ||
      sample.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.document.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesQuery;
  });

  const toggleExpand = (id: string) => {
    setExpandedSampleId(expandedSampleId === id ? null : id);
  };

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg p-4 flex flex-col gap-3">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Sample-Level Inspector &amp; 3-Model Diff
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Click any row to inspect source document, target schema, gold ground truth, and actual predictions
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="h-3 w-3 absolute left-2.5 top-2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search sample id / text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-md pl-7 pr-2.5 py-1 text-xs font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 w-44 sm:w-56"
            />
          </div>

          {/* Domain filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 cursor-pointer"
          >
            <option value="all">All Domains ({samples.length})</option>
            {domains.map((dom) => (
              <option key={dom} value={dom}>
                {dom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Samples List */}
      <div className="flex flex-col border border-zinc-200 rounded-md divide-y divide-zinc-200 overflow-hidden text-xs">
        {filteredSamples.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 font-mono">
            No benchmark samples matching query
          </div>
        ) : (
          filteredSamples.map((sample) => {
            const isExpanded = expandedSampleId === sample.id;
            const dpoExact = sample.predictions.dpo?.doc_exact;
            const sftExact = sample.predictions.sftv2?.doc_exact;
            const baseExact = sample.predictions.base?.doc_exact;

            return (
              <div key={sample.id} className="bg-white">
                {/* Row Header / Trigger */}
                <button
                  type="button"
                  onClick={() => toggleExpand(sample.id)}
                  className={`w-full p-2.5 sm:px-3 sm:py-2 flex items-center justify-between text-left hover:bg-zinc-50 transition-colors ${
                    isExpanded ? 'bg-zinc-50/70' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-zinc-950 w-16">
                      {sample.id}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">
                      {sample.domain}
                    </span>
                    <span className="font-sans text-xs text-zinc-700 truncate max-w-sm sm:max-w-md hidden md:inline">
                      {sample.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className={baseExact ? 'text-green-700' : 'text-zinc-400'}>
                      Base: {baseExact ? '✓' : '✗'}
                    </span>
                    <span className={sftExact ? 'text-green-700' : 'text-zinc-400'}>
                      SFT: {sftExact ? '✓' : '✗'}
                    </span>
                    <span className={dpoExact ? 'text-green-700 font-medium' : 'text-red-600'}>
                      DPO: {dpoExact ? '✓ Exact' : '✗ Partial'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Inspection Drawer */}
                {isExpanded && (
                  <div className="p-3.5 bg-zinc-50 border-t border-zinc-200 flex flex-col gap-3 font-mono">
                    {/* Top: Document & Gold Standard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                          Source Document
                        </span>
                        <pre className="p-2.5 bg-zinc-100 border border-zinc-200 rounded text-xs text-zinc-800 max-h-36 overflow-auto whitespace-pre-wrap leading-relaxed select-text">
                          {sample.document}
                        </pre>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                          Gold Target JSON
                        </span>
                        <pre className="p-2.5 bg-zinc-100 border border-zinc-200 rounded text-xs text-zinc-900 max-h-36 overflow-auto leading-relaxed select-text">
                          {JSON.stringify(sample.gold, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Bottom: 3 Models Actual Side-by-Side Outputs */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-200">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                        Model Predictions Side-by-Side
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {/* Base */}
                        <div className="border border-zinc-200 bg-white rounded p-2.5 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between pb-1 border-b border-zinc-100 text-[11px]">
                            <span className="font-semibold text-zinc-700">Base</span>
                            <span className="text-zinc-500 tabular-nums">
                              {sample.predictions.base?.latency_ms}ms · f1: {sample.predictions.base?.field_f1}%
                            </span>
                          </div>
                          <pre className="text-[11.5px] text-zinc-700 max-h-48 overflow-auto whitespace-pre-wrap leading-relaxed select-text">
                            {sample.predictions.base?.raw_output || 'No output'}
                          </pre>
                        </div>

                        {/* SFT v2 */}
                        <div className="border border-zinc-200 bg-white rounded p-2.5 flex flex-col gap-1.5 border-t-2 border-t-[#2563EB]">
                          <div className="flex items-center justify-between pb-1 border-b border-zinc-100 text-[11px]">
                            <span className="font-semibold text-blue-700">SFT v2</span>
                            <span className="text-zinc-500 tabular-nums">
                              {sample.predictions.sftv2?.latency_ms}ms · f1: {sample.predictions.sftv2?.field_f1}%
                            </span>
                          </div>
                          <pre className="text-[11.5px] text-zinc-700 max-h-48 overflow-auto whitespace-pre-wrap leading-relaxed select-text">
                            {sample.predictions.sftv2?.raw_output || 'No output'}
                          </pre>
                        </div>

                        {/* DPO */}
                        <div className="border border-zinc-200 bg-white rounded p-2.5 flex flex-col gap-1.5 border-t-2 border-t-[#059669]">
                          <div className="flex items-center justify-between pb-1 border-b border-zinc-100 text-[11px]">
                            <span className="font-semibold text-emerald-800">DPO</span>
                            <span className="text-zinc-500 tabular-nums">
                              {sample.predictions.dpo?.latency_ms}ms · f1: {sample.predictions.dpo?.field_f1}%
                            </span>
                          </div>
                          <pre className="text-[11.5px] text-zinc-700 max-h-48 overflow-auto whitespace-pre-wrap leading-relaxed select-text">
                            {sample.predictions.dpo?.raw_output || 'No output'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
