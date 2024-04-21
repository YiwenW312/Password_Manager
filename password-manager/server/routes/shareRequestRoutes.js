const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Password = require('../models/Password');
const User = require('../models/User');
const ShareRequest = require('../models/ShareRequest');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { fromUserId, toUsername, passwordId } = req.body;
    const toUser = await User.findOne({ username: toUsername });
    if (!toUser) {
      return res.status(404).json({ message: "User to share with not found." });
    }
    const newShareRequest = new ShareRequest({
      from: fromUserId,
      to: toUser._id,
      passwordId: passwordId,
      status: 'pending'
    });
    await newShareRequest.save();
    res.status(201).json(newShareRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ACCEPT Share Request
router.post('/:id/accept', async (req, res) => {
  try {
    const shareRequestId = req.params.id;
    const shareRequest = await ShareRequest.findById(shareRequestId);
    if (!shareRequest) {
      return res.status(404).json({ message: "Share request not found." });
    }
    // Update share request status
    shareRequest.status = 'accepted';
    await shareRequest.save();
    const updatedPassword = await Password.findByIdAndUpdate(
      shareRequest.passwordId,
      { $addToSet: { sharedWith: shareRequest.to } },
      { new: true }
    );

    if (!updatedPassword) {
      return res.status(404).json({ message: "Password not found." });
    }

    res.json({ message: "Share request accepted.", updatedPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REJECT Share Request
router.post('/:id/reject', async (req, res) => {
  try {
    const shareRequestId = req.params.id;
    const shareRequest = await ShareRequest.findById(shareRequestId);
    if (!shareRequest) {
      return res.status(404).json({ message: "Share request not found." });
    }
    // Update share request status to rejected
    shareRequest.status = 'rejected';
    await shareRequest.save();
    res.json({ message: "Share request rejected." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/passwords/shared/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Requested shared passwords for user:", userId);

    // Fetch all passwords where the current user is in the sharedWith array
    const sharedPasswords = await Password.find({ sharedWith: userId })
      .populate('userId', 'username')
      .populate('sharedWith', 'username'); // Populating shared users' usernames

    console.log("Shared passwords found:", sharedPasswords);
    console.log("Shared passwords count:", sharedPasswords.length);
    console.log("Shared passwords owner:", sharedPasswords[0].userId?.username);
    console.log("Shared passwords shared users details:", sharedPasswords[0].sharedWith);


    if (!sharedPasswords.length) {
      return res.status(404).json({ message: "No shared passwords found for this user." });
    }

    const response = sharedPasswords.map(password => ({
      id: password._id,
      url: password.url,
      owner: password.userId?.username,
      sharedUsers: password.sharedWith
    }));

    console.log("Response to be sent:", response);
    res.json(response);
  } catch (error) {
    console.error('Fetch Shared Passwords Error:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;