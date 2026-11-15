import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Tiny-Aya Structured Extraction Workbench | Lexsi Labs',
  description: 'ML Research & Evaluation Workbench for schema-conditioned JSON extraction across CohereLabs/tiny-aya-global Base, SFT v2, and DPO-aligned adapters.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFA] text-[#09090B] min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <footer className="border-t border-zinc-200 bg-white py-3 px-6 text-xs text-zinc-500 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-medium text-zinc-800">Lexsi Labs</span> · AI Safety &amp; Alignment Hackathon · Track 1
            </div>
            <div className="text-zinc-400">
              Base: tiny-aya-global (3.35B) · SFT v2 Adapter · DPO Adapter
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
