import { DB } from 'https://deno.land/x/sqlite/mod.ts'

try {
    await Deno.remove('atlas.db')
  } catch {
    // nothing to remove
  }

const db = new DB('./atlas.db')

await db.query(`CREATE TABLE countries (
                country_id INTEGER PRIMARY KEY AUTOINCREMENT,
                country_name TEXT UNIQUE NOT NULL,
                capital TEXT NOT NULL,
                created_at DATETIME NOT NULL
                )`)

await db.query(`CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_encrypted TEXT NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME NOT NULL
                )`)

await db.query(`CREATE TABLE salts (
                salt_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                salt TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )`)

await db.query(`CREATE TABLE sessions (
                uuid TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at DATETIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )`)


await db.query(`CREATE TABLE current_games (
                game_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                played_countries TEXT,
                score INTEGER DEFAULT 0,
                created_at DATETIME NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
                )`)

await db.query(`CREATE TABLE finished_games (
                fin_game_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                score INTEGER DEFAULT 0,
                created_at DATETIME NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
                )`)                

