'use client';

import React from 'react';
import { Loader2, Server, AlertCircle } from 'lucide-react';

interface WakeUpBannerProps {
  countdown: number;
  message?: string;
}

export function WakeUpBanner({ countdown, message }: WakeUpBannerProps) {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-500 dark:text-amber-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <Server className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-amber-200">
            Waking up Nvidia T4 GPU (~20s)...
          </h4>
          <p className="text-xs text-amber-700 dark:text-amber-400/90">
            {message || 'Our Hugging Face Space auto-sleeps after 15 min of inactivity to preserve compute credits. Re-polling backend...'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-mono font-medium">
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        <span>Retrying in {countdown}s</span>
      </div>
    </div>
  );
}
