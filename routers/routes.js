const express = require("express");
const {
  signupController,
  loginController,
} = require("../controllers/auth.controller.js");
const {
  bookingController,
  resetSeatsController,
  getSeats,
} = require("../controllers/seats.controller.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);

router.get("/seats", authMiddleware(), getSeats);
router.post(
  "/seats/book",
  authMiddleware(["user", "admin"]),
  bookingController
);
router.post("/seats/reset", authMiddleware(["admin"]), resetSeatsController);

module.exports = router;
