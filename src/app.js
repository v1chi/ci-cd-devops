const express = require('express');
const db = require('./db');

const app = express();

app.use(express.json());

const USER_COLUMNS = 'name, rut, birth_date AS "birthDate", city, hobbies';

app.get('/users', async (req, res) => {
  const result = await db.query(`SELECT ${USER_COLUMNS} FROM users`);
  res.status(200).json(result.rows);
});

app.post('/users', async (req, res) => {
  const { name, rut, birthDate, city, hobbies } = req.body;

  if (!name || !rut || !birthDate || !city || !hobbies) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const existing = await db.query('SELECT 1 FROM users WHERE rut = $1', [rut]);
  if (existing.rowCount > 0) {
    return res.status(409).json({ message: 'User with this RUT already exists' });
  }

  const result = await db.query(
    `INSERT INTO users (name, rut, birth_date, city, hobbies)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${USER_COLUMNS}`,
    [name, rut, birthDate, city, hobbies]
  );
  res.status(201).json(result.rows[0]);
});

app.delete('/users/:rut', async (req, res) => {
  const { rut } = req.params;
  const result = await db.query(
    `DELETE FROM users WHERE rut = $1 RETURNING ${USER_COLUMNS}`,
    [rut]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(result.rows[0]);
});

module.exports = { app };
