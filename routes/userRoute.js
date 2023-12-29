const express = require("express");

const userAuth = require("../middleware/authMiddleware");
const UpdateUser = require("../controllers/UserController");
const router = express.Router();

router.put("/Update_user", userAuth, UpdateUser);

module.exports = router;
