import type { ResolvedSchema, FieldDefinition } from '../schema/resolverSchema.js';

//--------- This boi is here to help graphql schema specifically -----------
export function generateTypeDefs(
  schemas: Map<string, ResolvedSchema>
): string {
  const typeDefs: string[] = [];

  const queryFields: string[] = [];

  for (const schema of schemas.values()) {
    const fields = Object.entries(schema.fields)
      .map(([key, field]) => {
        return `  ${key}: ${mapType(field, schemas)}`;
      })
      .join("\n");

    typeDefs.push(`
      type ${schema.type} {
        id: ID!
${fields}
      }
    `);

    // IMPORTANT: add Query entry point
    queryFields.push(`  ${schema.type}: [${schema.type}!]!`);
  }

  return `
    type Query {
      _empty: String
${queryFields.join("\n")}
    }

    ${typeDefs.join("\n")}
  `;
}


function mapType(
  field: FieldDefinition,
  schemas: Map<string, ResolvedSchema>
): string {
  const baseType = field.type;

  // If it's a known schema type, keep it as-is
  if (schemas.has(baseType)) {
    return field.array ? `[${baseType}!]` : baseType;
  }

  // Primitive mapping
  const primitiveMap: Record<string, string> = {
    string: "String",
    number: "Float",
    int: "Int",
    boolean: "Boolean",
    id: "ID"
  };

  const gqlType = primitiveMap[baseType] ?? "String";

  return field.array ? `[${gqlType}!]` : gqlType;
}