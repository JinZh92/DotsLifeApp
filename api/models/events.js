'use strict';
module.exports = function(sequelize, DataTypes) {
  var Events = sequelize.define('Events', {
    userEmail: DataTypes.STRING,
    eventTitle: DataTypes.STRING,
    eventDescription: DataTypes.TEXT,
    eventStart: DataTypes.DATE,
    eventExpectedEnd: DataTypes.DATE,
    eventActualEnd: DataTypes.DATE,
    eventHasSkills: DataTypes.ARRAY(DataTypes.INTEGER),
    eventStatus: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Events;
};