const express = require("express");
const router = express.Router();
const { register, loginController } = require("../controllers/AuthController");

//apply middleware for set maximum users execute and api limit to be set.
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  limit: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many request from this IP. Please Try again in an hour",
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});
//Register || post
router.post("/register", register);

//login || post
router.post("/login", limiter, loginController);

module.exports = router;
