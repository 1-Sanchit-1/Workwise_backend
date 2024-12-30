const express = require("express");
const sequelize = require("./config/db");
const dotenv = require("dotenv");
const Routes = require("../Backend/routers/routes");
const cors = require("cors");
dotenv.config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    (async () => {
      try {
        await sequelize.sync({ alter: false });
        console.log("Database synchronized successfully!");
      } catch (error) {
        console.error("Error synchronizing the database:", error);
      }
    })();
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use("/api", Routes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
