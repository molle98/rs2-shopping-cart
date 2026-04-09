import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as bcrypt from "bcrypt";

export const initDB = async () => {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loginName TEXT,
      passwordHash TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS basket (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      productId INTEGER,
      quantity INTEGER,
      UNIQUE(userId, productId)
    );
  `);

  // seed user
  const passwordHash = await bcrypt.hash("1234", 10);

  await db.run(
    `INSERT OR IGNORE INTO users (id, loginName, passwordHash)
     VALUES (1, 'admin', ?)`,
    [passwordHash],
  );

  // seed products
  await db.run(`
    INSERT OR IGNORE INTO products (id, name, type, description) VALUES
    (1, 'BookOne', 'Books', 'A book'),
    (2, 'GameOne', 'Games', 'A game'),
    (3, 'MusicOne', 'Music', 'A song')
  `);

  return db;
};
