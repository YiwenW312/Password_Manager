const mongoose = require('mongoose');

const shareRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  passwordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Password', required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ShareRequest = mongoose.model('ShareRequest', shareRequestSchema);

module.exports = ShareRequest;
