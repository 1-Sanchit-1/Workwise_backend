const express = require("express");
const sequelize = require("./config/db");
const dotenv = require("dotenv");
const Routes = require("../Backend/routers/routes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
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
    // sequelize.sync(); // Ensure database tables are created
  })
  .catch((err) => console.error("Database connection failed:", err));

app.use("/api", Routes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
