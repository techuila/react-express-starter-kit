'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.Type = Users.belongsTo(models.UserTypes, {
        as: 'Type',
        foreignKey: 'user_type_id',
      });
    }
  }
  Users.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_type_id: DataTypes.INTEGER,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      verification_token: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      isEmailAuthenticate: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Users',
      hooks: {
        beforeUpdate: (_record, _options) => {
          _options.validate = false;
        },
        afterValidate: (user) => {
          // console.log('== Password ==');
          // console.log(user.password);
          if (user.password) user.password = bcrypt.hashSync(user.password, 10);
          // console.log(user.password);
        },
      },
    }
  );
  return Users;
};
