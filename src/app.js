const express = require('express');

const app = express();

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

module.exports = { app, users };
