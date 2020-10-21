const express = require('express');
const app = express();

const apiRoutes = require('./api');

// App config
app.enable('strict routing');
app.set('json spaces', 2);

// API routes
app.use('/api/v1', apiRoutes);

// 404 handler
app.use((req, res, next) => {
  if (req.path.startsWith('/api/v1')) res.status(404).json({ error: `route ${req.path} was not found` });
  else res.status(404).json({ error: "all API routes should be prefixed with '/api/v1'" });
});

app.listen(8000, () => console.log('Mock server running on port 8000'));
