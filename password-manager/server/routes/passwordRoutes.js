const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Password = require('../models/Password');
const { authenticateToken } = require('../authMiddleware');
const User = require('../models/User');
const generateSecurePassword = require('../utils/passwordGenerator');

const router = express.Router();

// Password CRUD operations
// Create a new password
router.post('/passwords', authenticateToken, async (req, res) => {
  const { url, useNumbers, useSymbols, length } = req.body;
  // If no password is provided, generate one
  const password = req.body.password || generateSecurePassword(length, useNumbers, useSymbols);
  
  try {
    const { userId } = req.user; // Extracted from token after middleware authentication
    const { url, password } = req.body;

    // Validate that the user provided both URL and password
    if (!url || !password) {
      return res.status(400).json({ message: 'URL and password are required.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new password entry
    const newPasswordEntry = new Password({
      user: userId,
      url,
      password: hashedPassword
    });

    // Save the new password entry to the database
    await newPasswordEntry.save();

    // Respond with the created password entry, excluding the hashed password
    res.status(201).json({
      _id: newPasswordEntry._id,
      user: newPasswordEntry.user,
      url: newPasswordEntry.url,
      createdAt: newPasswordEntry.createdAt
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  
  // Update an existing password
  router.put('/passwords/:id', async (req, res) => {
    const { password } = req.body;
    try {
      const updatedPassword = await Password.findByIdAndUpdate(req.params.id, { password }, { new: true });
      if (!updatedPassword) {
        return res.status(404).json({ message: "Password not found" });
      }
      res.json(updatedPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a password
  router.delete('/passwords/:id', async (req, res) => {
    try {
      const deletedPassword = await Password.findByIdAndDelete(req.params.id);
      if (!deletedPassword) {
        return res.status(404).json({ message: "Password not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Fetch all passwords for a user
  router.get('/passwords/user/:userId', async (req, res) => {
    try {
      const passwords = await Password.find({ userId: req.params.userId });
      res.json(passwords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;