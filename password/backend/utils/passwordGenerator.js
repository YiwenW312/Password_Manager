const crypto = require('crypto')
// Generate a secure password
const generateSecurePassword = (length, hasNumbers, hasSymbols) => {
  let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (hasNumbers) charset += '0123456789'
  if (hasSymbols) charset += '!@#$%^&*()_+-=[]{}|;:",.<>?'
  return Array.from(crypto.randomFillSync(new Uint8Array(length)))
    .map(byte => charset[byte % charset.length])
    .join('')
}

module.exports = generateSecurePassword
