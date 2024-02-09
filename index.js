const path = require('path');
const express = require('express');

const app = express();

app.use('/static', express.static(path.join(__dirname, 'client/build/static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(3002);