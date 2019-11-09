const express = require('express');

const api = express.Router();

api.get('/', (req, res) => { res.json({ status: 'ok' }); });

module.exports = api;
