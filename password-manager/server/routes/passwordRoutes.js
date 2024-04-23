// This is the passwordRoutes.js file that contains the routes for the password CRUD operations

// Require necessary NPM packages
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Password = require('../models/Password');
const { authenticateToken } = require('../authMiddleware');
const User = require('../models/User');
const generateSecurePassword = require('../utils/passwordGenerator');
const { key, salt } = require('../utils/cryptoHelper');
const { encrypt, decrypt } = require('../utils/cryptoHelper');
// Instantiate a Router
const router = express.Router();

// CREATE a new password
router.post('/newPasswords', authenticateToken, async (req, res) => {
  const { url, useNumbers, useSymbols, length } = req.body;
  // If no password is provided, generate one
  if (!req.body.password || req.body.password === "") {
    const password = generateSecurePassword(length, useNumbers, useSymbols);
    req.body.password = password;
  }else{
    const password = req.body.password;
  }
  try {
    const { userId } = req.user.userId;
    // Validate that the user provided both URL and password
    if (!url) {
      return res.status(400).json({ message: 'URL is required.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }
    
    // encrypt the password
    const encryptedPassword = encrypt(password);
    // Create a new password entry
    const newPasswordEntry = new Password({
      userId: userId,
      url,
      password: encryptedPassword
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

// UPDATE an existing password entry
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

// DELETE a password
router.delete('/:id', async (req, res) => {
  try {
    const deletedPassword = await Password.findByIdAndDelete(req.params.id);
    if (!deletedPassword) {
      return res.status(404).json({ message: "Password not found" });
    }
    res.status(204).json({ message: "Password deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ: Fetch all passwords for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const passwords = await Password.find({})
      .populate('userId', 'username')
      .exec();
    console.log("Passwords fetched:", passwords);
    if (!passwords.length) {
      return res.status(404).json({ message: "No passwords found for this user." });
    }

    // Map through the fetched passwords and decrypt each password
    let decryptedPasswords = passwords.map(p => {
      try {
        const decryptedPassword = decrypt(p.password);
        return { ...p.toObject(), password: decryptedPassword };
      } catch (error) {
        console.error("Decryption error:", error);
        return { ...p.toObject(), password: "Decryption failed" };
      }
    });

    console.log("Decrypted Passwords:", decryptedPasswords);
    res.json(decryptedPasswords);
  } catch (error) {
    console.error("Error fetching passwords:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;