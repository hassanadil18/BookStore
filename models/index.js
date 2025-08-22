const sequelize = require('../config/db');
const User = require('./user');
const Book = require('./book');

User.initModel(sequelize);
Book.initModel(sequelize);

const syncDatabase = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database & tables synced');
    }
  } catch (err) {
    console.error('Unable to sync database:', err);
  }
};

syncDatabase();

module.exports = { sequelize, User, Book };
