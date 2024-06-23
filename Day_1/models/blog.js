'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog.init({
    judul: DataTypes.STRING,
    startdate: DataTypes.DATE,
    enddate: DataTypes.DATE,
    durasi: DataTypes.STRING,
    content: DataTypes.TEXT,
    nodejs: DataTypes.STRING,
    reactjs: DataTypes.STRING,
    nextjs: DataTypes.STRING,
    typescript: DataTypes.STRING,
    inputimage: DataTypes.STRING,
    nodejsicon: DataTypes.STRING,
    reactjsicon: DataTypes.STRING,
    nextjsicon: DataTypes.STRING,
    typescripticon: DataTypes.STRING,
    tglawal: DataTypes.STRING,
    tglakhir: DataTypes.STRING,
    nodejstext: DataTypes.STRING,
    reactjstext: DataTypes.STRING,
    nextjstext: DataTypes.STRING,
    typescripttext: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};