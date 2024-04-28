// This is the passwordRoutes.js file that contains the routes for the password CRUD operations

// Require necessary NPM packages
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Password = require('../models/Password')
const { authenticateToken } = require('../authMiddleware')
const User = require('../models/User')
const generateSecurePassword = require('../utils/passwordGenerator')
const { key, salt } = require('../utils/cryptoHelper')
const { encrypt, decrypt } = require('../utils/cryptoHelper')
// Instantiate a Router
const router = express.Router()

// CREATE a new password
router.post('/newPasswords', authenticateToken, async (req, res) => {
  const {
    url,
    useLetters,
    useNumbers,
    useSymbols,
    length,
    password: clientPassword
  } = req.body

  if (!url) {
    return res.status(400).json({ message: 'URL is required.' })
  }

  let password = clientPassword

  if (!password) {
    if (length < 4 || length > 50 || (!useLetters && !useNumbers && !useSymbols)) {
      return res.status(400).json({ message: 'Invalid password generation parameters. Password length must between 4-50. Password must include at least one of three: letter, symbol or number.' });
    }
    password = generateSecurePassword(length, useLetters, useNumbers, useSymbols);
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' })
  }

  try {
    const { userId } = req.user
    const encryptedPassword = encrypt(password)

    const newPasswordEntry = new Password({
      userId,
      url,
      password: encryptedPassword
    })

    await newPasswordEntry.save()

    res.status(201).json({
      _id: newPasswordEntry._id,
      user: newPasswordEntry.userId,
      url: newPasswordEntry.url,
      createdAt: newPasswordEntry.createdAt
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE an existing password entry
router.put('/:id', authenticateToken, async (req, res) => {
  const { url, password } = req.body
  const updateData = {}
  if (password) updateData.password = encrypt(password)
  if (url) updateData.url = url

  try {
    const updatedPassword = await Password.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    if (!updatedPassword) {
      return res.status(404).json({ message: 'Password not found' })
    }
    // Optionally, decrypt the password before sending it back if necessary
    // updatedPassword.password = decrypt(updatedPassword.password);
    res.json(updatedPassword)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE a password
router.delete('/:id', async (req, res) => {
  try {
    const deletedPassword = await Password.findByIdAndDelete(req.params.id)
    if (!deletedPassword) {
      return res.status(404).json({ message: 'Password not found' })
    }
    res.status(200).json({ message: 'Password deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// READ: Fetch all passwords for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetching passwords owned by the user and where the user is in the sharedWith array
    const ownedPasswords = await Password.find({ userId })
      .populate('userId', 'username')
      .exec();

    const sharedPasswords = await Password.find({ sharedWith: userId })
      .populate('userId', 'username')
      .exec();

    if (!ownedPasswords.length && !sharedPasswords.length) {
      return res.status(404).json({ message: 'No passwords found for this user.' });
    }

    // Decrypt passwords and classify them
    const decryptPassword = (password) => {
      try {
        return decrypt(password);
      } catch (error) {
        console.error('Decryption error:', error);
        return 'Decryption failed';
      }
    };

    const decryptedOwnedPasswords = ownedPasswords.map(p => ({
      ...p.toObject(),
      password: decryptPassword(p.password),
      type: 'own'
    }));

    const decryptedSharedPasswords = sharedPasswords.map(p => ({
      ...p.toObject(),
      password: decryptPassword(p.password),
      type: 'shared'
    }));

    // Combining both lists to send as a single response
    res.json([...decryptedOwnedPasswords, ...decryptedSharedPasswords]);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

