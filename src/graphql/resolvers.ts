import { Registry } from "../core/registry.js";
import type { ResolvedSchema, FieldDefinition } from "../schema/resolverSchema.js";
import { createMutations } from "./mutations.js";

export function createResolvers(
  registry: Registry,
  schemas: Map<string, ResolvedSchema>,
  rootDir: string
) {
  const Query: Record<string, any> = {};
  const mutationResolvers =
    createMutations(
      registry,
      schemas,
      rootDir
    );

  // 1. Query resolvers (just return data)
  for (const schema of schemas.values()) {
    const typeName = schema.type;

    Query[typeName] = () => {
      return registry
        .getByType(typeName)
        .map(normalizeNode);
    };
  }

  const resolvers: Record<string, any> = { Query };

  // 2. ONLY relationship resolvers (NOT scalars)
  for (const schema of schemas.values()) {
    resolvers[schema.type] = {
      __resolveReference: (parent: any) => parent,
      ...createRelationshipResolvers(schema, registry)
    };
  }

  return {
    Query,
    ...mutationResolvers
  };
}

function createRelationshipResolvers(
  schema: ResolvedSchema,
  registry: Registry
) {
  const resolvers: Record<string, any> = {};

  for (const [fieldName, fieldSchema] of Object.entries(schema.fields)) {
    const isRelationship = isObjectType(fieldSchema.type);

    if (!isRelationship) continue;

    resolvers[fieldName] = (parent: any) => {
      const value = parent[fieldName];

      if (value == null) return value;

      if (Array.isArray(value)) {
        return value
          .map((v) => resolveReference(v, registry, fieldSchema))
          .filter(Boolean);
      }

      return resolveReference(value, registry, fieldSchema);
    };
  }

  return resolvers;
}

function isObjectType(type: string) {
  return (
    type !== "string" &&
    type !== "number" &&
    type !== "boolean"
  );
}

function resolveReference(
  value: any,
  registry: Registry,
  fieldSchema: FieldDefinition
) {
  if (value?.kmsId) {
    return registry.get(value.kmsId);
  }

  const nodes = registry.getByType(fieldSchema.type);
  const key = fieldSchema.key ?? "id";

  return nodes.find(node => node[key] === value?.[key]) ?? null;
}

function normalizeNode(node: any) {
  const {
    kmsId,
    domainId,
    __type,
    __filePath,
    ...fields
  } = node;

  return {
    kmsId,
    domainId,
    ...fields
  };
}