import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const db = new Database(path.join(dataDir, 'sarrafi.db'));

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize Schema
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      balance REAL DEFAULT 0,
      status TEXT DEFAULT 'active', -- active, inactive
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      type TEXT NOT NULL, -- win (برد), receipt (رسید), buy (خرید), sell (فروش)
      amount REAL NOT NULL,
      rate REAL DEFAULT 1,
      total REAL NOT NULL,
      fee1 REAL DEFAULT 0,
      fee2 REAL DEFAULT 0,
      profit REAL DEFAULT 0,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );
    
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
  
  // Seed admin password if not exists (default: admin123)
  const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
  if (!stmt.get('admin_password')) {
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('admin_password', 'admin123');
  }
};

initDb();

export default db;
