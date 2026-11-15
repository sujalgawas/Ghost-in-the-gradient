import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Tiny-Aya Structured JSON Evaluation & Playground | Lexsi Labs',
  description: 'Evaluate schema-conditioned JSON extraction across CohereLabs/tiny-aya-global Base, SFT v2, and DPO-aligned adapters.',
  keywords: ['Tiny-Aya', 'JSON Extraction', 'DPO Alignment', 'LoRA', 'Schema Validation', 'FieldBench', 'Lexsi Labs'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-700 dark:text-slate-300">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Lexsi Labs</span>
                <span>•</span>
                <span>AI Safety & Alignment Hackathon Submission</span>
              </div>
              <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                <span>Base: CohereLabs/tiny-aya-global (3.35B)</span>
                <span>•</span>
                <span>LoRA SFT v2 & DPO Adapters</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
