const express = require('express');

const app = express();

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.post('/users', (req, res) => {
  const { name, rut, birthDate, city } = req.body;

  if (!name || !rut || !birthDate || !city) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const exists = users.find(u => u.rut === rut);
  if (exists) {
    return res.status(409).json({ message: 'User with this RUT already exists' });
  }

  const newUser = { name, rut, birthDate, city };
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = { app, users };
