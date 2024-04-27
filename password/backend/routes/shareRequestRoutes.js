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
router.post('/:id/accept', async (req, res) => {
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
router.post('/:id/reject', async (req, res) => {
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

// READ: fetch all share requests for a user(receiver) by status
router.get('/passwords/shared/:userId', async (req, res) => {
  try {
    const { userId } = req.params; 
    const { status } = req.query; 

    let query = { to: userId }; 
    if (status) {
      query.status = status; 
    }

    const shareRequests = await ShareRequest.find(query)
      .populate({
        path: 'passwordId',
        populate: {
          path: 'userId',
          select: 'username'
        }
      })
      .populate('from', 'username') 
      .exec();

    if (!shareRequests.length) {
      return res.status(404).json({ message: `No share requests found with status '${status}' for this user.` });
    }

    const response = shareRequests.map(request => {
      if (!request.passwordId) {
        throw new Error('Associated password information is missing.');
      }
      const decryptedPassword = decrypt(request.passwordId.password); 
      return {
        id: request._id,
        url: request.passwordId.url,
        owner: request.passwordId.userId.username,
        from: request.from.username,
        password: decryptedPassword,
        status: request.status
      };
    });

    res.json(response);
  } catch (error) {
    console.error('Fetch Share Requests Error:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router
