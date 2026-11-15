import { NextRequest, NextResponse } from 'next/server';
import { ModelKey, InferenceResponseSingle } from '@/types/benchmark';
import { tryParseJSON } from '@/lib/scoring';

interface RequestBody {
  model: ModelKey | 'all';
  document: string;
  schema: Record<string, any>;
  output_format?: string;
}

// Helper to query single model from Hugging Face Space backend
async function queryHfModel(
  hfUrl: string,
  hfToken: string,
  model: ModelKey,
  document: string,
  schema: Record<string, any>,
  outputFormat: string
): Promise<InferenceResponseSingle> {
  const startTime = Date.now();

  const response = await fetch(`${hfUrl.replace(/\/+$/, '')}/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hfToken}`,
    },
    body: JSON.stringify({
      model,
      document,
      schema,
      output_format: outputFormat || 'json',
    }),
    cache: 'no-store',
  });

  const latency_ms = Date.now() - startTime;

  if (response.status === 503 || response.status === 504) {
    const errorText = await response.text();
    const isWaking = errorText.toLowerCase().includes('waking') ||
                     errorText.toLowerCase().includes('sleep') ||
                     errorText.toLowerCase().includes('starting') ||
                     response.status === 503;
    throw {
      status: 503,
      isWaking,
      message: isWaking ? 'Hugging Face T4 Space is waking up from auto-sleep (~20s)...' : 'Inference service temporarily unavailable',
    };
  }

  if (!response.ok) {
    const errText = await response.text();
    throw {
      status: response.status,
      message: `HF Inference backend error (${response.status}): ${errText}`,
    };
  }

  const result = await response.json();
  const rawOutput = result.raw_output || (typeof result.parsed_json === 'object' ? JSON.stringify(result.parsed_json, null, 2) : '');
  let parsedJson = result.parsed_json;

  if (parsedJson === undefined || parsedJson === null) {
    const parseAttempt = tryParseJSON(rawOutput);
    parsedJson = parseAttempt.ok ? parseAttempt.parsed : null;
  }

  return {
    model,
    raw_output: rawOutput,
    parsed_json: parsedJson,
    latency_ms: result.latency_ms || latency_ms,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { model, document, schema, output_format = 'json' } = body;

    if (!document || typeof document !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "document" in request body' }, { status: 400 });
    }

    if (!schema || typeof schema !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid "schema" in request body' }, { status: 400 });
    }

    const hfUrl = process.env.HF_INFERENCE_URL;
    const hfToken = process.env.HF_TOKEN;

    // If HF credentials are not yet configured in environment variables, provide helpful mock/simulation fallback
    if (!hfUrl || !hfToken) {
      console.warn('HF_INFERENCE_URL or HF_TOKEN is not configured. Running demonstration fallback.');
      return handleDemoFallback(model, document, schema);
    }

    if (model === 'all') {
      // Fan out requests for all 3 models in parallel to the HF backend
      try {
        const [baseRes, sftRes, dpoRes] = await Promise.all([
          queryHfModel(hfUrl, hfToken, 'base', document, schema, output_format),
          queryHfModel(hfUrl, hfToken, 'sftv2', document, schema, output_format),
          queryHfModel(hfUrl, hfToken, 'dpo', document, schema, output_format),
        ]);

        return NextResponse.json({
          predictions: {
            base: baseRes,
            sftv2: sftRes,
            dpo: dpoRes,
          },
          latencies_ms: {
            base: baseRes.latency_ms,
            sftv2: sftRes.latency_ms,
            dpo: dpoRes.latency_ms,
          },
          status: 'success',
        });
      } catch (err: any) {
        if (err.status === 503) {
          return NextResponse.json(
            { status: 'waking_up', message: err.message, retry_after_ms: 5000 },
            { status: 503 }
          );
        }
        return NextResponse.json(
          { error: err.message || 'Error communicating with inference backend' },
          { status: err.status || 500 }
        );
      }
    } else {
      // Single model request
      try {
        const singleRes = await queryHfModel(hfUrl, hfToken, model as ModelKey, document, schema, output_format);
        return NextResponse.json({
          prediction: singleRes,
          latency_ms: singleRes.latency_ms,
          status: 'success',
        });
      } catch (err: any) {
        if (err.status === 503) {
          return NextResponse.json(
            { status: 'waking_up', message: err.message, retry_after_ms: 5000 },
            { status: 503 }
          );
        }
        return NextResponse.json(
          { error: err.message || 'Error communicating with inference backend' },
          { status: err.status || 500 }
        );
      }
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error processing inference request' },
      { status: 500 }
    );
  }
}

