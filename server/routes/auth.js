const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// SignUp
router.post("/:type/signup", authController.signup);

// Login
router.post("/:type/login", authController.login);

// Verify Account (Old token-based method - kept for backward compatibility)
router.patch("/:type/verify/:token", authController.verifyToken);

// Verify OTP (New OTP-based method)
router.post("/:type/verify-otp", authController.verifyOTP);

module.exports = router;
