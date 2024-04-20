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
router.post('/newPasswords', authenticateToken, async (req, res) => {
  const { url, useNumbers, useSymbols, length } = req.body;
  // If no password is provided, generate one
  const password = req.body.password || generateSecurePassword(length, useNumbers, useSymbols);

  try {
    const { userId } = req.user.userId;

    // Validate that the user provided both URL and password
    if (!url) {
      return res.status(400).json({ message: 'URL is required.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new password entry
    const newPasswordEntry = new Password({
      userId: userId,
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  try {
    const deletedPassword = await Password.findByIdAndDelete(req.params.id);
    if (!deletedPassword) {
      return res.status(404).json({ message: "Password not found" });
    }
    res.status(204).send();
    console.log("Password deleted");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all passwords for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const passwords = await Password.find()
      .populate('userId', 'username')
      .exec();
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;