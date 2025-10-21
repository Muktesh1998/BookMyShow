const {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
} = require("../controllers/movieController");

const router = require("express").Router();

/**
 * @openapi
 * /bms/v1/movies/addMovie:
 *   post:
 *     summary: Add a new movie
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               language: { type: string }
 *               durationMins: { type: number }
 *     responses:
 *       201: { description: Movie created }
 */
router.post("/addMovie", addMovie);
/**
 * @openapi
 * /bms/v1/movies/getAllMovies:
 *   get:
 *     summary: Get all movies
 *     tags:
 *       - Movies
 *     responses:
 *       200: { description: List of movies }
 */
router.get("/getAllMovies", getAllMovies);
/**
 * @openapi
 * /bms/v1/movies/updateMovie:
 *   patch:
 *     summary: Update a movie
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *     responses:
 *       200: { description: Movie updated }
 */
router.patch("/updateMovie", updateMovie);
/**
 * @openapi
 * /bms/v1/movies/deleteMovie/{movieId}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Movie deleted }
 *       404: { description: Not found }
 */
router.delete("/deleteMovie/:movieId", deleteMovie);
/**
 * @openapi
 * /bms/v1/movies/movie/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Movie details }
 *       404: { description: Not found }
 */
router.get("/movie/:id", getMovieById);

module.exports = router;
