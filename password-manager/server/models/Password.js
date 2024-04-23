const mongoose = require('mongoose');
const mongooseEncryption = require('mongoose-encryption');
// This is the schema for the password model
const passwordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  url: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const secret = process.env.SECRET;
passwordSchema.plugin(mongooseEncryption, { secret: secret, encryptedFields: ['password'] });

const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;
