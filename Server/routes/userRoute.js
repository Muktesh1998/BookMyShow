const {
  registerUser,
  loginUser,
  currentUser,
  forgetPassword,
  resetPassword,
  logoutUser,
} = require("../controllers/UserController");
const { validateJWTToken } = require("../middlewares/authorizationMiddleware");

const router = require("express").Router();

/**
 * @openapi
 * /bms/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
router.post("/register", registerUser);
/**
 * @openapi
 * /bms/v1/users/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Users
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Logged in
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);
router.post("/logout", logoutUser);
/**
 * @openapi
 * /bms/v1/users/getCurrentUser:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Current user details
 *       401:
 *         description: Unauthorized
 */
router.get("/getCurrentUser", validateJWTToken, currentUser);
/**
 * @openapi
 * /bms/v1/users/forgetPassword:
 *   post:
 *     summary: Initiate password reset
 *     tags:
 *       - Users
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset initiated
 *       404:
 *         description: User not found
 */
router.post("/forgetPassword", forgetPassword);
/**
 * @openapi
 * /bms/v1/users/resetPassword:
 *   post:
 *     summary: Reset password using token/OTP
 *     tags:
 *       - Users
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/resetPassword", resetPassword);

module.exports = router;
