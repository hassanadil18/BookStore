const sequelize = require('../config/db'); 
const User = require('./user');
const Book = require('./book');

User.initModel(sequelize);
Book.initModel(sequelize);

// User.hasMany(Book, { foreignKey: 'userId' });
// Book.belongsTo(User, { foreignKey: 'userId' });

const initDatabase = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database & tables synced');
    }
  } catch (err) {
    console.error('Unable to sync database:', err);
  }
};

module.exports = { sequelize, User, Book, initDatabase };
