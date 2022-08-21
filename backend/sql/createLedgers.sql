CREATE TABLE IF NOT EXISTS ledgers (
  id TEXT PRIMARY KEY,
  refid TEXT NOT NULL,
  time REAL NOT NULL,
  type TEXT NOT NULL,
  subtype TEXT NOT NULL,
  aclass TEXT NOT NULL,
  asset TEXT NOT NULL,
  amount REAL NOT NULL,
  fee REAL NOT NULL,
  balance REAL NOT NULL
);