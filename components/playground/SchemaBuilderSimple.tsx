'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
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

export function SchemaBuilderSimple({ onSchemaChange, initialSchema }: SchemaBuilderSimpleProps) {
  const [fields, setFields] = useState<SimpleField[]>([
    { id: '1', name: 'document_id', type: 'string', nullable: false, required: true },
    { id: '2', name: 'entity_name', type: 'string', nullable: false, required: true },
    { id: '3', name: 'amount_total', type: 'number', nullable: true, required: false },
    { id: '4', name: 'is_approved', type: 'boolean', nullable: false, required: false },
  ]);

  // If initial schema changes from presets or sample loader, try to extract fields
  useEffect(() => {
    if (initialSchema && initialSchema.properties) {
      const props = initialSchema.properties;
      const requiredList: string[] = Array.isArray(initialSchema.required) ? initialSchema.required : [];
      const newFields: SimpleField[] = Object.keys(props).map((key, idx) => {
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
          id: String(idx + 1),
          name: key,
          type: fieldType,
          nullable: isNullable,
          required: requiredList.includes(key),
        };
      });

      if (newFields.length > 0) {
        setFields(newFields);
      }
    }
  }, [initialSchema]);

  // Compile fields into JSON Schema whenever fields change
  useEffect(() => {
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

    const compiledSchema = {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined,
    };

    onSchemaChange(compiledSchema);
  }, [fields, onSchemaChange]);

  const addField = () => {
    const newField: SimpleField = {
      id: Math.random().toString(36).substring(2, 9),
      name: `field_${fields.length + 1}`,
      type: 'string',
      nullable: false,
      required: true,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, patch: Partial<SimpleField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...patch } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <th className="pb-1.5 font-semibold">Field Name</th>
              <th className="pb-1.5 font-semibold">Type</th>
              <th className="pb-1.5 font-semibold text-center">Req?</th>
              <th className="pb-1.5 font-semibold text-center">Null?</th>
              <th className="pb-1.5 text-right font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {fields.map((field) => (
              <tr key={field.id} className="group">
                <td className="py-1.5 pr-2">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                    placeholder="field_name"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded px-2 py-1 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </td>
                <td className="py-1.5 pr-2">
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="integer">integer</option>
                    <option value="boolean">boolean</option>
                    <option value="array">array</option>
                    <option value="object">object</option>
                  </select>
                </td>
                <td className="py-1.5 text-center">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    title="Required in schema"
                  />
                </td>
                <td className="py-1.5 text-center">
                  <input
                    type="checkbox"
                    checked={field.nullable}
                    onChange={(e) => updateField(field.id, { nullable: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                    title="Allow null value"
                  />
                </td>
                <td className="py-1.5 text-right pl-2">
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="text-slate-600 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 p-1 rounded transition-colors"
                    title="Remove field"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addField}
          className="text-xs py-1 px-2.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Field
        </Button>
        <span className="text-[11px] text-slate-700 dark:text-slate-300">
          Auto-compiling to JSON Schema v7
        </span>
      </div>
    </div>
  );
}
