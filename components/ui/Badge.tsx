import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'pass' | 'fail' | 'base' | 'sft' | 'dpo';
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  title,
}: BadgeProps) {
  const variantStyles = {
    default: 'border-zinc-200 text-zinc-600 bg-zinc-50',
    pass: 'border-green-200 text-green-700 bg-green-50/70',
    fail: 'border-red-200 text-red-700 bg-red-50/70',
    base: 'border-zinc-300 text-zinc-700 bg-zinc-100',
    sft: 'border-blue-200 text-blue-700 bg-blue-50/70',
    dpo: 'border-emerald-200 text-emerald-800 bg-emerald-50/70',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5 font-mono',
    md: 'text-xs px-2 py-0.5 font-mono',
  };

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded border font-medium tabular-nums ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
