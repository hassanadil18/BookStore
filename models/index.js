const sequelize = require('../config/db');
const User = require('./user');
const Book = require('./book');

// Initialize models only once
User.initModel(sequelize);
Book.initModel(sequelize);

const initDatabase = async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Only sync in development
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync();
            console.log('Database & tables synced');
        }
        return true;
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        throw err;
    }
};

module.exports = { 
    sequelize, 
    User, 
    Book,
    initDatabase 
};
