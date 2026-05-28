import type { SchemaDefinition } from '../loader/scan.js';
// ------------- This boi resolves inheritance and understands them schema.yaml files inside the datasource folder
export type ResolvedSchema = {
  type: string;
  extends?: string;
  directory: string;
  fields: Record<string, FieldDefinition>;
};

export type FieldDefinition = {
  type: string;
  array?: boolean;
  key?: string;
};

export function resolveSchemas(
  schemas: Map<string, SchemaDefinition>
): Map<string, ResolvedSchema> {
  const resolved = new Map<string, ResolvedSchema>();

  function resolveOne(type: string): ResolvedSchema {
    // Already resolved
    if (resolved.has(type)) {
      return resolved.get(type)!;
    }

    const schema = schemas.get(type);
    if (!schema) {
      throw new Error(`Schema not found for type: ${type}`);
    }

    let mergedFields: Record<string, FieldDefinition> = {}

    // Resolve parent first
    if (schema.extends) {
      const parent = resolveOne(schema.extends);

      mergedFields = {
        ...parent.fields
      };
    }

    // Merge current fields (override parent if needed)
    mergedFields = {
      ...mergedFields,
      ...schema.fields
    };

    const finalSchema: ResolvedSchema = {
        type: schema.type,
        fields: mergedFields,
        directory: schema.directory,
        ...(schema.extends ? { extends: schema.extends } : {})
    };

    resolved.set(type, finalSchema);
    return finalSchema;
  }

  // Resolve all schemas
  for (const type of schemas.keys()) {
    resolveOne(type);
  }

  return resolved;
}