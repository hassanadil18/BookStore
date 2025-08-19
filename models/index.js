const sequelize = require('../config/db');
const User = require('./user');
const Book = require('./book');

User.initModel(sequelize);
Book.initModel(sequelize);

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database & tables synced');
  } catch (err) {
    console.error('DB sync error:', err);
  }
})();

module.exports = { sequelize, User, Book };
