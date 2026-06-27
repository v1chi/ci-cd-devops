const express = require('express');

const app = express();

app.use(express.json());

const users = [];

module.exports = { app, users };
