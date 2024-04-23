require('dotenv').config();
const crypto = require('crypto');

const secret = process.env.SECRET || 'default_secret';
const salt = process.env.SALT || crypto.randomBytes(16).toString('hex');  // You should store and retrieve the same salt

const key = crypto.scryptSync(secret, salt, 32); // Derive a 32-byte key

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encrypted = textParts.join(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt, key };

