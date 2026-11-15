import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all ${
        glow ? 'ring-1 ring-emerald-500/30 shadow-emerald-500/5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
