const {
  createPaymentIntent,
  makePayment,
  bookShow,
  getAllBookings,
  makePaymentAndBookShow,
} = require("../controllers/bookingController");

const router = require("express").Router();

/**
 * @openapi
 * /bms/v1/bookings/makePayment:
 *   post:
 *     summary: Create a payment intent
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number }
 *               currency: { type: string, example: "INR" }
 *     responses:
 *       200: { description: Payment intent created }
 */
router.post("/makePayment", makePayment);
// Create a PaymentIntent and return client secret
router.post("/createPaymentIntent", createPaymentIntent);
/**
 * @openapi
 * /bms/v1/bookings/bookShow:
 *   post:
 *     summary: Book a show (after payment)
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               showId: { type: string }
 *               seats: { type: array, items: { type: string } }
 *               paymentId: { type: string }
 *     responses:
 *       201: { description: Booking created }
 */
router.post("/bookShow", bookShow);
/**
 * @openapi
 * /bms/v1/bookings/getAllBookings:
 *   get:
 *     summary: Get all bookings for current user
 *     tags:
 *       - Bookings
 *     responses:
 *       200: { description: List of bookings }
 */
router.get("/getAllBookings", getAllBookings);
/**
 * @openapi
 * /bms/v1/bookings/makePaymentAndBookShow:
 *   post:
 *     summary: Make payment and book show in a single call
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               showId: { type: string }
 *               seats: { type: array, items: { type: string } }
 *               amount: { type: number }
 *               currency: { type: string, example: "INR" }
 *     responses:
 *       201: { description: Payment successful and booking created }
 */
router.post("/makePaymentAndBookShow", makePaymentAndBookShow);

module.exports = router;
