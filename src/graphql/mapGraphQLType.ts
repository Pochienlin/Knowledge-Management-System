import type { FieldDefinition } from "../schema/resolverSchema.js";

export function mapGraphQLType(
  field: FieldDefinition,
  input = false
): string {

  const scalarMap: Record<string, string> = {
    string: "String",
    number: "Float",
    boolean: "Boolean"
  };

  const base =
    scalarMap[field.type] ??
    (input ? "String" : field.type);

  return field.array
    ? `[${base}!]`
    : base;
}