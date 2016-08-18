'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    userEmail: DataTypes.STRING,
    userPswd: DataTypes.STRING,
    userFullName: DataTypes.STRING,
    userBirthday: DataTypes.DATE,
    currEvents: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Users;
};