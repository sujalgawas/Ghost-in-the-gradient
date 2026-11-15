'use client';

import { useState, useCallback, useRef } from 'react';
import { ModelKey, ModelPrediction, InferenceResponseSingle } from '@/types/benchmark';

export function useInference() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wakingUp, setWakingUp] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [predictions, setPredictions] = useState<Partial<Record<ModelKey, ModelPrediction>>>({});

  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const run = useCallback(async (
    model: ModelKey | 'all',
    document: string,
    schema: Record<string, any>,
    format = 'json'
  ) => {
    setLoading(true);
    setError(null);
    setWakingUp(false);

    const executeCall = async () => {
      try {
        const res = await fetch('/api/infer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, document, schema, output_format: format }),
        });

        if (res.status === 503) {
          const data = await res.json();
          if (data.status === 'waking_up') {
            setWakingUp(true);
            let sec = 5;
            setCountdown(sec);

            retryTimerRef.current = setInterval(() => {
              sec--;
              setCountdown(sec);
              if (sec <= 0) {
                if (retryTimerRef.current) clearInterval(retryTimerRef.current);
                executeCall();
              }
            }, 1000);
            return;
          }
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with ${res.status}`);
        }

        const data = await res.json();
        setWakingUp(false);

        if (model === 'all') {
          if (data.predictions) {
            setPredictions({
              base: {
                raw_output: data.predictions.base.raw_output,
                parsed_json: data.predictions.base.parsed_json,
                parse_ok: !!data.predictions.base.parsed_json,
                schema_valid: true,
                latency_ms: data.predictions.base.latency_ms,
              },
              sftv2: {
                raw_output: data.predictions.sftv2.raw_output,
                parsed_json: data.predictions.sftv2.parsed_json,
                parse_ok: !!data.predictions.sftv2.parsed_json,
                schema_valid: true,
                latency_ms: data.predictions.sftv2.latency_ms,
              },
              dpo: {
                raw_output: data.predictions.dpo.raw_output,
                parsed_json: data.predictions.dpo.parsed_json,
                parse_ok: !!data.predictions.dpo.parsed_json,
                schema_valid: true,
                latency_ms: data.predictions.dpo.latency_ms,
              },
            });
          }
        } else {
          if (data.prediction) {
            const pred = data.prediction as InferenceResponseSingle;
            setPredictions((prev) => ({
              ...prev,
              [model]: {
                raw_output: pred.raw_output,
                parsed_json: pred.parsed_json,
                parse_ok: !!pred.parsed_json,
                schema_valid: true,
                latency_ms: pred.latency_ms,
              },
            }));
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to complete inference');
      } finally {
        setLoading(false);
      }
    };

    await executeCall();
  }, []);

  return {
    run,
    predictions,
    setPredictions,
    loading,
    error,
    wakingUp,
    countdown,
  };
}
