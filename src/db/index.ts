import fs from "node:fs";
import path from "node:path";
import { DatabaseSync, type StatementSync } from "node:sqlite";
import { drizzle, type SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { readMigrationFiles } from "drizzle-orm/migrator";
import * as schema from "./schema";
import { seedIfEmpty } from "./seed";

/**
 * Base SQLite via le module natif de Node (node:sqlite, Node ≥ 22.5).
 * Aucun module compilé à installer : idéal pour un hébergement mutualisé (o2switch).
 * Drizzle est branché dessus via son pilote « sqlite-proxy ».
 */

type Method = "run" | "all" | "values" | "get";

function toRows(stmt: StatementSync, params: unknown[], method: Method) {
  const args = params as never[];
  if (method === "run") {
    stmt.run(...args);
    return [];
  }
  // Drizzle attend des lignes sous forme de tableaux (ordre des colonnes)
  const arrayMode = typeof stmt.setReturnArrays === "function";
  if (arrayMode) stmt.setReturnArrays(true);
  if (method === "get") {
    const row = stmt.get(...args);
    if (!row) return undefined;
    return arrayMode ? row : Object.values(row);
  }
  const rows = stmt.all(...args);
  return arrayMode ? rows : rows.map((r) => Object.values(r));
}

function createDb() {
  const file = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "applirepas.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new DatabaseSync(file);
  sqlite.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");

  runMigrations(sqlite);

  const exec = (query: string, params: unknown[], method: Method) =>
    toRows(sqlite.prepare(query), params, method);

  const db = drizzle(
    async (query, params, method) => ({ rows: exec(query, params, method) as never[] }),
    // Les lots s'exécutent dans une transaction (synchrone, donc atomique)
    async (queries) => {
      sqlite.exec("BEGIN");
      try {
        const out = queries.map((q) => ({ rows: exec(q.sql, q.params, q.method) as never[] }));
        sqlite.exec("COMMIT");
        return out;
      } catch (e) {
        sqlite.exec("ROLLBACK");
        throw e;
      }
    },
    { schema },
  );

  seedIfEmpty(sqlite);
  return { db, sqlite };
}

function runMigrations(sqlite: DatabaseSync) {
  const migrationsFolder = process.env.MIGRATIONS_PATH ?? path.join(process.cwd(), "drizzle");
  const migrations = readMigrationFiles({ migrationsFolder });
  sqlite.exec(
    "CREATE TABLE IF NOT EXISTS __drizzle_migrations (id INTEGER PRIMARY KEY, hash TEXT NOT NULL, created_at NUMERIC)",
  );
  const last = sqlite
    .prepare("SELECT created_at FROM __drizzle_migrations ORDER BY created_at DESC LIMIT 1")
    .get() as { created_at: number } | undefined;
  for (const m of migrations) {
    if (last && Number(last.created_at) >= m.folderMillis) continue;
    sqlite.exec("BEGIN");
    try {
      for (const stmt of m.sql) if (stmt.trim()) sqlite.exec(stmt);
      sqlite
        .prepare("INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)")
        .run(m.hash, m.folderMillis);
      sqlite.exec("COMMIT");
    } catch (e) {
      sqlite.exec("ROLLBACK");
      throw e;
    }
  }
}

const globalForDb = globalThis as unknown as {
  __applirepas?: { db: SqliteRemoteDatabase<typeof schema>; sqlite: DatabaseSync };
};

function instance() {
  if (!globalForDb.__applirepas) globalForDb.__applirepas = createDb();
  return globalForDb.__applirepas;
}

/** Connexion Drizzle (initialisée au premier appel : migrations + données de départ). */
export const db = new Proxy({} as SqliteRemoteDatabase<typeof schema>, {
  get(_t, prop) {
    const target = instance().db;
    const value = Reflect.get(target, prop, target);
    return typeof value === "function" ? value.bind(target) : value;
  },
});

export { schema };
