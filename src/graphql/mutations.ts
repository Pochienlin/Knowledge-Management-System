import path from "path";
import crypto from "node:crypto";

import fs from "fs-extra";

import { Registry } from "../core/registry.js";
import type { ResolvedSchema } from "../schema/resolverSchema.js";

import { writeEntityFile } from "../persistence/write.js";
import { buildKmsId } from "../core/identity.js";

// we're using this file for mutation (edit) queries
// should change the actual file in the mounted volume

export function createMutations(
  registry: Registry,
  schemas: Map<string, ResolvedSchema>,
  rootDir: string
) {

  const Mutation: Record<string, any> = {};

  for (const schema of schemas.values()) {

    const typeName = schema.type;

    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------

    Mutation[`create${typeName}`] = async (
      _: any,
      { input }: any
    ) => {

      const filename =
        input.domainId ??
        crypto.randomUUID();

      const filePath = path.join(
        schema.directory,
        `${filename}.json`
      );

      const entity = {
        ...input
      };

      await writeEntityFile(
        filePath,
        entity
      );

      return {
        kmsId: buildKmsId({
          rootDir,
          filePath
        }),
        ...entity
      };
    };

    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------

    Mutation[`update${typeName}`] = async (
      _: any,
      {
        kmsId,
        input
      }: {
        kmsId: string;
        input: Record<string, any>;
      }
    ) => {

      const existing =
        registry.get(kmsId);

      if (!existing) {
        throw new Error(
          `Entity not found: ${kmsId}`
        );
      }

      const filePath =
        existing.__filePath;

      // Remove internal system fields
      const {
        kmsId: _kmsId,
        __type,
        __filePath,
        ...persisted
      } = existing;

      const updated = {
        ...persisted,
        ...input
      };

      await fs.writeJson(
        filePath,
        updated,
        { spaces: 2 }
      );

      return {
        kmsId,
        ...updated
      };
    };
  }

  return { Mutation };
}