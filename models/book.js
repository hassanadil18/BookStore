const { DataTypes, Model } = require('sequelize');

class Book extends Model {
  static initModel(sequelize) {
    Book.init({
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      pdfUrl: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('available', 'unavailable'),
        defaultValue: 'available'
      }
    }, {
      sequelize,
      modelName: 'Book'
    });
    return Book;
  }
}

module.exports = Book;
