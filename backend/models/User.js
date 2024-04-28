const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const mongooseEncryption = require('mongoose-encryption')
// This is the schema for the user model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
  }
  next()
})

const secret = process.env.SECRET
userSchema.plugin(mongooseEncryption, {
  secret: secret,
  encryptedFields: ['password']
})

const User = mongoose.model('User', userSchema)

module.exports = User
