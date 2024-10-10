const User = require("../models/userModel");
const Assignment = require("../models/assignmentModel");
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Helper function for input validation
const validateInput = (inputs, requiredFields, res) => {
  for (const field of requiredFields) {
    if (!inputs[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
};

// User registration
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  const validationError = validateInput(
    req.body,
    ["username", "password"],
    res
  );
  if (validationError) return;

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error); // Log the actual error for debugging
    res.status(500).json({ error: "Error registering user" });
  }
};

// User login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  const validationError = validateInput(
    req.body,
    ["username", "password"],
    res
  );
  if (validationError) return;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// Upload assignment
const uploadAssignment = async (req, res) => {
  const { userId, task, adminId } = req.body;

  // Validate input
  const validationError = validateInput(
    req.body,
    ["userId", "task", "adminId"],
    res
  );
  if (validationError) return;

  try {
    const assignment = new Assignment({ userId, task, adminId });
    await assignment.save();

    res.status(201).json({ message: "Assignment uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error uploading assignment" });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("_id username"); // only returning _id and username
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: "Error fetching admins" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  uploadAssignment,
  getAllAdmins,
};
