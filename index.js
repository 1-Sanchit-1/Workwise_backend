const express = require("express");
const sequelize = require("./config/db");
const dotenv = require("dotenv");
const Routes = require("../Backend/routers/routes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    sequelize.sync({ alter: false });
  })
  .catch((err) => console.error("Database connection failed:", err));

app.use("/api", Routes);
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
