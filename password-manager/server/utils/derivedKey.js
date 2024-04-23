require('dotenv').config();
const crypto = require('crypto');

// Key derivation function to ensure the key is exactly 32 bytes long
function deriveKey(passphrase, salt) {
  return crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
}

// Assuming your SECRET is stored in .env and it's not exactly 32 bytes
const passphrase = process.env.SECRET; 
const salt = crypto.randomBytes(16);

const key = deriveKey(passphrase, salt);
console.log("Derived 32-byte key:", key.toString('hex'));

module.exports = { key, salt };