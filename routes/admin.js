const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAssignments,
  acceptAssignment,
  rejectAssignment,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/auth");

// Admin registration
router.post("/register", registerAdmin);

// Admin login
router.post("/login", loginAdmin);

// View assignments tagged to the admin
router.get("/assignments", authMiddleware, getAssignments);

// Accept assignment
router.post("/assignments/:id/accept", authMiddleware, acceptAssignment);

// Reject assignment
router.post("/assignments/:id/reject", authMiddleware, rejectAssignment);

module.exports = router;
