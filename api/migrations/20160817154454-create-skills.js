'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Skills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      skillName: {
        type: Sequelize.STRING
      },
      userEmail: {
        type: Sequelize.STRING
      },
      tokensTotal: {
        type: Sequelize.INTEGER
      },
      skillLevel: {
        type: Sequelize.INTEGER
      },
      levelUpDate: {
        type: Sequelize.ARRAY(Sequelize.STRING)
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Skills');
  }
};