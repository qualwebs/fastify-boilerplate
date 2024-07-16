'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailOtp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmailOtp.init({
    email: DataTypes.STRING,
    otp: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EmailOtp',
  });
  return EmailOtp;
};