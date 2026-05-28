import type {
  ResolvedSchema,
  FieldDefinition
} from "../schema/resolverSchema.js";

//--------- GraphQL SDL Generator -----------

export function generateTypeDefs(
  schemas: Map<string, ResolvedSchema>
): string {

  const typeDefs: string[] = [];
  const inputDefs: string[] = [];
  const queryFields: string[] = [];

  for (const schema of schemas.values()) {

    // ----------------------------
    // GraphQL Object Type
    // ----------------------------

    const fields = Object.entries(schema.fields)
      .map(([key, field]) => {
        return `  ${key}: ${mapGraphQLType(
          field,
          schemas,
          false
        )}`;
      })
      .join("\n");

    typeDefs.push(`
      type ${schema.type} {
        kmsId: ID!
        domainId: String
${fields}
      }
    `);

    // ----------------------------
    // Query
    // ----------------------------

    queryFields.push(
      `  ${schema.type}: [${schema.type}!]!`
    );

    // ----------------------------
    // Input Types
    // ----------------------------

    inputDefs.push(
      generateInputType(schema, schemas)
    );
  }

  // ----------------------------
  // Mutation Definitions
  // ----------------------------

  const mutationDefs =
    generateMutationDefs(schemas);

  return `
    type Query {
${queryFields.join("\n")}
    }

    ${mutationDefs}

    ${typeDefs.join("\n")}

    ${inputDefs.join("\n")}
  `;
}

// --------------------------------------------------
// INPUT TYPE GENERATION
// --------------------------------------------------

function generateInputType(
  schema: ResolvedSchema,
  schemas: Map<string, ResolvedSchema>
): string {

  const fields = Object.entries(schema.fields)

    // MVP:
    // only allow scalar fields for writes
    .filter(([_, field]) => {
      return isScalar(field.type);
    })

    .map(([key, field]) => {
      return `  ${key}: ${mapGraphQLType(
        field,
        schemas,
        true
      )}`;
    })

    .join("\n");

  return `
    input ${schema.type}Input {
${fields}
    }
  `;
}

// --------------------------------------------------
// MUTATION GENERATION
// --------------------------------------------------

function generateMutationDefs(
  schemas: Map<string, ResolvedSchema>
): string {

  const fields = Array.from(
    schemas.values()
  )
    .map(schema => {
      return `
        create${schema.type}(
          input: ${schema.type}Input!
        ): ${schema.type}

        update${schema.type}(
          kmsId: ID!
          input: ${schema.type}Input!
        ): ${schema.type}
      `;
    })
    .join("\n");

  return `
    type Mutation {
${fields}
    }
  `;
}

// --------------------------------------------------
// TYPE MAPPING
// --------------------------------------------------

function mapGraphQLType(
  field: FieldDefinition,
  schemas: Map<string, ResolvedSchema>,
  input = false
): string {

  const primitiveMap: Record<string, string> = {
    string: "String",
    number: "Float",
    int: "Int",
    boolean: "Boolean",
    id: "ID"
  };

  // Relationship field
  if (schemas.has(field.type)) {

    // Inputs should not accept nested objects
    if (input) {
      return field.array
        ? "[String!]"
        : "String";
    }

    return field.array
      ? `[${field.type}!]`
      : field.type;
  }

  // Primitive field
  const gqlType =
    primitiveMap[field.type] ?? "String";

  return field.array
    ? `[${gqlType}!]`
    : gqlType;
}

// --------------------------------------------------
// SCALAR CHECK
// --------------------------------------------------

function isScalar(type: string) {
  return [
    "string",
    "number",
    "int",
    "boolean",
    "id"
  ].includes(type);
}