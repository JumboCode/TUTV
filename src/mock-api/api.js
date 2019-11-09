const express = require('express');

const api = express.Router({ strict: true });

api.get('/', (req, res) => { res.json({ status: 'ok' }); });


// Returns a summary of all equipment in the TUTV inventory
api.get('/equipment/', (req, res) => {
  res.json([
    // Storage
    {
      name: '32GB SD Card',
      category: { name: 'storage', id: 1, display_name: 'Digital storage' },
      count: 4,
      image: 'https://images.unsplash.com/photo-1499336969384-ebe67b79faa8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=80',
    },
    {
      name: '128GB SD Card',
      category: { name: 'storage', id: 1, display_name: 'Digital storage' },
      count: 3,
      image: 'https://images.unsplash.com/photo-1535786647382-8345dca8e4e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=80',
    },
    // Cameras
    {
      name: 'Canon EOS 5D',
      category: { name: 'cameras', id: 2, display_name: 'Cameras' },
      count: 1,
      image: 'https://www.usa.canon.com/internet/wcm/connect/us/2da6d3de-d2d6-40f7-81c2-231ddda5aa76/eos-5ds-dslr-camera-3q-lens-d.jpg?MOD=AJPERES',
    },
    {
      name: 'Camera',
      category: { name: 'cameras', id: 2, display_name: 'Cameras' },
      count: 1,
      image: 'https://www.usa.canon.com/internet/wcm/connect/us/2da6d3de-d2d6-40f7-81c2-231ddda5aa76/eos-5ds-dslr-camera-3q-lens-d.jpg?MOD=AJPERES',
    },
    // Tripods
    {
      name: 'Tripod',
      category: { name: 'tripods', id: 3, display_name: 'Tripods' },
      count: 3,
    },
    {
      name: 'Another Tripod',
      category: { name: 'tripods', id: 3, display_name: 'Tripods' },
      count: 1,
    },
  ]);
});

module.exports = api;
