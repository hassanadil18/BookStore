require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Initialize database and models
const { initDatabase } = require('./models');

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize application
async function initializeApp() {
  try {
    // Initialize database first
    await initDatabase();
    
    // Middleware
    app.use(express.json());
    
    // Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/books', require('./routes/books'));

    // Root route
    app.get('/', (req, res) => {
      res.json({
        message: 'API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    });

    // Start server (not needed for Vercel)
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Initialize the app
initializeApp();

module.exports = app;
