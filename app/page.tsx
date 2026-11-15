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
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default function PlaygroundPage() {
  const [docTab, setDocTab] = useState<'sample' | 'paste' | 'upload'>('sample');
  const [documentText, setDocumentText] = useState<string>(
    SCHEMA_PRESETS[0].sampleDocument
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<BenchmarkSample | null>(null);

  const [outputFormat, setOutputFormat] = useState<string>('json');
  const [schema, setSchema] = useState<Record<string, any>>(SCHEMA_PRESETS[0].schema);
  const [selectedModel, setSelectedModel] = useState<ModelKey | 'all'>('all');

  const { run, predictions, setPredictions, loading, error, wakingUp, countdown } = useInference();

  const handleSchemaChange = React.useCallback((newSchema: Record<string, any>) => {
    setSchema((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(newSchema)) {
        return prev;
      }
      return newSchema;
    });
  }, []);

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
    <div className="w-full flex flex-col">
      {/* Top micro bar */}
      <div className="h-9 px-4 sm:px-6 border-b border-zinc-200 bg-white flex items-center justify-between text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-800">EVALUATION WORKBENCH</span>
          <span>·</span>
          <span>SCHEMA-CONSTRAINED EXTRACTION</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
          title="Reset to default document and schema"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {wakingUp && (
        <div className="p-4 border-b border-zinc-200 bg-zinc-50">
          <WakeUpBanner countdown={countdown} />
        </div>
      )}

      {error && (
        <div className="p-3 border-b border-red-200 bg-red-50 text-red-700 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Split Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-97px)]">
        {/* Left Pane (42% width) */}
        <div className="lg:col-span-5 border-r border-zinc-200 bg-white p-4 sm:p-5 flex flex-col gap-4">
          {/* Segmented Control for Input Source */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                Source Document
              </label>
              <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded border border-zinc-200 text-xs">
                <button
                  type="button"
                  onClick={() => setDocTab('sample')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    docTab === 'sample'
                      ? 'bg-white font-medium text-zinc-950 border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  FieldBench Sample
                </button>
                <button
                  type="button"
                  onClick={() => setDocTab('paste')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    docTab === 'paste'
                      ? 'bg-white font-medium text-zinc-950 border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Raw Text
                </button>
                <button
                  type="button"
                  onClick={() => setDocTab('upload')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    docTab === 'upload'
                      ? 'bg-white font-medium text-zinc-950 border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  PDF / File
                </button>
              </div>
            </div>

            {docTab === 'sample' && (
              <SampleLoader
                onSelectSample={handleSelectSample}
                selectedSampleId={selectedSample?.id}
              />
            )}

            {docTab === 'upload' && (
              <FileUploader onTextExtracted={handleTextExtracted} />
            )}

            {/* Document Textarea */}
            <div className="relative">
              <textarea
                value={documentText}
                onChange={(e) => {
                  setDocumentText(e.target.value);
                  setSelectedSample(null);
                }}
                rows={docTab === 'upload' ? 4 : 7}
                placeholder="Paste or input source document text..."
                className="w-full bg-zinc-100 border border-zinc-200 rounded-md p-2.5 text-xs font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 leading-relaxed resize-y select-text"
              />
              <div className="absolute right-2 bottom-2 text-[10px] font-mono text-zinc-400 tabular-nums pointer-events-none">
                {documentText.length.toLocaleString()} chars · ~{Math.round(documentText.length / 4)} tokens
              </div>
            </div>
          </div>

          {/* Format Selector */}
          <FormatSelector value={outputFormat} onChange={setOutputFormat} />

          {/* Collapsible Schema Builder */}
          <SchemaBuilder
            schema={schema}
            onSchemaChange={handleSchemaChange}
            onPresetSelect={handlePresetSelect}
          />

          {/* Model Selector & Action Button */}
          <div className="mt-auto pt-4 border-t border-zinc-200 flex flex-col gap-3">
            <ModelSelector selected={selectedModel} onChange={setSelectedModel} />

            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={loading}
              onClick={handleRun}
              disabled={!documentText.trim()}
              className="w-full font-mono text-xs tracking-tight py-2.5"
            >
              {loading ? 'Executing Inference...' : 'Run Extraction'}
            </Button>
          </div>
        </div>

        {/* Right Pane (58% width) */}
        <div className="lg:col-span-7 bg-[#FAFAFA] p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pb-1 border-b border-zinc-200">
            <span className="font-semibold text-zinc-800 uppercase tracking-wider text-[11px]">
              Evaluation Output Streams
            </span>
            <span>
              {selectedSample ? `Sample: ${selectedSample.id} (${selectedSample.domain})` : 'Custom Payload'}
            </span>
          </div>

          {selectedModel === 'all' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 items-stretch">
              <OutputCard
                modelKey="dpo"
                prediction={predictions.dpo}
                schema={schema}
                sourceDocument={documentText}
                gold={selectedSample?.gold}
                isLoading={loading}
              />
              <OutputCard
                modelKey="sftv2"
                prediction={predictions.sftv2}
                schema={schema}
                sourceDocument={documentText}
                gold={selectedSample?.gold}
                isLoading={loading}
              />
              <OutputCard
                modelKey="base"
                prediction={predictions.base}
                schema={schema}
                sourceDocument={documentText}
                gold={selectedSample?.gold}
                isLoading={loading}
              />
            </div>
          ) : (
            <div className="flex-1">
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
