const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  uploadAssignment,
  getAllAdmins,
} = require("../controllers/userController");

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Upload assignment
router.post("/upload", uploadAssignment);

// Fetch all admins
router.get("/admins", getAllAdmins);

module.exports = router;
