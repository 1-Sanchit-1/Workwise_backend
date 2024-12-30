const Seat = require("../models/seats.model");
const User = require("../models/user.model");

// Controller function to book seats
const bookingController = async (req, res) => {
  try {
    const { numOfSeats } = req.body;
    const userId = req.user.id;
    // Validate input
    if (!numOfSeats || numOfSeats <= 0) {
      return res.status(400).json({
        message: "Please provide a valid number of seats to book",
      });
    }

    if (numOfSeats > 7) {
      return res.status(400).json({
        message: "Cannot book more than 7 seats at once",
      });
    }

    // Find available seats
    const availableSeats = await Seat.findAll({
      where: { isBooked: false },
      order: [
        ["rowNumber", "ASC"],
        ["seatNumber", "ASC"],
      ],
    });

    if (availableSeats.length < numOfSeats) {
      return res.status(400).json({
        message: `${availableSeats.length} seats available.`,
      });
    }

    // Try to find seats in the same row first
    let bookedSeats = [];
    let seatsToBook = numOfSeats;

    for (let row = 1; row <= 12; row++) {
      const rowSeats = availableSeats.filter((seat) => seat.rowNumber === row);

      if (rowSeats.length >= seatsToBook) {
        bookedSeats = rowSeats.slice(0, seatsToBook);
        break;
      }
    }

    // If we couldn't find seats in the same row, book nearby seats
    if (bookedSeats.length === 0) {
      bookedSeats = availableSeats.slice(0, seatsToBook);
    }

    // Start a transaction to ensure data consistency
    const transaction = await Seat.sequelize.transaction();

    try {
      // Mark seats as booked
      for (let seat of bookedSeats) {
        await Seat.update(
          {
            isBooked: true,
            userId: userId,
          },
          {
            where: {
              id: seat.id,
              isBooked: false, // Double-check seat is still available
            },
            transaction,
          }
        );
      }

      // Update user's booking history
      const user = await User.findByPk(userId);
      const userBookings = user.bookings;

      userBookings.push({
        date: new Date(),
        seats: bookedSeats.map((seat) => ({
          id: seat.id,
          rowNumber: seat.rowNumber,
          seatNumber: seat.seatNumber,
        })),
      });
      // console.log(userBookings);
      await user.update({ bookings: userBookings }, { transaction });
      // console.log(user.bookings);
      // await user.reload();
      // Commit the transaction
      await transaction.commit();

      return res.status(200).json({
        message: "Seats booked successfully",
        bookedSeats: bookedSeats.map((seat) => ({
          id: seat.id,
          rowNumber: seat.rowNumber,
          seatNumber: seat.seatNumber,
        })),
      });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all seats
const getSeats = async (req, res) => {
  try {
    const seats = await Seat.findAll({
      order: [
        ["rowNumber", "ASC"],
        ["seatNumber", "ASC"],
      ],
    });
    return res.status(200).json({ seats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetSeatsController = async (req, res) => {
  try {
    await Seat.destroy({ where: {} });
    const totalRows = 12;
    const seatsPerRow = 7;

    const seats = [];
    for (let row = 1; row <= totalRows; row++) {
      const rowSeats = row === totalRows ? 80 % seatsPerRow : seatsPerRow;
      for (let seatNumber = 1; seatNumber <= rowSeats; seatNumber++) {
        seats.push({
          seatNumber: (row - 1) * seatsPerRow + seatNumber,
          rowNumber: row,
          isBooked: false,
        });
      }
    }

    await Seat.bulkCreate(seats);
    return res.status(200).json({ message: "Seats reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { bookingController, resetSeatsController, getSeats };
