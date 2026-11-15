import Ajv, { ErrorObject } from 'ajv';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  coerceTypes: false,
  allowUnionTypes: true,
});

export interface ParseResult {
  ok: boolean;
  parsed: Record<string, any> | null;
  error?: string;
}

export interface ValidationErrorItem {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  message: string;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: ValidationErrorItem[];
}

export interface GroundingResult {
  hallucinated_fields: string[];
  total_checked: number;
  hallucination_rate: number; // 0 - 100%
  grounded_count: number;
}

export interface F1Result {
  precision: number;
  recall: number;
  f1: number;
  matched: number;
  gold_total: number;
  pred_total: number;
}

/**
 * Attempts to parse JSON string, handling optional markdown code fences or conversational wrappers.
 */
export function tryParseJSON(raw: string): ParseResult {
  if (!raw || typeof raw !== 'string') {
    return { ok: false, parsed: null, error: 'Empty output' };
  }

  let text = raw.trim();

  // Strip markdown code fences if present: ```json ... ``` or ``` ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  }

  // Attempt direct parse first
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null) {
      return { ok: true, parsed };
    }
    return { ok: false, parsed: null, error: 'Parsed JSON is not an object' };
  } catch (err: any) {
    // Attempt substring extraction if model added conversational prefixes/suffixes
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidate = text.substring(firstBrace, lastBrace + 1);
      try {
        const parsed = JSON.parse(candidate);
        if (typeof parsed === 'object' && parsed !== null) {
          return { ok: true, parsed };
        }
      } catch {
        // Fall through to error
      }
    }
    return { ok: false, parsed: null, error: err.message || 'Invalid JSON syntax' };
  }
}

/**
 * Validates parsed JSON against a JSON Schema using Ajv.
 */
export function validateSchema(data: any, schema: any): SchemaValidationResult {
  if (!schema || typeof schema !== 'object' || Object.keys(schema).length === 0) {
    return { valid: true, errors: [] };
  }

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{
        instancePath: '',
        schemaPath: '#/type',
        keyword: 'type',
        message: 'Data must be an object',
      }],
    };
  }

  try {
    const validate = ajv.compile(schema);
    const valid = validate(data) as boolean;
    if (valid) {
      return { valid: true, errors: [] };
    }

    const errors: ValidationErrorItem[] = (validate.errors || []).map((err: ErrorObject) => ({
      instancePath: err.instancePath || '/',
      schemaPath: err.schemaPath,
      keyword: err.keyword,
      message: err.message || 'Schema validation error',
    }));

    return { valid: false, errors };
  } catch (compileErr: any) {
    return {
      valid: false,
      errors: [{
        instancePath: '',
        schemaPath: '',
        keyword: 'schema_error',
        message: `Schema compilation error: ${compileErr.message}`,
      }],
    };
  }
}

/**
 * Checks string/number leaf values extracted by the model to determine whether they
 * are grounded in the source text.
 */
export function checkGrounding(extracted: any, sourceDoc: string): GroundingResult {
  if (!extracted || typeof extracted !== 'object' || !sourceDoc) {
    return { hallucinated_fields: [], total_checked: 0, hallucination_rate: 0, grounded_count: 0 };
  }

  const normalizedDoc = sourceDoc.toLowerCase().replace(/\s+/g, ' ');
  const leafValues: { path: string; value: string }[] = [];

  function traverse(obj: any, path: string) {
    if (obj === null || obj === undefined) return;

    if (typeof obj === 'string') {
      const trimmed = obj.trim();
      // Only evaluate substantive strings (length >= 3) to prevent flagging "yes", "N/A", "true", etc.
      if (trimmed.length >= 3 && !['null', 'none', 'n/a', 'true', 'false', 'unknown'].includes(trimmed.toLowerCase())) {
        leafValues.push({ path, value: trimmed });
      }
    } else if (typeof obj === 'number') {
      leafValues.push({ path, value: String(obj) });
    } else if (Array.isArray(obj)) {
      obj.forEach((item, idx) => traverse(item, `${path}[${idx}]`));
    } else if (typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        traverse(obj[key], path ? `${path}.${key}` : key);
      }
    }
  }

  traverse(extracted, '');

  if (leafValues.length === 0) {
    return { hallucinated_fields: [], total_checked: 0, hallucination_rate: 0, grounded_count: 0 };
  }

  const hallucinated: string[] = [];

  for (const item of leafValues) {
    const valLower = item.value.toLowerCase().replace(/\s+/g, ' ');
    // Direct or token-overlap inclusion
    const isDirectMatch = normalizedDoc.includes(valLower);

    if (!isDirectMatch) {
      // Check if tokens of value (>3 chars) are substantially grounded
      const tokens = valLower.split(/[^a-z0-9]+/i).filter(t => t.length > 2);
      if (tokens.length > 0) {
        const foundTokens = tokens.filter(t => normalizedDoc.includes(t));
        const tokenOverlap = foundTokens.length / tokens.length;
        if (tokenOverlap < 0.6) {
          hallucinated.push(`${item.path} ("${item.value.slice(0, 30)}${item.value.length > 30 ? '...' : ''}")`);
        }
      } else {
        hallucinated.push(item.path);
      }
    }
  }

  const total = leafValues.length;
  const groundedCount = total - hallucinated.length;
  const rate = total > 0 ? (hallucinated.length / total) * 100 : 0;

  return {
    hallucinated_fields: hallucinated,
    total_checked: total,
    hallucination_rate: Math.round(rate * 10) / 10,
    grounded_count: groundedCount,
  };
}

