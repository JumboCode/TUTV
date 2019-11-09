const express = require('express');
const { equipment } = require('./equipment-list');

const api = express.Router({ strict: true });

api.get('/', (req, res) => { res.json({ status: 'ok' }); });


// Returns a summary of all equipment in the TUTV inventory
api.get('/equipment/', (req, res) => {
  res.json(equipment);
});

module.exports = api;
