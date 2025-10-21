const {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getAllTheatres,
  getAllTheatresByOwner,
} = require("../controllers/theatreController");

const router = require("express").Router();

/**
 * @openapi
 * /bms/v1/theatres/addTheatre:
 *   post:
 *     summary: Add a new theatre
 *     tags:
 *       - Theatres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               ownerId: { type: string }
 *     responses:
 *       201: { description: Theatre created }
 */
router.post("/addTheatre", addTheatre);
/**
 * @openapi
 * /bms/v1/theatres/updateTheatre:
 *   patch:
 *     summary: Update a theatre
 *     tags:
 *       - Theatres
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theatreId: { type: string }
 *               name: { type: string }
 *               address: { type: string }
 *     responses:
 *       200: { description: Theatre updated }
 */
router.patch("/updateTheatre", updateTheatre);
/**
 * @openapi
 * /bms/v1/theatres/deleteTheatre/{theatreId}:
 *   delete:
 *     summary: Delete a theatre by ID
 *     tags:
 *       - Theatres
 *     parameters:
 *       - in: path
 *         name: theatreId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Theatre deleted }
 *       404: { description: Not found }
 */
router.delete("/deleteTheatre/:theatreId", deleteTheatre);
/**
 * @openapi
 * /bms/v1/theatres/getAllTheatres:
 *   get:
 *     summary: Get all theatres
 *     tags:
 *       - Theatres
 *     responses:
 *       200: { description: List of theatres }
 */
router.get("/getAllTheatres", getAllTheatres);
/**
 * @openapi
 * /bms/v1/theatres/getAllTheatresByOwner:
 *   get:
 *     summary: Get theatres by owner (uses auth context)
 *     tags:
 *       - Theatres
 *     responses:
 *       200: { description: List of theatres belonging to current owner }
 */
router.get("/getAllTheatresByOwner", getAllTheatresByOwner);

module.exports = router;
