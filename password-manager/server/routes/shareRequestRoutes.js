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
        status: 'pending' // default status
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
  
      // You would also want to add the 'to' user ID to the Password entry's sharedWith field
      // assuming your Password schema has a sharedWith field that keeps track of user IDs
      await Password.findByIdAndUpdate(shareRequest.passwordId, {
        $push: { sharedWith: shareRequest.to }
      });
  
      res.json({ message: "Share request accepted." });
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
  
  // Fetch Shared Passwords
  router.get('/passwords/shared/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      // Fetch all passwords where the current user is in the sharedWith array
      const sharedPasswords = await Password.find({ sharedWith: userId });
      res.json(sharedPasswords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;