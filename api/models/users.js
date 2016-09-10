'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    userEmail: {type: DataTypes.STRING, unique: true},
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