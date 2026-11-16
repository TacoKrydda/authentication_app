import Database, { type Database as DatabaseType } from "better-sqlite3";

const db: DatabaseType = new Database("./data/database.db");

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    createdAt TEXT
  )`);

export default db;
