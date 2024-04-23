// This is the userRoutes.js file that contains the routes for the user authentication operations

// Require necessary NPM packages
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Instantiate a Router
const router = express.Router();

// CREATE: Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    // Create a new user instance and save it to the database
    const newUser = new User({ username, password });
    await newUser.save();
    // Create a token
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET, { expiresIn: '1h' });
    // Respond with the new user and token
    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE: Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username.' });
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }
    // Create a token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });
    // Respond with the user and token
    res.json({
      user: {
        id: user._id,
        username: user.username
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE: Logout route (handled client-side by deleting the token)
router.post('/logout', (req, res) => {
  res.json({ message: "Logged out successfully" });
});


module.exports = router;