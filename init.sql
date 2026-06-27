CREATE TABLE IF NOT EXISTS users (
  rut         TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  birth_date  TEXT NOT NULL,
  city        TEXT NOT NULL,
  hobbies     TEXT[] NOT NULL DEFAULT '{}'
);
