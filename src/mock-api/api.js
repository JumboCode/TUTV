const express = require('express');
const { equipment } = require('./equipment-list');

const api = express.Router({ strict: true });

api.get('/', (req, res) => { res.json({ status: 'ok' }); });


// Returns a summary of all equipment in the TUTV inventory
api.get('/equipment/', (req, res) => {
  res.json(equipment);
});

// Returns a filtered set of all equipment in the TUTV inventory (search for a string and/or filter
// by date)
api.get('/equipment/search', (req, res) => {
  let items = equipment.map((item) => ({ ...item, available_count: item.total_count }));
  const { q, startDate, endDate } = req.query;

  // Filtering by date - change available_count
  if (startDate || endDate) {
    items = items.map((item) => ({ ...item, available_count: Math.round(Math.random() * item.total_count) }));
  }
  // Text search (search category and name for a match)
  if (q) {
    items = items.filter(
      ({ name: n, category: c }) => (n + c.name + c.display_name).toLowerCase().includes(q.toLowerCase())
    );
  }

  return res.json(items);
});

module.exports = api;
