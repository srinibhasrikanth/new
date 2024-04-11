const express = require("express");
const mongoose = require("mongoose");
const {
  registerController,
  loginController,
  registerAdminController,
  loginAdminController,
} = require("../controllers/authController");

const router = express.Router();

// Register post method
router.post("/register", registerController);

// Login post method
router.post("/login", loginController);

//admin register method
router.post("/admin-signup", registerAdminController);

//admin login method
router.post("/admin-login", loginAdminController);

module.exports = router;
