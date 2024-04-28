require('dotenv').config()
const crypto = require('crypto')

const ENCRYPTION_KEY = Buffer.from(process.env.SECRET.padEnd(32), 'utf-8')

function encrypt (text) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

function decrypt (encryptedText) {
  const parts = encryptedText.split(':')
  const iv = Buffer.from(parts.shift(), 'hex')
  const encrypted = parts.join(':')
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = { encrypt, decrypt }
