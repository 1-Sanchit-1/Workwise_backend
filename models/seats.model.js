const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Seat = sequelize.define("Seat", {
  seatNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rowNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Seat;
