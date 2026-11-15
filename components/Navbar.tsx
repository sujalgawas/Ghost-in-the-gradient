'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Github } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const isPlayground = pathname === '/';
  const isBenchmarks = pathname === '/benchmarks';

  return (
    <header className="sticky top-0 z-50 h-[52px] w-full border-b border-zinc-200 bg-white px-4 sm:px-6">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Wordmark & Track Label */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-semibold text-sm tracking-tight text-zinc-950">
              Tiny-Aya Eval
            </span>
            <span className="font-mono text-xs text-zinc-400 border-l border-zinc-200 pl-2.5 hidden sm:inline">
              Lexsi Labs · Track 1
            </span>
          </Link>

          {/* Underline Tabs */}
          <nav className="flex items-center h-[52px] gap-1">
            <Link
              href="/"
              className={`h-full flex items-center px-3 text-xs tracking-tight transition-colors border-b-2 ${
                isPlayground
                  ? 'border-zinc-950 font-semibold text-zinc-950'
                  : 'border-transparent font-medium text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Playground
            </Link>
            <Link
              href="/benchmarks"
              className={`h-full flex items-center px-3 text-xs tracking-tight transition-colors border-b-2 ${
                isBenchmarks
                  ? 'border-zinc-950 font-semibold text-zinc-950'
                  : 'border-transparent font-medium text-zinc-500 hover:text-zinc-900'
              }`}
            >
              FieldBench (80 Samples)
            </Link>
          </nav>
        </div>

        {/* Right: Hardware Status Pill & Outbound Links */}
        <div className="flex items-center gap-3">
          {/* Hardware status */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-zinc-200 bg-zinc-50 text-[11px] font-mono text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>T4 GPU · Auto-Sleep 15m</span>
          </div>

          <div className="flex items-center gap-2 border-l border-zinc-200 pl-3">
            <a
              href="https://github.com/sujalgawas/Ghost-in-the-gradient"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-700 transition-colors p-1"
              title="GitHub Repository"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://huggingface.co/monson2002/tiny-aya-sft-v2-dpo-adapter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-700 transition-colors flex items-center gap-1 text-xs font-mono"
              title="Hugging Face Adapter"
            >
              <span>HF</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
