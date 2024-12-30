const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Email already exists",
    },
    validate: {
      notEmpty: {
        msg: "Email cannot be empty",
      },
      isEmail: {
        msg: "Please provide a valid email",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING, // 'admin' or 'user'
    defaultValue: "user",
  },
  bookings: {
    type: DataTypes.JSON, // Stores seat bookings as JSON
    defaultValue: [],
  },
});

module.exports = User;
