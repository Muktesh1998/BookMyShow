const {
  addShow,
  deleteShow,
  updateShow,
  getAllShowsByTheatre,
  getAllTheatresByMovie,
  getShowById,
} = require("../controllers/showController");

const router = require("express").Router();

/**
 * @openapi
 * /bms/v1/shows/addShow:
 *   post:
 *     summary: Add a new show
 *     tags:
 *       - Shows
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theatreId: { type: string }
 *               movieId: { type: string }
 *               startTime: { type: string, format: date-time }
 *               ticketPrice: { type: number }
 *     responses:
 *       201: { description: Show created }
 */
router.post("/addShow", addShow);
/**
 * @openapi
 * /bms/v1/shows/deleteShow/{showId}:
 *   delete:
 *     summary: Delete a show by ID
 *     tags:
 *       - Shows
 *     parameters:
 *       - in: path
 *         name: showId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Show deleted }
 *       404: { description: Not found }
 */
router.delete("/deleteShow/:showId", deleteShow);
/**
 * @openapi
 * /bms/v1/shows/updateShow:
 *   patch:
 *     summary: Update a show
 *     tags:
 *       - Shows
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               showId: { type: string }
 *               startTime: { type: string, format: date-time }
 *               ticketPrice: { type: number }
 *     responses:
 *       200: { description: Show updated }
 */
router.patch("/updateShow", updateShow);
/**
 * @openapi
 * /bms/v1/shows/getAllShowsByTheatre/{theatreId}:
 *   get:
 *     summary: Get all shows by theatre
 *     tags:
 *       - Shows
 *     parameters:
 *       - in: path
 *         name: theatreId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of shows }
 */
router.get("/getAllShowsByTheatre/:theatreId", getAllShowsByTheatre);
/**
 * @openapi
 * /bms/v1/shows/getAllTheatresByMovie:
 *   post:
 *     summary: Get all theatres showing a movie
 *     tags:
 *       - Shows
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       200: { description: List of theatres }
 */
router.post("/getAllTheatresByMovie", getAllTheatresByMovie);
/**
 * @openapi
 * /bms/v1/shows/getShowById/{showId}:
 *   get:
 *     summary: Get show by ID
 *     tags:
 *       - Shows
 *     parameters:
 *       - in: path
 *         name: showId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Show details }
 *       404: { description: Not found }
 */
router.get("/getShowById/:showId", getShowById);

module.exports = router;
