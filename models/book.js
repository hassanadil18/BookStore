const { DataTypes, Model } = require('sequelize');

class Book extends Model {
  static initModel(sequelize) {
    Book.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      pdfUrl: { type: DataTypes.STRING },
      status: {
        type: DataTypes.ENUM('available', 'unavailable'),
        defaultValue: 'available',
      },
    }, {
      sequelize,
      modelName: 'Book',
      tableName: 'books',
    });
  }
}

module.exports = Book;
