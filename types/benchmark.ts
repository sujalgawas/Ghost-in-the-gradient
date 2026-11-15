export type ModelKey = 'base' | 'sftv2' | 'dpo';

export interface ModelMetrics {
  parse_ok: number; // percentage (0-100)
  schema_valid: number; // percentage (0-100)
  field_f1: number; // percentage (0-100)
  doc_exact: number; // percentage (0-100)
  null_acc: number; // percentage (0-100)
  hallucination_rate: number; // percentage (0-100)
  hallucination_rate_adj: number; // percentage (0-100)
}

export interface ModelPrediction {
  raw_output: string;
  parsed_json: Record<string, any> | null;
  parse_ok: boolean;
  schema_valid: boolean;
  latency_ms: number;
  hallucinated_fields?: string[];
  field_f1?: number;
  doc_exact?: boolean;
}

export interface BenchmarkSample {
  id: string;
  domain: string;
  title: string;
  document: string;
  schema: Record<string, any>;
  gold: Record<string, any>;
  predictions: {
    base: ModelPrediction;
    sftv2: ModelPrediction;
    dpo: ModelPrediction;
  };
}

export interface BenchmarkData {
  benchmark_name: string;
  description: string;
  timestamp: string;
  models: {
    base: { name: string; repo_id: string; description: string };
    sftv2: { name: string; repo_id: string; description: string };
    dpo: { name: string; repo_id: string; description: string };
  };
  overall: {
    base: ModelMetrics;
    sftv2: ModelMetrics;
    dpo: ModelMetrics;
  };
  by_domain: Record<string, {
    base: ModelMetrics;
    sftv2: ModelMetrics;
    dpo: ModelMetrics;
  }>;
  samples: BenchmarkSample[];
}

export interface InferenceRequest {
  model: ModelKey | 'all';
  document: string;
  schema: Record<string, any>;
  output_format?: 'json' | 'yaml' | 'xml';
}

export interface InferenceResponseSingle {
  model: ModelKey;
  raw_output: string;
  parsed_json: Record<string, any> | null;
  latency_ms: number;
  status?: string;
  error?: string;
}

export interface InferenceResponseAll {
  predictions: {
    base: InferenceResponseSingle;
    sftv2: InferenceResponseSingle;
    dpo: InferenceResponseSingle;
  };
  latencies_ms: {
    base: number;
    sftv2: number;
    dpo: number;
  };
  status?: string;
}
