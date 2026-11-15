'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface SimpleField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  nullable: boolean;
  required: boolean;
}

interface SchemaBuilderSimpleProps {
  onSchemaChange: (schema: Record<string, any>) => void;
  initialSchema?: Record<string, any>;
}

function schemaToFields(schema?: Record<string, any>): SimpleField[] {
  if (!schema || typeof schema !== 'object' || !schema.properties) {
    return [{ id: '1', name: 'field_1', type: 'string', nullable: false, required: true }];
  }
  const props = schema.properties;
  const requiredList: string[] = Array.isArray(schema.required) ? schema.required : [];
  const keys = Object.keys(props);
  if (keys.length === 0) {
    return [{ id: '1', name: 'field_1', type: 'string', nullable: false, required: true }];
  }

  return keys.map((key, idx) => {
    const prop = props[key] || {};
    let fieldType: SimpleField['type'] = 'string';
    let isNullable = false;

    if (Array.isArray(prop.type)) {
      if (prop.type.includes('null')) isNullable = true;
      const nonNullType = prop.type.find((t: string) => t !== 'null');
      if (nonNullType) fieldType = nonNullType as any;
    } else if (typeof prop.type === 'string') {
      fieldType = (prop.type as SimpleField['type']) || 'string';
    }

    return {
      id: `${idx + 1}-${key}`,
      name: key,
      type: fieldType,
      nullable: isNullable,
      required: requiredList.includes(key),
    };
  });
}

function fieldsToSchema(fields: SimpleField[]): Record<string, any> {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  fields.forEach((f) => {
    const cleanName = f.name.trim();
    if (!cleanName) return;

    const typeDef = f.nullable ? [f.type, 'null'] : f.type;
    properties[cleanName] = {
      type: typeDef,
    };

    if (f.required) {
      required.push(cleanName);
    }
  });

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

export function SchemaBuilderSimple({ onSchemaChange, initialSchema }: SchemaBuilderSimpleProps) {
  const [fields, setFields] = useState<SimpleField[]>(() => schemaToFields(initialSchema));
  const lastEmittedJsonRef = useRef<string>(JSON.stringify(initialSchema || {}));

  // Synchronize when external schema changes (e.g. from preset, sample, or raw editor)
  useEffect(() => {
    const incomingJson = JSON.stringify(initialSchema || {});
    if (incomingJson !== lastEmittedJsonRef.current) {
      lastEmittedJsonRef.current = incomingJson;
      setFields(schemaToFields(initialSchema));
    }
  }, [initialSchema]);

  const updateFieldsAndEmit = (newFields: SimpleField[]) => {
    setFields(newFields);
    const compiled = fieldsToSchema(newFields);
    lastEmittedJsonRef.current = JSON.stringify(compiled);
    onSchemaChange(compiled);
  };

  const addField = () => {
    const newField: SimpleField = {
      id: Math.random().toString(36).substring(2, 9),
      name: `field_${fields.length + 1}`,
      type: 'string',
      nullable: false,
      required: true,
    };
    updateFieldsAndEmit([...fields, newField]);
  };

  const updateField = (id: string, patch: Partial<SimpleField>) => {
    const updated = fields.map(f => f.id === id ? { ...f, ...patch } : f);
    updateFieldsAndEmit(updated);
  };

  const removeField = (id: string) => {
    const remaining = fields.filter(f => f.id !== id);
    updateFieldsAndEmit(remaining.length > 0 ? remaining : [{ id: '1', name: 'field_1', type: 'string', nullable: false, required: true }]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              <th className="py-1.5 px-2.5 font-medium">Field</th>
              <th className="py-1.5 px-2 font-medium">Type</th>
              <th className="py-1.5 px-2 text-center font-medium">Req</th>
              <th className="py-1.5 px-2 text-center font-medium">Null</th>
              <th className="py-1.5 pr-2 w-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-mono text-xs">
            {fields.map((field) => (
              <tr key={field.id} className="hover:bg-zinc-50/50">
                <td className="py-1 px-2.5">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                    placeholder="field_name"
                    className="w-full bg-transparent text-zinc-900 focus:outline-none focus:underline"
                  />
                </td>
                <td className="py-1 px-2">
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                    className="bg-transparent text-zinc-700 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="integer">integer</option>
                    <option value="boolean">boolean</option>
                    <option value="array">array</option>
                    <option value="object">object</option>
                  </select>
                </td>
                <td className="py-1 px-2 text-center">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="rounded border-zinc-300 text-zinc-950 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                  />
                </td>
                <td className="py-1 px-2 text-center">
                  <input
                    type="checkbox"
                    checked={field.nullable}
                    onChange={(e) => updateField(field.id, { nullable: e.target.checked })}
                    className="rounded border-zinc-300 text-zinc-950 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                  />
                </td>
                <td className="py-1 pr-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="text-zinc-400 hover:text-red-600 transition-colors"
                    title="Remove field"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addField}
          className="text-xs font-mono py-1 px-2"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Field
        </Button>
        <span className="text-[11px] font-mono text-zinc-400">
          {fields.length} active fields
        </span>
      </div>
    </div>
  );
}