/**
 * Fallback synthesizer for development when HF endpoint is not yet connected,
 * showcasing the contrasting behavior of Base vs SFT v2 vs DPO on the given schema & document.
 */
function handleDemoFallback(model: ModelKey | 'all', document: string, schema: Record<string, any>) {
  const properties = schema.properties || {};
  const propKeys = Object.keys(properties);

  // Synthesize realistic model behaviors
  // Base: hallucinates, ungrounded conversational text, partial keys
  const baseExtracted: Record<string, any> = {};
  propKeys.slice(0, Math.max(1, Math.floor(propKeys.length * 0.6))).forEach(k => {
    baseExtracted[k] = `Extracted_${k}_(approximate)`;
  });
  baseExtracted['unsolicited_note'] = 'Model added extraneous text not present in schema';

  const basePrediction: InferenceResponseSingle = {
    model: 'base',
    raw_output: `I have analyzed the document and found the following:\n${JSON.stringify(baseExtracted, null, 2)}\nLet me know if you need anything else!`,
    parsed_json: baseExtracted,
    latency_ms: 710,
  };

  // SFT v2: good schema compliance, occasional minor grounding drift
  const sftExtracted: Record<string, any> = {};
  propKeys.forEach(k => {
    const propType = properties[k]?.type;
    if (propType === 'number' || propType === 'integer') sftExtracted[k] = 100;
    else if (propType === 'boolean') sftExtracted[k] = true;
    else if (propType === 'array') sftExtracted[k] = ['Sample item'];
    else sftExtracted[k] = `Found in text`;
  });

  const sftPrediction: InferenceResponseSingle = {
    model: 'sftv2',
    raw_output: JSON.stringify(sftExtracted, null, 2),
    parsed_json: sftExtracted,
    latency_ms: 820,
  };

  // DPO: strict schema compliance, 0 hallucination, strict adherence
  const dpoExtracted: Record<string, any> = {};
  propKeys.forEach(k => {
    const propType = properties[k]?.type;
    if (propType === 'number' || propType === 'integer') dpoExtracted[k] = 100;
    else if (propType === 'boolean') dpoExtracted[k] = true;
    else if (propType === 'array') dpoExtracted[k] = [];
    else dpoExtracted[k] = 'Strictly grounded value';
  });

  const dpoPrediction: InferenceResponseSingle = {
    model: 'dpo',
    raw_output: JSON.stringify(dpoExtracted, null, 2),
    parsed_json: dpoExtracted,
    latency_ms: 790,
  };

  if (model === 'all') {
    return NextResponse.json({
      predictions: {
        base: basePrediction,
        sftv2: sftPrediction,
        dpo: dpoPrediction,
      },
      latencies_ms: {
        base: basePrediction.latency_ms,
        sftv2: sftPrediction.latency_ms,
        dpo: dpoPrediction.latency_ms,
      },
      status: 'demo_fallback',
    });
  } else {
    const predMap = { base: basePrediction, sftv2: sftPrediction, dpo: dpoPrediction };
    const selected = predMap[model as ModelKey];
    return NextResponse.json({
      prediction: selected,
      latency_ms: selected.latency_ms,
      status: 'demo_fallback',
    });
  }
}
