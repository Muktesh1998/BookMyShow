const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const movieRoute = require("./routes/movieRoute");
const theatreRoute = require("./routes/theatreRoute");
const showRoute = require("./routes/showRoute");
const bookingRoute = require("./routes/bookingRoute");
const errorHandler = require("./middlewares/errorHandler");
const { validateJWTToken } = require("./middlewares/authorizationMiddleware");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path")
const swaggerRouter = require("./swagger");


// Trust the first proxy (Render / reverse proxies)
app.set("trust proxy", 1);

const apiLimited = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  // Avoid strict X-Forwarded-For parsing by using Express's computed IP
  keyGenerator: (req) => req.ip,
  message: "Too Many Request from this IP, please try again after 15 mins",
});

const clientBuildPath = path.join(__dirname, "../Client/dist");
app.use(express.static(clientBuildPath));
// Serve static assets from Server/public (e.g., swagger.css)
app.use(express.static(path.join(__dirname, "public")));

connectDB();
app.use(helmet());

// Custom Content Security Policy (CSP) configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Allows resources from the same origin (https://bookmyshowjune2024.onrender.com)
      scriptSrc: ["'self'"], // Allows scripts from your own domain
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allow Google Fonts CSS
      imgSrc: ["'self'", "data:"], // Allows images from your domain and base64-encoded images
      connectSrc: ["'self'"], // Allows AJAX requests to your own domain
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow Google Fonts files
      objectSrc: ["'none'"], // Disallows <object>, <embed>, and <applet> elements
      upgradeInsecureRequests: [], // Automatically upgrades HTTP requests to HTTPS
    },
  })
);

app.use(express.json());
//app.use(mongoSanitize());
app.use("/bms/", apiLimited);
app.use("/bms/v1/users", userRoute);
app.use("/bms/v1/movies", validateJWTToken, movieRoute);
app.use("/bms/v1/theatres", validateJWTToken, theatreRoute);
app.use("/bms/v1/shows", validateJWTToken, showRoute);
app.use("/bms/v1/bookings", validateJWTToken, bookingRoute);
// Swagger docs
app.use("/bms/docs", swaggerRouter);

app.use(errorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});