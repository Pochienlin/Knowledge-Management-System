export interface FieldDefinition {
  type: string;
  array: boolean;
  key?: string;
}

export interface ResolvedSchema {
  typeName: string;
  extends?: string;
  fields: Record<string, FieldDefinition>;
}

export interface Entity {
  kmsId: string;
  domainId?: string;
  __filePath: string;
  __type: string;
  [key: string]: unknown;
}

// Added for mutation support
export interface UpdateEntityInput {
  type: string;
  kmsId: string;
  data: Record<string, unknown>;
}
