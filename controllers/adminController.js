const Assignment = require("../models/assignmentModel");
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Helper function for input validation
const validateInput = (inputs, res) => {
  const { username, password } = inputs;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }
};

// Admin registration
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  const validationError = validateInput(req.body, res);
  if (validationError) return;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(409).json({ error: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering admin" });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  const validationError = validateInput(req.body, res);
  if (validationError) return;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Creating token with admin ID included
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, adminId: admin._id }); // returns adminId along with token
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// Fetch assignments tagged to the admin
const getAssignments = async (req, res) => {
  const adminId = req.admin.id;

  try {
    const assignments = await Assignment.find({ admin: adminId });
    if (!assignments || assignments.length === 0) {
      return res
        .status(404)
        .json({ error: "No assignments found for this admin" });
    }

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching assignments" });
  }
};

// Accept assignment
const acceptAssignment = async (req, res) => {
  const assignmentId = req.params.id;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    assignment.status = "accepted";
    await assignment.save();

    res.json({ message: "Assignment accepted" });
  } catch (error) {
    res.status(500).json({ error: "Error accepting assignment" });
  }
};

// Reject assignment
const rejectAssignment = async (req, res) => {
  const assignmentId = req.params.id;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    assignment.status = "rejected";
    await assignment.save();

    res.json({ message: "Assignment rejected" });
  } catch (error) {
    res.status(500).json({ error: "Error rejecting assignment" });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAssignments,
  acceptAssignment,
  rejectAssignment,
};
