import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = open({
  filename: "./database.sqlite",
  driver: sqlite3.Database,
});

(async () => {
  const database = await db;
  await database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending', 'in_progress', 'done')) NOT NULL
    );
  `);
})();
