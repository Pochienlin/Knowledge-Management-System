# 🧠 Knowledge Management System (KMS) — GraphQL File Adapter

A filesystem-native knowledge graph that converts structured folders (`/datasource`) into a fully queryable GraphQL API using Apollo Server.

It supports **schema-driven ingestion**, **relationship resolution**, and **live filesystem syncing (via chokidar)**.

---

# ✨ Core Idea

This system treats a folder of files as a database:
/datasource
    /cables
    schema.yaml
    1303.json
    1304.json

    /landing-points
    schema.yaml
    9846.json


Each folder defines a **type**, and each file defines an **instance**.

The GraphQL server is generated dynamically from this structure.

---

# 🚀 Features

- 📁 Filesystem → GraphQL auto-mapping
- 🧠 Schema-driven type system (`schema.yaml`)
- 🔗 Relationship resolution between entities
- 🔄 Live sync (via chokidar, if enabled)
- 🧩 Supports JSON, YAML, Markdown
- 🪶 Lightweight Apollo Server integration
- 🧬 Extensible schema inheritance (`extends`)

---

# 📦 Supported File Types

## Data files

| Format | Description |
|--------|------------|
| `.json` | Primary structured data format |
| `.yaml / .yml` | Alternative structured data |
| `.md` | Markdown content (stored as `{ content }`) |

---

## Schema files

Each folder MAY contain:

schema.yaml

This defines the type for all files in that folder.

---

# 📘 schema.yaml Specification

Example:

```yaml
type: SubseaCable

extends: CableBase  # optional

fields:
  name: string
  rfs: string
  length: string
  owners: string
  url: string
  notes: string

  landingPoints:
    type: LandingPoint
    array: true
    key: id
```

# Field Definition Rules

Fields can be defined in two ways:

## 1. Simple scalar
`name: string
`
Interpreted as:

`{ type: "string", array: false, key: "id" }`

## 2. Structured field
```YAML
landingPoints:
  type: LandingPoint
  array: true
  key: id
```

| Property | Meaning                            |
| -------- | ---------------------------------- |
| `type`   | Target schema type                 |
| `array`  | Whether relationship is list       |
| `key`    | Field used for matching references |

# 🧬 Identity System

Each entity is assigned:

- kmsId → system-wide unique ID (path-based)
- domainId → optional external/native ID

Example:
```Typescript
kmsId: "cables/1303"
domainId: "1303"
```
----
# 🧠 GraphQL Schema Generation

GraphQL types are generated from schema.yaml:

Example:
```Typescript
type SubseaCable {
  kmsId: ID!
  domainId: String
  name: String!
  rfs: String!
  length: String!
  owners: String!
  url: String!
  notes: String
  landingPoints: [LandingPoint]
}
```

---

# 🔁 Relationship Resolution

If a field references another type:
```YAML
landingPoints:
  type: LandingPoint
```
The system resolves:

`kmsId` references
or `key` field matches `(default: id)`

----

# 🧱 Architecture Overview
1. `scan.ts`
Purpose: filesystem ingestion layer
- Recursively walks `/datasource`
- Reads `schema.yaml`
- Parses JSON/YAML/MD files
- Builds:
    - schemas
    - instances

--------
2. `resolverSchema.ts`
Purpose: schema normalization + inheritance
- Parses `schema.yaml` fields
- Resolves inheritance (`extends`)
- Converts fields → `FieldDefinition`
- Produces `ResolvedSchema`

-------
3. `registry.ts`
Purpose: in-memory data store

- Stores all entities grouped by type
- Provides:
    - `getByType(type)`
    - `get(kmsId)`
- Acts as query layer for GraphQL

---------
4. `resolvers.ts`
Purpose: GraphQL execution layer
Handles:
- Query resolvers
    - Returns all entities of a type
- Relationship resolvers
    - Resolves linked entities via registry lookup
- normalizeNode
    - Strips system metadata (`__filePath`, etc.)

-------
5. `typeDef.ts`
Purpose: GraphQL schema generator
- Converts ResolvedSchema → GraphQL SDL
- Maps field definitions → GraphQL types
- Handles arrays and relationships

--------
6. `identity.ts`
Purpose: system-wide identity generation
- Generates kmsId from file path
- Ensures deterministic IDs

--------
# ⚙️ Running the Project
1. Install dependencies
```bash
npm install
```
2. Start development server
```bash
npm run dev
```
3. Example query
```GraphQL
query {
  SubseaCable {
    name
    length
    landingPoints {
      name
      latitude
    }
  }
}
```
4. Example curl 
```bash 
curl -X POST http://localhost:4000/ \
  -H "Content-Type: application/json" \
  -d '{"query":"query { SubseaCable { name length } }"}'
```

----------
# 🧭 Future Improvements
- 🔄 Chokidar live sync
- 🧠 schema validation layer
- 🔍 full-text search indexing
- 🧩 computed fields in schema
- 🌐 federation-ready GraphQL layering