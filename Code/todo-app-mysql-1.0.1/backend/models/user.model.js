const { sequelize, DataTypes } = require('../config/database');

import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserModel = Schema('user', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  zip: {
    type: DataTypes.INTEGER
  },
  location: {
    type: DataTypes.STRING
  }
});

module.exports = UserModel;
