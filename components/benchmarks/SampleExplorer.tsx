'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BenchmarkSample } from '@/types/benchmark';
import { Search, Filter, ChevronDown, ChevronUp, FileText, CheckCircle2, XCircle, Code, Eye } from 'lucide-react';

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
    <Card className="p-5 flex flex-col gap-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-500" />
            FieldBench Sample Explorer & Multi-Model Diff Inspector
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Inspect source documents, gold schemas, and side-by-side model outputs
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search samples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-40 sm:w-56"
            />
          </div>

          {/* Domain filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
      </div>

      {/* Samples Accordion List */}
      <div className="flex flex-col gap-3">
        {filteredSamples.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-700 dark:text-slate-300 italic">
            No benchmark samples matching "{searchQuery}"
          </div>
        ) : (
          filteredSamples.map((sample) => {
            const isExpanded = expandedSampleId === sample.id;

            return (
              <div
                key={sample.id}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-emerald-500/50 bg-slate-50/50 dark:bg-slate-900/60 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleExpand(sample.id)}
                  className="w-full p-3.5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      {sample.id}
                    </span>
                    <Badge variant="cyan" size="sm">
                      {sample.domain}
                    </Badge>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {sample.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick indicator pills */}
                    <span className="hidden sm:inline-flex text-[11px] text-slate-700 dark:text-slate-300 font-mono">
                      DPO: {sample.predictions.dpo.doc_exact ? '✅ Exact' : '⚠️ Partial'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-5 animate-in fade-in duration-150">
                    {/* Source Document & Gold JSON */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Document */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-cyan-400" />
                          Source Document
                        </label>
                        <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg text-xs font-mono max-h-48 overflow-auto border border-slate-800 whitespace-pre-wrap leading-relaxed">
                          {sample.document}
                        </pre>
                      </div>

                      {/* Gold Standard */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          Gold Target JSON
                        </label>
                        <pre className="p-3 bg-slate-950 text-emerald-300 rounded-lg text-xs font-mono max-h-48 overflow-auto border border-slate-800 leading-relaxed">
                          {JSON.stringify(sample.gold, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* 3 Models Actual Side-by-Side Predictions */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Code className="h-3.5 w-3.5 text-emerald-500" />
                        Model Predictions Comparison
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Base Prediction */}
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950/70 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                            <span>Base (3.35B)</span>
                            <span className="text-[10px] text-rose-400">
                              F1: {sample.predictions.base.field_f1 ?? 0}%
                            </span>
                          </div>
                          <pre className="text-[11px] font-mono text-slate-300 max-h-56 overflow-auto whitespace-pre-wrap">
                            {sample.predictions.base.raw_output}
                          </pre>
                        </div>

                        {/* SFT v2 Prediction */}
                        <div className="rounded-lg border border-blue-500/30 p-3 bg-blue-950/10 dark:bg-slate-950/70 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs font-bold text-blue-500 border-b border-blue-500/20 pb-1.5">
                            <span>SFT v2 Adapter</span>
                            <span className="text-[10px] text-blue-400">
                              F1: {sample.predictions.sftv2.field_f1 ?? 0}%
                            </span>
                          </div>
                          <pre className="text-[11px] font-mono text-slate-300 max-h-56 overflow-auto whitespace-pre-wrap">
                            {sample.predictions.sftv2.raw_output}
                          </pre>
                        </div>

                        {/* DPO Prediction */}
                        <div className="rounded-lg border border-emerald-500/40 p-3 bg-emerald-950/10 dark:bg-slate-950/70 flex flex-col gap-2 ring-1 ring-emerald-500/20">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-500 border-b border-emerald-500/20 pb-1.5">
                            <span>DPO Aligned</span>
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              F1: {sample.predictions.dpo.field_f1 ?? 0}% (Exact Match)
                            </span>
                          </div>
                          <pre className="text-[11px] font-mono text-slate-200 max-h-56 overflow-auto whitespace-pre-wrap">
                            {sample.predictions.dpo.raw_output}
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
    </Card>
  );
}
