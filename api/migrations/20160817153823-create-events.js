'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userEmail: {
        type: Sequelize.STRING
      },
      eventTitle: {
        type: Sequelize.STRING
      },
      eventDescription: {
        type: Sequelize.TEXT
      },
      eventStart: {
        type: Sequelize.DATE
      },
      eventExpectedEnd: {
        type: Sequelize.DATE
      },
      eventActualEnd: {
        type: Sequelize.DATE
      },
      eventHasSkills: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      eventStatus: {
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Events');
  }
};