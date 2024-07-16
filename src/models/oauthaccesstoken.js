'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class oauthAccessToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  oauthAccessToken.init({
    user_id: DataTypes.CHAR(40),
    access_token: DataTypes.TEXT,
    expires_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'oauthAccessToken',
  });
  return oauthAccessToken;
};
