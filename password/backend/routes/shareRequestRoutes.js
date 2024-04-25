// This file contains the routes for sharing passwords with other users.

// Require necessary NPM packages
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Password = require('../models/Password')
const User = require('../models/User')
const ShareRequest = require('../models/ShareRequest')
const { decrypt } = require('../utils/cryptoHelper')
// Instantiate a Router
const router = express.Router()

// CREATE a new share request
router.post('/', async (req, res) => {
  try {
    const { fromUserId, toUsername, passwordId } = req.body
    const toUser = await User.findOne({ username: toUsername })
    if (!toUser) {
      return res.status(404).json({ message: 'User to share with not found.' })
    }
    const newShareRequest = new ShareRequest({
      from: fromUserId,
      to: toUser._id,
      passwordId: passwordId,
      status: 'pending'
    })
    await newShareRequest.save()
    res.status(201).json(newShareRequest)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// CREATE: accept Share Request
router.post('/:id/accept', async (req, res) => {
  try {
    const shareRequestId = req.params.id
    const shareRequest = await ShareRequest.findById(shareRequestId)
    if (!shareRequest) {
      return res.status(404).json({ message: 'Share request not found.' })
    }
    // Update share request status
    shareRequest.status = 'accepted'
    await shareRequest.save()
    const updatedPassword = await Password.findByIdAndUpdate(
      shareRequest.passwordId,
      { $addToSet: { sharedWith: shareRequest.to } },
      { new: true }
    )

    if (!updatedPassword) {
      return res.status(404).json({ message: 'Password not found.' })
    }

    res.json({ message: 'Share request accepted.', updatedPassword })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// CREATE: reject Share Request
router.post('/:id/reject', async (req, res) => {
  try {
    const shareRequestId = req.params.id
    const shareRequest = await ShareRequest.findById(shareRequestId)
    if (!shareRequest) {
      return res.status(404).json({ message: 'Share request not found.' })
    }
    // Update share request status to rejected
    shareRequest.status = 'rejected'
    await shareRequest.save()
    res.json({ message: 'Share request rejected.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// READ: fetch all share requests for a user
router.get('/passwords/shared/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    // Fetch all passwords where the current user is in the sharedWith array
    const sharedPasswords = await Password.find({ sharedWith: userId })
      .populate('userId', 'username')
      .populate('sharedWith', 'username')

    // Check if any shared passwords were found
    if (!sharedPasswords.length) {
      return res
        .status(404)
        .json({ message: 'No password shared by others for this user.' })
    }

    // Map through the passwords to decrypt and format the response
    const response = sharedPasswords.map(password => {
      if (!password.userId) {
        throw new Error('Password owner not found or not populated')
      }

      const decryptedPassword = decrypt(password.password)
      return {
        id: password._id,
        url: password.url,
        owner: password.username,
        sharedUsers: password.sharedWith.map(user => user.username),
        password: decryptedPassword
      }
    })
    res.json(response)
  } catch (error) {
    console.error('Fetch Shared Passwords Error:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
