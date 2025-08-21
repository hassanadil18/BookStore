require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Initialize database and models
const { sequelize, initDatabase } = require('./models');

// Initialize routes only after ensuring database connection
async function initializeApp() {
  try {
    // Initialize database
    await initDatabase();
    console.log('Database initialization completed successfully.');

    app.use(express.json());
    
    // Static file serving - commented out for Vercel deployment
    // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/books', require('./routes/books'));

    app.get('/', (req, res) => {
      res.json({
        message: 'API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    });

    const PORT = process.env.PORT || 3000;
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('Unable to start application:', error);
    throw error;
  }
}

// Initialize the application
initializeApp().catch(console.error);

module.exports = app;
