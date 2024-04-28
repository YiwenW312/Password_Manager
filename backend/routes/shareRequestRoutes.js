// This file contains the routes for sharing passwords with other users.

// Require necessary NPM packages
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Password = require('../models/Password')
const User = require('../models/User')
const ShareRequest = require('../models/ShareRequest')
const { decrypt } = require('../utils/cryptoHelper')
const { authenticateToken } = require('../authMiddleware')

// Instantiate a Router
const router = express.Router()

// CREATE a new share request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { fromUserId, toUsername } = req.body;
    const toUser = await User.findOne({ username: toUsername });

    if (fromUserId === toUser._id.toString()) {
      return res.status(400).json({ message: 'Cannot share a password with yourself.' });
    }
    
    if (!toUser) {
      return res.status(404).json({ message: 'User to share with not found.' });
    }

    // Check if the password is already shared with the user (accepted or pending)
    const existingRequest = await ShareRequest.findOne({
      $or: [
        { from: fromUserId, to: toUser._id },
        { from: toUser._id, to: fromUserId }
      ],
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(409).json({ message: 'A share request already exists or the password is already shared.' });
    }

    const newShareRequest = new ShareRequest({
      from: fromUserId,
      to: toUser._id,
      status: 'pending'
    });

    await newShareRequest.save();
    res.status(201).json(newShareRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// CREATE: accept Share Request
router.post('/:id/accept', authenticateToken, async (req, res) => {
  try {
    const shareRequestId = req.params.id;
    const shareRequest = await ShareRequest.findById(shareRequestId);
    if (!shareRequest) {
      return res.status(404).json({ message: 'Share request not found.' });
    }

    if (shareRequest.status === 'accepted') {
      return res.status(400).json({ message: 'Share request already accepted.' });
    }

    // Update the status to 'accepted'
    shareRequest.status = 'accepted';
    await shareRequest.save();

    // Grant access to both users
    const { from, to } = shareRequest;
    const fromUserPasswords = await Password.find({ userId: from });
    const toUserPasswords = await Password.find({ userId: to });

    // Add each user to the other's password sharedWith field
    await Promise.all([
      ...fromUserPasswords.map(pwd => Password.findByIdAndUpdate(pwd._id, { $addToSet: { sharedWith: to } })),
      ...toUserPasswords.map(pwd => Password.findByIdAndUpdate(pwd._id, { $addToSet: { sharedWith: from } }))
    ]);

    res.json({ message: 'Share request accepted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// CREATE: reject Share Request
router.post('/:id/reject', authenticateToken, async (req, res) => {
  try {
    const shareRequestId = req.params.id
    const shareRequest = await ShareRequest.findById(shareRequestId)
    if (!shareRequest) {
      return res.status(404).json({ message: 'Share request not found.' })
    }
    shareRequest.status = 'rejected'
    await shareRequest.save()
    res.json({ message: 'Share request rejected.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET all pending share requests for a user
router.get('/:userId/pending', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const shareRequests = await ShareRequest.find({
      to: userId,
      status: 'pending'
    }).populate('from', 'username').exec();

    if (!shareRequests.length) {
      return res.status(404).json({ message: 'No pending share requests found.' });
    }

    // Formatting the response
    const response = shareRequests.map(request => ({
      id: request._id,
      fromUser: {
        id: request.from._id,
        username: request.from.username,
      },
      createdAt: request.createdAt,
      status: request.status
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching pending share requests:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router
