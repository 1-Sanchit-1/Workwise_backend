// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     logging: false,
//   }
// );

// module.exports = sequelize;
const { Sequelize } = require("sequelize");
require("dotenv").config();
const { parse } = require("pg-connection-string");

// Parse the DATABASE_URL provided by Vercel
const config = parse(process.env.DATABASE_URL);

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true, // Ensure SSL is used
      rejectUnauthorized: false, // Disable certificate verification
    },
  },
});

module.exports = sequelize;
