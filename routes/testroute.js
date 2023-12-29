const express = require("express");
const testController = require("../controllers/testController");
const userAuth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/test-route", userAuth, testController);

module.exports = router;
