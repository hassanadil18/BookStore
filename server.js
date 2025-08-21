require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

require('./models');
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/books', require('./routes/books'));

app.get('/', (req, res) => {
  res.send('Hello from Vercel + Railway DB');
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'vercel') {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}

module.exports = app;
