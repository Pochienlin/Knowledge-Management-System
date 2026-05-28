import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { scanDatasource } from "./loader/scan.js";
import { resolveSchemas } from "./schema/resolverSchema.js";
import { createResolvers } from "./graphql/resolvers.js";
import { generateTypeDefs } from "./graphql/typeDef.js";
import { fileURLToPath } from 'node:url';
import path from 'path'
import { createMutations } from "./graphql/mutations.js";
import { inferScanDatasource } from "./dataInference/walkSchema.js";
import { writeSchema } from "./dataInference/writeSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  console.log("📦 Bootstrapping datasource...");
  const data_path = path.join(__dirname, "../datasource");

  // ---------------------------------------
  // 1. INFER missing schemas
  // ---------------------------------------
  console.log("🧠 Inferring schemas...");
  const inferred = await inferScanDatasource(data_path);

  for (const schema of inferred.schemas.values()) {
    console.log("📝 Writing schema:", schema.type);
    await writeSchema(schema);
  }

  // ---------------------------------------
  // 2. Scan schema.yaml present
  // ---------------------------------------
  console.log("📦 Scanning datasource...");
  const scanResult = await scanDatasource(data_path);

  // ---------------------------------------
  // 3. Resolve schema inheritance
  // ---------------------------------------
  console.log("🔧 Resolving schemas...");
  const resolvedSchemas = resolveSchemas(scanResult.schemas);

  // ---------------------------------------
  // 4. Build GraphQL
  // ---------------------------------------
  console.log("⚙️ Building typeDefs...");
  for (const schema of resolvedSchemas.values()) {
    for (const [key, field] of Object.entries(schema.fields)) {
      if (!field?.type || typeof field.type !== "string") {
        console.log("BAD FIELD:", schema.type, key, field);
      }
    }
  }
  const typeDefs = generateTypeDefs(resolvedSchemas);

  // ---------------------------------------
  // 5. Registry
  // ---------------------------------------
  const registry = {
    getByType: (type: string) =>
      scanResult.instances.get(type) ?? [],

    get: (id: string) => {
      for (const list of scanResult.instances.values()) {
        const found = list.find((n) => n.kmsId === id);
        if (found) return found;
      }
      return null;
    }
  } as any;

  // ---------------------------------------
  // 6. Resolvers
  // ---------------------------------------
  console.log("🔌 Creating resolvers...");

  const queryAndTypes = createResolvers(
    registry,
    resolvedSchemas,
    data_path
  );

  const mutation = createMutations(
    registry,
    resolvedSchemas,
    data_path
  );

  const resolvers = {
    Query: queryAndTypes.Query,
    Mutation: mutation.Mutation,
    ...Object.fromEntries(
      Object.entries(queryAndTypes)
        .filter(([k]) => k !== "Query")
    )
  };
console.log("========== TYPEDEFS ==========");
console.log(typeDefs);
console.log("================================");
  // ---------------------------------------
  // 7. Start server
  // ---------------------------------------
  console.log("🚀 Starting Apollo Server...");

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });

  console.log(`🔥 GraphQL ready at ${url}`);
}

bootstrap().catch(console.error);