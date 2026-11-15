'use client';

import React, { useEffect, useState } from 'react';
import { BenchmarkSample } from '@/types/benchmark';
import { Sparkles, Database, Loader2 } from 'lucide-react';
import { normalizeBenchmarkData } from '@/lib/benchmark';
import fallbackData from '@/public/data/fieldbench_benchmark_results.json';

interface SampleLoaderProps {
  onSelectSample: (sample: BenchmarkSample) => void;
  selectedSampleId?: string;
}

export function SampleLoader({ onSelectSample, selectedSampleId }: SampleLoaderProps) {
  const [samples, setSamples] = useState<BenchmarkSample[]>(() => {
    try {
      return normalizeBenchmarkData(fallbackData).samples;
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchFreshData() {
      try {
        setLoading(true);
        const res = await fetch('/api/benchmark');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.samples && Array.isArray(json.samples)) {
            setSamples(json.samples);
          }
        }
      } catch (err) {
        console.warn('Failed to load fresh samples from /api/benchmark', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchFreshData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const found = samples.find((s) => s.id === id);
    if (found) {
      onSelectSample(found);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5 text-emerald-500" />
          Load Benchmark Sample
        </label>
        <span className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1">
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />
              <span>Syncing Hub...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>{samples.length} FieldBench Samples</span>
            </>
          )}
        </span>
      </div>

      <select
        value={selectedSampleId || ''}
        onChange={handleChange}
        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
      >
        <option value="">-- Choose a benchmark document ({samples.length} available) --</option>
        {samples.map((s) => (
          <option key={s.id} value={s.id}>
            [{s.domain}] {s.title} ({s.id})
          </option>
        ))}
      </select>
    </div>
  );
}
