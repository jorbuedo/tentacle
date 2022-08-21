CREATE TABLE IF NOT EXISTS priceHistory (
  pair TEXT,
  time REAL,
  price REAL,
  PRIMARY KEY (pair, time)
);