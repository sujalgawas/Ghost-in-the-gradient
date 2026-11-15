'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
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
        setStatusMessage(`Extracting text in-browser via pdf.js...`);
        const extracted = await extractTextFromPDF(file);
        if (!extracted.trim()) {
          throw new Error('PDF appears to contain no extractable text (it might be a scanned image).');
        }
        onTextExtracted(extracted, file.name);
        setStatusMessage(`Extracted ${extracted.length.toLocaleString()} chars from ${file.name}`);
      } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        onTextExtracted(text, file.name);
        setStatusMessage(`Loaded ${file.name} (${text.length.toLocaleString()} chars)`);
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
        className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${
          isDragging
            ? 'border-zinc-950 bg-zinc-100'
            : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,text/plain,application/pdf"
          className="hidden"
          onChange={handleChange}
        />

        <div className="h-8 w-8 rounded-full bg-zinc-200/80 flex items-center justify-center text-zinc-600">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-800" />
          ) : (
            <UploadCloud className="h-4 w-4 text-zinc-700" />
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-800">
            {isLoading ? 'Extracting text...' : 'Drop PDF or TXT document here, or browse'}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
            Client-side parsing via pdfjs-dist · zero server payload
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-700 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-md">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
          <span className="truncate">{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs font-mono text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md">
          <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
