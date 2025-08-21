require('dotenv').config();
const express = require('express');
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Health check endpoint (put this before database initialization)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Initialize database and models
const { initDatabase } = require('./models');

// Initialize application
async function initializeApp() {
  try {
    console.log('Starting application initialization...');
    
    // Initialize database first
    await initDatabase();
    console.log('Database initialized successfully');
    
    // Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/books', require('./routes/books'));

    // Root route
    app.get('/', (req, res) => {
      res.json({
        message: 'API is running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      });
    });

    // Global error handler - Must be after all routes
    app.use((err, req, res, next) => {
      console.error('Global error handler caught:', err);
      res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
      });
    });

    // Handle 404s
    app.use((req, res) => {
      res.status(404).json({ error: 'Not Found' });
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
