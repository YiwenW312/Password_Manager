require('dotenv').config()
const crypto = require('crypto')

function deriveKey (passphrase, salt) {
  return crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256')
}

const passphrase = process.env.SECRET
const salt = crypto.randomBytes(16)

const key = deriveKey(passphrase, salt)

module.exports = { key, salt }
