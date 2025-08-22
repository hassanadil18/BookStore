require('dotenv').config();
const express = require('express');
const path = require('path');
const { initDatabase } = require('./models');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/books', require('./routes/books'));

app.get('/', (req, res) => {
  res.send('Hello from Vercel + Railway DB');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


module.exports = app;
