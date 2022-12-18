const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/logoutcontroller");

router.get("/", logoutController.handleLogOut);

module.exports = router;
