'use strict';
module.exports = function(sequelize, DataTypes) {
  var Skills = sequelize.define('Skills', {
    skillName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    tokensTotal: DataTypes.INTEGER,
    skillLevel: DataTypes.INTEGER,
    levelUpDate: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Skills;
};