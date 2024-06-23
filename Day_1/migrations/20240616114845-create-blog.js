'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Blogs', {
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
      durasi: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      nodejs: {
        type: Sequelize.STRING
      },
      reactjs: {
        type: Sequelize.STRING
      },
      nextjs: {
        type: Sequelize.STRING
      },
      typescript: {
        type: Sequelize.STRING
      },
      inputimage: {
        type: Sequelize.STRING
      },
      nodejsicon: {
        type: Sequelize.STRING
      },
      reactjsicon: {
        type: Sequelize.STRING
      },
      nextjsicon: {
        type: Sequelize.STRING
      },
      typescripticon: {
        type: Sequelize.STRING
      },
      tglawal: {
        type: Sequelize.STRING
      },
      tglakhir: {
        type: Sequelize.STRING
      },
      nodejstext: {
        type: Sequelize.STRING
      },
      reactjstext: {
        type: Sequelize.STRING
      },
      nextjstext: {
        type: Sequelize.STRING
      },
      typescripttext: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Blogs');
  }
};