import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

const DB_PATH = process.env.DB_PATH || "./database.sqlite";

export async function initializeDB() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS json_storage (
        key TEXT PRIMARY KEY,          -- Resource key
        value TEXT,                    -- JSON data
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        createdBy TEXT                 -- User ID of the creator
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
        key TEXT PRIMARY KEY,          -- API key (JWT)
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        rateLimit INTEGER DEFAULT ${process.env.DEFAULT_RATE_LIMIT || 100},
        role TEXT DEFAULT 'user',      -- 'admin' or 'user'
        userId TEXT                    -- Unique identifier for the user
    )
  `);

  console.log("Connected to SQLite database");
  return db;
}
