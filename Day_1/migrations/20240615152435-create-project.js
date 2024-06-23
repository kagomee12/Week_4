'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      judul: {
        type: Sequelize.STRING
      },
      startdate: {
        type: Sequelize.DATE
      },
      enddate: {
        type: Sequelize.DATE
      },
      content: {
        type: Sequelize.TEXT
      },
      nodejs: {
        type: Sequelize.BOOLEAN
      },
      reactjs: {
        type: Sequelize.BOOLEAN
      },
      nextjs: {
        type: Sequelize.BOOLEAN
      },
      typescript: {
        type: Sequelize.BOOLEAN
      },
      
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};