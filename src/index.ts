import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { scanDatasource } from "./loader/scan.js";
import { resolveSchemas } from "./schema/resolverSchema.js";
import { createResolvers } from "./graphql/resolvers.js";
import { generateTypeDefs } from "./graphql/typeDef.js";
import { fileURLToPath } from 'node:url';
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  console.log("📦 Scanning datasource...");
  const data_path = path.join(__dirname, '../datasource')
  console.log(`Datasource path: ${data_path}`)
  const scanResult = await scanDatasource(data_path);

  console.log("🧠 Resolving schemas...");
  const resolvedSchemas = resolveSchemas(scanResult.schemas);

  console.log("⚙️ Building typeDefs...");
  const typeDefs = generateTypeDefs(resolvedSchemas);

  console.log("🔌 Creating resolvers...");
  const resolvers = createResolvers(
    {
      // minimal registry adapter for now
      getByType: (type: string) => scanResult.instances.get(type) ?? [],
      get: (id: string) => {
        for (const list of scanResult.instances.values()) {
          const found = list.find((n) => n.kmsId === id);
          if (found) return found;
        }
        return null;
      }
    } as any,
    resolvedSchemas
  );

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