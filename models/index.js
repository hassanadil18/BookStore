const sequelize = require('../config/db');
const User = require('./user');
const Book = require('./book');

// Initialize models only once
User.initModel(sequelize);
Book.initModel(sequelize);

// Export initialized models and sequelize instance
module.exports = { 
    sequelize,
    User,
    Book,
    initDatabase: async () => {
        try {
            // First test the connection
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            
            // In production, we don't alter the database structure
            if (process.env.NODE_ENV === 'production') {
                // Only verify the connection in production
                return true;
            } else {
                // In development, sync the database
                await sequelize.sync();
                console.log('Database & tables synced');
                return true;
            }
        } catch (err) {
            console.error('Unable to connect to the database:', err);
            throw err; // Re-throw to handle it in the server
        }
    }
};
