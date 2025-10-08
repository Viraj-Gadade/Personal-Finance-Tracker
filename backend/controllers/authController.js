import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const user = await User.create({ email, password });
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Registration failed" });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
};

// Get profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ msg: "Profile data", userId: user.id, email: user.email });
};

// Update Email
const updateEmail = async (req, res) => {
  const { newEmail, password } = req.body;
  try {
    const user = await User.findById(req.user.id);

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ msg: "Incorrect password" });

    // Check if new email is already taken
    const existing = await User.findOne({ email: newEmail });
    if (existing) return res.status(400).json({ msg: "Email already in use" });

    user.email = newEmail;
    await user.save();

    const token = generateToken(user); // optional: send new token
    res.json({ msg: "Email updated successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update email" });
  }
};

// Update Password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ msg: "Incorrect current password" });

    user.password = newPassword;
    await user.save();

    const token = generateToken(user); // optional: send new token after password change
    res.json({ msg: "Password updated successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update password" });
  }
};

// Export all functions
export { register, login, getProfile, updateEmail, updatePassword };
