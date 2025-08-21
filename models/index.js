const sequelize = require('../config/db');
const User = require('./user');
const Book = require('./book');

let isInitialized = false;

const initDatabase = async () => {
    if (isInitialized) {
        console.log('Database already initialized');
        return true;
    }

    try {
        console.log('Testing database connection...');
        
        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Initialize models
        console.log('Initializing models...');
        User.initModel(sequelize);
        Book.initModel(sequelize);
        
        // Only sync in development
        if (process.env.NODE_ENV !== 'production') {
            console.log('Syncing database in development mode...');
            await sequelize.sync();
            console.log('Database & tables synced');
        }

        isInitialized = true;
        return true;
    } catch (err) {
        console.error('Database initialization error:', err);
        // In production, log error details but don't expose them
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Database connection failed');
        } else {
            throw err;
        }
    }
};

module.exports = { 
    sequelize, 
    User, 
    Book,
    initDatabase 
};
