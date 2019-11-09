const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.set('json spaces', 2);

app.listen(8000, () => console.log('Mock server running on port 8000'));
