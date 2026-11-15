'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface WakeUpBannerProps {
  countdown: number;
  message?: string;
}

export function WakeUpBanner({ countdown, message }: WakeUpBannerProps) {
  return (
    <div className="border border-zinc-300 bg-zinc-100 rounded-md p-3 text-zinc-800 flex items-center justify-between text-xs font-mono">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />
        <span>
          {message || 'Hugging Face T4 Space waking from auto-sleep (~20s)...'}
        </span>
      </div>
      <span className="text-zinc-500 tabular-nums">Retrying in {countdown}s</span>
    </div>
  );
}
