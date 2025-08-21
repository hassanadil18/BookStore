const sequelize = require('../config/db');
const User = require('./user');
const Book = require('./book');

User.initModel(sequelize);
Book.initModel(sequelize);

User.initModel(sequelize);
Book.initModel(sequelize);

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database & tables synced');
    }
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

// Run sync
syncDatabase();

module.exports = { sequelize, User, Book };
