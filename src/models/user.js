'use strict';
const {
  Model
} = require('sequelize');
const uuid = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.ENUM('active', 'deactivated'),
    email_verified_at: DataTypes.DATE,
    phone_verified_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {exclude: ['password']}
    },
    hooks: {
      beforeCreate : (record, options) => {
        record.dataValues.id = `usr-${uuid.v4()}`;
      }
    }
  });
  return User;
};