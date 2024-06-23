'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project.init({
    judul: DataTypes.STRING,
    startdate: DataTypes.DATE,
    enddate: DataTypes.DATE,
    content: DataTypes.TEXT,
    nodejs: DataTypes.STRING,
    reactjs: DataTypes.STRING,
    nextjs: DataTypes.STRING,
    typescript: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};

