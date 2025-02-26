import { Database } from "sqlite";

export async function insertOrReplaceJson(
  db: Database,
  key: string,
  value: string
) {
  return db.run(
    "INSERT OR REPLACE INTO json_storage (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)",
    [key, value]
  );
}

export async function getJson(db: Database, key: string) {
  return db.get("SELECT value FROM json_storage WHERE key = ?", [key]);
}

export async function deleteJson(db: Database, key: string) {
  return db.run("DELETE FROM json_storage WHERE key = ?", [key]);
}

export async function getMetadata(db: Database) {
  return db.get(
    "SELECT COUNT(*) AS totalCollections, SUM(LENGTH(value)) AS totalSize, MIN(createdAt) AS createdAt, MAX(updatedAt) AS updatedAt FROM json_storage"
  );
}

export async function insertApiKey(
  db: Database,
  key: string,
  rateLimit: number
) {
  return db.run("INSERT INTO api_keys (key, rateLimit) VALUES (?, ?)", [
    key,
    rateLimit,
  ]);
}

export async function deleteApiKey(db: Database, key: string) {
  return db.run("DELETE FROM api_keys WHERE key = ?", [key]);
}

export async function getApiKey(db: Database, key: string) {
  return db.get("SELECT key, rateLimit FROM api_keys WHERE key = ?", [key]);
}