/**
 * Calculates field-level Precision, Recall, and F1 between predicted and gold JSON objects.
 */
export function fieldF1(predicted: any, gold: any): F1Result {
  if (!gold || typeof gold !== 'object') {
    return { precision: 100, recall: 100, f1: 100, matched: 0, gold_total: 0, pred_total: 0 };
  }
  if (!predicted || typeof predicted !== 'object') {
    const goldCount = countLeafKeys(gold);
    return { precision: 0, recall: 0, f1: 0, matched: 0, gold_total: goldCount, pred_total: 0 };
  }

  const flatGold = flattenObject(gold);
  const flatPred = flattenObject(predicted);

  const goldKeys = Object.keys(flatGold);
  const predKeys = Object.keys(flatPred);

  if (goldKeys.length === 0 && predKeys.length === 0) {
    return { precision: 100, recall: 100, f1: 100, matched: 0, gold_total: 0, pred_total: 0 };
  }

  let matched = 0;
  for (const key of goldKeys) {
    if (key in flatPred) {
      const gVal = String(flatGold[key]).trim().toLowerCase();
      const pVal = String(flatPred[key]).trim().toLowerCase();
      if (gVal === pVal) {
        matched++;
      }
    }
  }

  const precision = predKeys.length > 0 ? (matched / predKeys.length) * 100 : 0;
  const recall = goldKeys.length > 0 ? (matched / goldKeys.length) * 100 : 0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    precision: Math.round(precision * 10) / 10,
    recall: Math.round(recall * 10) / 10,
    f1: Math.round(f1 * 10) / 10,
    matched,
    gold_total: goldKeys.length,
    pred_total: predKeys.length,
  };
}

/**
 * Checks Null Abstention Accuracy between predicted and gold objects.
 */
export function nullAccuracy(predicted: any, gold: any): number {
  if (!gold || typeof gold !== 'object') return 100;
  if (!predicted || typeof predicted !== 'object') return 0;

  const flatGold = flattenObject(gold);
  const flatPred = flattenObject(predicted);

  const nullGoldKeys = Object.keys(flatGold).filter(k => flatGold[k] === null || flatGold[k] === undefined);

  if (nullGoldKeys.length === 0) {
    return 100; // No nulls to evaluate
  }

  let correctlyNull = 0;
  for (const k of nullGoldKeys) {
    if (!(k in flatPred) || flatPred[k] === null || flatPred[k] === undefined || flatPred[k] === 'null') {
      correctlyNull++;
    }
  }

  return Math.round((correctlyNull / nullGoldKeys.length) * 1000) / 10;
}

/**
 * Checks deep exact document match between predicted and gold objects.
 */
export function docExactMatch(predicted: any, gold: any): boolean {
  if (!predicted || !gold) return false;
  try {
    const normPred = normalizeForComparison(predicted);
    const normGold = normalizeForComparison(gold);
    return JSON.stringify(normPred) === JSON.stringify(normGold);
  } catch {
    return false;
  }
}

// Helpers
function countLeafKeys(obj: any): number {
  return Object.keys(flattenObject(obj)).length;
}

function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  if (!obj || typeof obj !== 'object') return result;

  for (const key of Object.keys(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullPath));
    } else {
      result[fullPath] = value;
    }
  }
  return result;
}

function normalizeForComparison(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (typeof obj === 'string') return obj.trim().toLowerCase();
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (Array.isArray(obj)) return obj.map(normalizeForComparison);
  if (typeof obj === 'object') {
    const sorted: Record<string, any> = {};
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = normalizeForComparison(obj[key]);
    }
    return sorted;
  }
  return obj;
}
