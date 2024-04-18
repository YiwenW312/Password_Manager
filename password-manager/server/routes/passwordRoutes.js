const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Password = require('../models/Password');

const router = express.Router();

// Password CRUD operations
// Create a new password
router.post('/passwords', async (req, res) => {
    const { userId, url, password } = req.body;
    try {
      const newPassword = new Password({ userId, url, password });
      await newPassword.save();
      res.status(201).json(newPassword);
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