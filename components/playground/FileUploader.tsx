'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { extractTextFromPDF } from '@/lib/pdf';

interface FileUploaderProps {
  onTextExtracted: (text: string, filename: string) => void;
}

export function FileUploader({ onTextExtracted }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsLoading(true);
    setStatusMessage(`Reading ${file.name}...`);
    setErrorMessage(null);

    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setStatusMessage(`Extracting text from PDF via in-browser pdf.js...`);
        const extracted = await extractTextFromPDF(file);
        if (!extracted.trim()) {
          throw new Error('PDF appears to contain no extractable text (it might be a scanned image).');
        }
        onTextExtracted(extracted, file.name);
        setStatusMessage(`Successfully extracted ${extracted.length.toLocaleString()} characters from ${file.name}`);
      } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        onTextExtracted(text, file.name);
        setStatusMessage(`Loaded ${file.name} (${text.length.toLocaleString()} characters)`);
      } else {
        throw new Error('Unsupported file format. Please upload a PDF or TXT file.');
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorMessage(err.message || 'Failed to extract text from file.');
      setStatusMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-emerald-500 bg-emerald-500/5'
            : 'border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,text/plain,application/pdf"
          className="hidden"
          onChange={handleChange}
        />

        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          ) : (
            <UploadCloud className="h-6 w-6 text-emerald-500" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {isLoading ? 'Processing document...' : 'Click or drop PDF / TXT file here'}
          </p>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
            Client-side parsing via <code className="text-emerald-500">pdfjs-dist</code> (zero server upload)
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
