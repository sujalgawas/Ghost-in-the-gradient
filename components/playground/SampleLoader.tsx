'use client';

import React, { useEffect, useState } from 'react';
import { BenchmarkSample } from '@/types/benchmark';
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

  useEffect(() => {
    let isMounted = true;
    async function fetchFreshData() {
      try {
        const res = await fetch('/api/benchmark');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.samples && Array.isArray(json.samples)) {
            setSamples(json.samples);
          }
        }
      } catch (err) {
        console.warn('Failed to load fresh samples from /api/benchmark', err);
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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
          FieldBench Benchmark Samples
        </label>
        <span className="text-[11px] font-mono text-zinc-400">
          {samples.length} items
        </span>
      </div>

      <select
        value={selectedSampleId || ''}
        onChange={handleChange}
        className="w-full bg-white border border-zinc-200 rounded-md px-2.5 py-1.5 text-xs font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-colors cursor-pointer"
      >
        <option value="">Select benchmark sample document...</option>
        {samples.map((s) => (
          <option key={s.id} value={s.id}>
            [{s.domain}] {s.title} ({s.id})
          </option>
        ))}
      </select>
    </div>
  );
}
