'use client';

import React, { useState } from 'react';
import { ModelKey, BenchmarkSample } from '@/types/benchmark';
import { SCHEMA_PRESETS } from '@/lib/presets';
import { FileUploader } from '@/components/playground/FileUploader';
import { SampleLoader } from '@/components/playground/SampleLoader';
import { FormatSelector } from '@/components/playground/FormatSelector';
import { SchemaBuilder } from '@/components/playground/SchemaBuilder';
import { ModelSelector } from '@/components/playground/ModelSelector';
import { OutputCard } from '@/components/playground/OutputCard';
import { WakeUpBanner } from '@/components/playground/WakeUpBanner';
import { Button } from '@/components/ui/Button';
import { useInference } from '@/hooks/useInference';
import {
  FileText,
  Upload,
  Database,
  Play,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Sliders,
  AlignLeft,
} from 'lucide-react';

export default function PlaygroundPage() {
  // Input Document Tab state
  const [docTab, setDocTab] = useState<'upload' | 'paste' | 'sample'>('sample');
  const [documentText, setDocumentText] = useState<string>(
    SCHEMA_PRESETS[0].sampleDocument
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Active loaded sample and gold
  const [selectedSample, setSelectedSample] = useState<BenchmarkSample | null>(null);

  // Output format and schema
  const [outputFormat, setOutputFormat] = useState<string>('json');
  const [schema, setSchema] = useState<Record<string, any>>(SCHEMA_PRESETS[0].schema);

  // Model selection
  const [selectedModel, setSelectedModel] = useState<ModelKey | 'all'>('all');

  // Inference hook
  const { run, predictions, setPredictions, loading, error, wakingUp, countdown } = useInference();

  // Handlers
  const handleTextExtracted = (text: string, filename: string) => {
    setDocumentText(text);
    setUploadedFileName(filename);
    setSelectedSample(null);
  };

  const handleSelectSample = (sample: BenchmarkSample) => {
    setSelectedSample(sample);
    setDocumentText(sample.document);
    setSchema(sample.schema);
    setUploadedFileName(null);
    // Pre-populate with benchmark predictions so user immediately sees side-by-side comparison
    if (sample.predictions) {
      setPredictions({
        base: sample.predictions.base,
        sftv2: sample.predictions.sftv2,
        dpo: sample.predictions.dpo,
      });
    }
  };

  const handlePresetSelect = (presetId: string, sampleDoc: string) => {
    setDocumentText(sampleDoc);
    setSelectedSample(null);
    setUploadedFileName(null);
  };

  const handleRun = () => {
    if (!documentText.trim()) return;
    run(selectedModel, documentText, schema, outputFormat);
  };

  const handleReset = () => {
    const defaultPreset = SCHEMA_PRESETS[0];
    setDocumentText(defaultPreset.sampleDocument);
    setSchema(defaultPreset.schema);
    setSelectedSample(null);
    setUploadedFileName(null);
    setPredictions({});
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Tiny-Aya 3-Model Extraction Playground</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
              v2.0
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
            Compare zero-shot <span className="text-slate-800 dark:text-slate-200 font-medium">Base</span> vs. LoRA <span className="text-blue-600 dark:text-blue-400 font-medium">SFT v2</span> vs. preference-aligned <span className="text-emerald-600 dark:text-emerald-400 font-medium">DPO</span> on schema-conditioned JSON extraction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs"
            title="Reset to default document and schema"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </Button>
        </div>
      </div>

      {/* Auto-sleep wake-up banner if GPU is waking up */}
      {wakingUp && <WakeUpBanner countdown={countdown} />}

      {/* Error alert if inference failed */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols on lg) — Inputs & Config */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Document Input Section */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <AlignLeft className="h-4 w-4 text-emerald-500" />
                Source Document
              </label>

              {/* Document Input Mode Tabs */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setDocTab('sample')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    docTab === 'sample'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Database className="h-3 w-3" />
                  Sample
                </button>
                <button
                  type="button"
                  onClick={() => setDocTab('upload')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    docTab === 'upload'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Upload className="h-3 w-3" />
                  PDF/TXT
                </button>
                <button
                  type="button"
                  onClick={() => setDocTab('paste')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                    docTab === 'paste'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  Paste
                </button>
              </div>
            </div>

            {/* Document Content by Tab */}
            {docTab === 'upload' && (
              <FileUploader onTextExtracted={handleTextExtracted} />
            )}

            {docTab === 'sample' && (
              <SampleLoader
                onSelectSample={handleSelectSample}
                selectedSampleId={selectedSample?.id}
              />
            )}

            {/* Always visible text preview / edit */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
                <span>
                  {uploadedFileName ? `Loaded: ${uploadedFileName}` : selectedSample ? `Sample: ${selectedSample.title}` : 'Document Text'}
                </span>
                <span>{documentText.length.toLocaleString()} characters</span>
              </div>
              <textarea
                value={documentText}
                onChange={(e) => {
                  setDocumentText(e.target.value);
                  setSelectedSample(null);
                }}
                rows={docTab === 'upload' ? 5 : 8}
                placeholder="Paste or drop document text here..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 selection:bg-emerald-500/20"
              />
            </div>
          </div>

          {/* Format Selector */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm">
            <FormatSelector value={outputFormat} onChange={setOutputFormat} />
          </div>

          {/* JSON Schema Builder */}
          <SchemaBuilder
            schema={schema}
            onSchemaChange={setSchema}
            onPresetSelect={handlePresetSelect}
          />

          {/* Model Selection & Run Controls */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm flex flex-col gap-4">
            <ModelSelector selected={selectedModel} onChange={setSelectedModel} />

            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={loading}
              onClick={handleRun}
              disabled={!documentText.trim()}
              className="w-full text-sm font-semibold shadow-md shadow-emerald-500/20"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{loading ? 'Running Inference...' : 'Run Extraction'}</span>
            </Button>
          </div>
        </div>

        {/* Right Column (7 cols on lg) — Outputs & Audit */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Live Model Outputs & Real-Time Audit
              </h2>
              {selectedSample && (
                <span className="text-[11px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-medium">
                  Gold Available
                </span>
              )}
            </div>
            <span className="text-xs text-slate-700 dark:text-slate-300">
              Evaluated with <code className="text-emerald-500">ajv</code> & Grounding Engine
            </span>
          </div>

          {/* Render cards based on selected mode */}
          {selectedModel === 'all' ? (
            <div className="flex flex-col gap-5">
              {/* Compare 3 Cards stacked vertically or side-by-side depending on viewport */}
              <div className="grid grid-cols-1 gap-5">
                {/* DPO Aligned Model (Top/Primary) */}
                <OutputCard
                  modelKey="dpo"
                  prediction={predictions.dpo}
                  schema={schema}
                  sourceDocument={documentText}
                  gold={selectedSample?.gold}
                  isLoading={loading}
                />

                {/* SFT v2 Model */}
                <OutputCard
                  modelKey="sftv2"
                  prediction={predictions.sftv2}
                  schema={schema}
                  sourceDocument={documentText}
                  gold={selectedSample?.gold}
                  isLoading={loading}
                />

                {/* Base Model */}
                <OutputCard
                  modelKey="base"
                  prediction={predictions.base}
                  schema={schema}
                  sourceDocument={documentText}
                  gold={selectedSample?.gold}
                  isLoading={loading}
                />
              </div>
            </div>
          ) : (
            <div>
              <OutputCard
                modelKey={selectedModel}
                prediction={predictions[selectedModel]}
                schema={schema}
                sourceDocument={documentText}
                gold={selectedSample?.gold}
                isLoading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
